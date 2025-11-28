// SLESH_ENDPOINT will be loaded from constants.js

class LandingPageAuthService {
    constructor() {
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiry = null;
        this.refreshPromise = null;
        
        this.initializeTokens();
        this.setupTokenValidation();
    }

    initializeTokens() {
        try {
            this.accessToken = localStorage.getItem('supabase_access_token') || 
                              localStorage.getItem('authToken');
            this.refreshToken = localStorage.getItem('supabase_refresh_token');
            

            const expiryStr = localStorage.getItem('token_expiry');
            if (expiryStr) {
                this.tokenExpiry = parseInt(expiryStr);
            }
        } catch (error) {
            console.error('Error initializing tokens:', error);
        }
    }

    isTokenExpired() {
        if (!this.tokenExpiry) return false;
        
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        
        return now >= (this.tokenExpiry - fiveMinutes);
    }

    isAuthenticated() {
        return !!(this.accessToken && !this.isTokenExpired());
    }

    async getAccessToken() {
        if (this.isTokenExpired()) {
            const refreshed = await this.refreshAccessToken();
            if (!refreshed) {
                this.clearStoredTokens();
                return null;
            }
        }
        
        return this.accessToken;
    }

    async refreshAccessToken() {
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        this.refreshPromise = this._performTokenRefresh();
        try {
            const result = await this.refreshPromise;
            return result;
        } finally {
            this.refreshPromise = null;
        }
    }

    async _performTokenRefresh() {
        try {
            if (!this.refreshToken) {
                console.error('No refresh token available');
                return false;
            }

            const response = await fetch(`${window.slesh_endpoint}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    refresh_token: this.refreshToken 
                })
            });

            if (!response.ok) {
                console.error('Token refresh failed:', response.status, response.statusText);
                this.clearStoredTokens();
                return false;
            }

            const data = await response.json();
            
            if (data.session && data.session.access_token) {
                this.accessToken = data.session.access_token;
                await this.storeToken(data.session.access_token);
            }
            
            if (data.session && data.session.refresh_token) {
                this.refreshToken = data.session.refresh_token;
                await this.storeRefreshToken(data.session.refresh_token);
            }


            if (data.session && data.session.expires_at) {
                this.tokenExpiry = data.session.expires_at * 1000;
                localStorage.setItem('token_expiry', this.tokenExpiry.toString());
            }

            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.clearStoredTokens();
            return false;
        }
    }

    async storeToken(token) {
        try {
            this.accessToken = token;
            localStorage.setItem('supabase_access_token', token);
            localStorage.setItem('authToken', token);
        } catch (error) {
            console.error('Error storing token:', error);
            throw error;
        }
    }

    async storeRefreshToken(token) {
        try {
            this.refreshToken = token;
            localStorage.setItem('supabase_refresh_token', token);
        } catch (error) {
            console.error('Error storing refresh token:', error);
            throw error;
        }
    }

    clearStoredTokens() {
        try {
            this.accessToken = null;
            this.refreshToken = null;
            this.tokenExpiry = null;
            
            localStorage.removeItem('supabase_access_token');
            localStorage.removeItem('supabase_refresh_token');
            localStorage.removeItem('authToken');
            localStorage.removeItem('token_expiry');
            

            localStorage.removeItem('user');
            localStorage.removeItem('user_id');
            localStorage.removeItem('email');
            

            document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'supabase_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            
            console.log('All tokens cleared');
        } catch (error) {
            console.error('Error clearing tokens:', error);
        }
    }

    async makeAuthenticatedRequest(url, options = {}) {
        let authToken = await this.getAccessToken();
        
        if (!authToken) {
            throw new Error('No authentication token found');
        }


        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            'Authorization': `Bearer ${authToken}`,
        };


        let response = await fetch(url, {
            ...options,
            headers,
        });


        if (response.status === 401 || response.status === 403) {
            const refreshed = await this.refreshAccessToken();
            
            if (refreshed) {
                authToken = await this.getAccessToken();
                if (authToken) {
                    const retryHeaders = {
                        'Content-Type': 'application/json',
                        ...options.headers,
                        'Authorization': `Bearer ${authToken}`,
                    };
                    
                    response = await fetch(url, {
                        ...options,
                        headers: retryHeaders,
                    });
                } else {
                    throw new Error('Failed to get new token after refresh');
                }
            } else {
                throw new Error('Authentication failed - please sign in again');
            }
        }

        return response;
    }

    setupTokenValidation() {
        setInterval(async () => {
            if (this.accessToken && this.isTokenExpired()) {
                const refreshed = await this.refreshAccessToken();
                if (!refreshed) {
                    console.log('Token refresh failed, user needs to re-authenticate');
                    this.handleAuthenticationFailure();
                }
            }
        }, 60000);
    }

    handleAuthenticationFailure() {
        this.clearStoredTokens();
        

        if (typeof updateNavigation === 'function') {
            updateNavigation();
        }
        

        const currentPath = window.location.pathname;
        if (currentPath.includes('/pricing') || currentPath.includes('/account')) {
            localStorage.setItem('intendedPlan', '');
            localStorage.setItem('intendedAction', 'login');
            window.location.href = '/login/';
        }
    }

    async signOut() {
        try {
            if (this.accessToken) {
                await fetch(`${window.slesh_endpoint}/auth/signout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.warn('Error during server sign out, clearing local tokens anyway');
        }


        this.clearStoredTokens();
        

        sessionStorage.setItem('justSignedOut', 'true');
        
        console.log('User signed out successfully');
    }
}


const authService = new LandingPageAuthService();


window.authService = authService;


window.isAuthenticated = () => authService.isAuthenticated();
window.getAccessToken = () => authService.getAccessToken();
window.makeAuthenticatedRequest = (url, options) => authService.makeAuthenticatedRequest(url, options);
window.signOut = () => authService.signOut();
