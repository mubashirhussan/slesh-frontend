const SUPABASE_URL = "https://app.slesh.ai";
const SLESH_ENDPOINT = "https://api.slesh.ai";
const REDIRECT_URL = window.location.origin + "/login/callback.html";

let currentAuthProvider = null;
let authWindow = null;

// Last used provider tracking
const LAST_USED_PROVIDER_KEY = 'slesh_last_used_provider';

function getLastUsedProvider() {
    return localStorage.getItem(LAST_USED_PROVIDER_KEY);
}

function setLastUsedProvider(provider) {
    localStorage.setItem(LAST_USED_PROVIDER_KEY, provider);
}

function updateLoginButtonsOrder() {
    const loginButtonsContainer = document.getElementById('loginButtons');
    const lastUsedProvider = getLastUsedProvider();
    
    console.log('updateLoginButtonsOrder called, lastUsedProvider:', lastUsedProvider);
    
    if (!lastUsedProvider) {
        console.log('No last used provider found, keeping default order');
        return;
    }
    
    // Reset to original state first
    resetLoginButtons();
    
    // Now get fresh references to the buttons
    const googleBtn = loginButtonsContainer.querySelector('.google-btn');
    const microsoftBtn = loginButtonsContainer.querySelector('.microsoft-btn');
    
    console.log('Found buttons:', { googleBtn: !!googleBtn, microsoftBtn: !!microsoftBtn });
    
    // Clear and reorder
    loginButtonsContainer.innerHTML = '';
    
    // Add last used indicator and reorder buttons
    if (lastUsedProvider === 'google') {
        console.log('Setting up Google as last used');
        addLastUsedIndicator(googleBtn, 'Google');
        loginButtonsContainer.appendChild(googleBtn);
        loginButtonsContainer.appendChild(microsoftBtn);
    } else if (lastUsedProvider === 'azure') {
        console.log('Setting up Microsoft as last used');
        addLastUsedIndicator(microsoftBtn, 'Microsoft');
        loginButtonsContainer.appendChild(microsoftBtn);
        loginButtonsContainer.appendChild(googleBtn);
    }
}

function addLastUsedIndicator(button, providerName) {
    // Add a subtle indicator to show this was last used
    const indicator = document.createElement('div');
    indicator.className = 'last-used-indicator';
    indicator.innerHTML = `<span class="last-used-text">Last used</span>`;
    
    // Insert the indicator before the button text
    const existingContent = button.innerHTML;
    button.innerHTML = '';
    button.appendChild(indicator);
    
    // Re-add the original content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'button-content';
    contentDiv.innerHTML = existingContent;
    button.appendChild(contentDiv);
    
    // Add special styling class
    button.classList.add('last-used-btn');
}

const loginButtons = document.getElementById('loginButtons');
const loadingState = document.getElementById('loadingState');
const successState = document.getElementById('successState');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');

function isAuthenticated() {
  const token = localStorage.getItem('supabase_access_token') || getCookie('supabase_access_token');
  return !!token;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function signOut() {
  
  sessionStorage.setItem('justSignedOut', 'true');
  
  
  clearStoredTokens();
  localStorage.removeItem('intendedPlan');
  localStorage.removeItem('intendedAction');
  
  // Clear last used provider on sign out (optional - you might want to keep this)
  // localStorage.removeItem(LAST_USED_PROVIDER_KEY);
  
  document.cookie = 'supabase_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  localStorage.removeItem('supabase_access_token');
  localStorage.removeItem('supabase_refresh_token');
  localStorage.removeItem('authToken');
  
  
  
  updateNavigation();
  
  window.location.href = '/';
}

function updateNavigation() {
  const loginLinks = document.querySelectorAll('.login-link');
  const isLoggedIn = isAuthenticated();
  
  loginLinks.forEach(link => {
    link.textContent = 'Account';
    if (isLoggedIn) {
      link.href = '/account';
    } else {
      link.href = '/login';
    }
    link.classList.remove('sign-out-link');
    link.onclick = null;
  });
}

document.addEventListener('DOMContentLoaded', function() {
    
    updateNavigation();
    
    // Initialize login buttons order based on last used provider
    // This should happen regardless of sign-out status
    updateLoginButtonsOrder();
    
    const justSignedOut = sessionStorage.getItem('justSignedOut');
    if (justSignedOut) {
        sessionStorage.removeItem('justSignedOut');
        return;
    }
    
    setTimeout(() => {
        checkExistingAuth();
    }, 100);
    
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const navLinks = document.querySelector('.nav-links-mobile');
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
});

async function checkExistingAuth() {
    try {
        const justSignedOut = sessionStorage.getItem('justSignedOut');
        if (justSignedOut) {
            sessionStorage.removeItem('justSignedOut');
            return;
        }
        
        const hasLocalToken = localStorage.getItem('supabase_access_token');
        const hasCookieToken = getCookie('supabase_access_token');
        const hasAuthToken = localStorage.getItem('authToken');
        
        if (!hasLocalToken && !hasCookieToken && !hasAuthToken) {
            return;
        }
        
        const token = hasLocalToken || hasCookieToken || hasAuthToken;
        if (token) {
            const userInfo = await getUserInfo(token);
            if (userInfo) {
                const intendedPlan = localStorage.getItem('intendedPlan');
                const intendedAction = localStorage.getItem('intendedAction');
                
                if (intendedPlan && intendedAction === 'upgrade') {
                    showSuccessState('Upgrade in progress...', 'Redirecting to pricing...');
                    setTimeout(() => {
                        window.location.href = '/pricing/';
                    }, 2000);
                } else {
                    showSuccessState('Already signed in!', 'Redirecting to account...');
                    setTimeout(() => {
                        window.location.href = '/account';
                    }, 2000);
                }
                return;
            } else {
                clearStoredTokens();
            }
        }
    } catch (error) {
        console.error('Error in checkExistingAuth:', error);
        clearStoredTokens();
    }
}

async function signIn(provider) {
    try {
        currentAuthProvider = provider;
        showLoadingState();
        
        let authUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(REDIRECT_URL)}`;
        
        if (provider === 'azure') {
            authUrl += '&scopes=email profile openid';
        }

        authWindow = window.open(authUrl, 'slesh_auth', 'width=500,height=600,scrollbars=yes,resizable=yes');
        
        if (!authWindow) {
            throw new Error('Popup blocked. Please allow popups for this site.');
        }

        const checkAuthCompletion = setInterval(async () => {
            try {
                if (authWindow.closed) {
                    clearInterval(checkAuthCompletion);
                    hideLoadingState();
                    return;
                }

                let currentUrl;
                try {
                    currentUrl = authWindow.location.href;
                } catch (error) {
                    // Cross-origin error - this is expected during OAuth flow
                    return;
                }
                
                if (currentUrl.startsWith(REDIRECT_URL)) {
                    clearInterval(checkAuthCompletion);
                    authWindow.close();
                    
                    const url = new URL(currentUrl);
                    const hash = url.hash.substring(1);
                    const params = new URLSearchParams(hash);
                    
                    let accessToken = params.get('access_token');
                    let refreshToken = params.get('refresh_token');
                    
                    const searchParams = new URLSearchParams(url.search);
                    const accessTokenFromSearch = searchParams.get('access_token');
                    const refreshTokenFromSearch = searchParams.get('refresh_token');
                    
                    accessToken = accessToken || accessTokenFromSearch;
                    refreshToken = refreshToken || refreshTokenFromSearch;

                    if (!accessToken) {
                        throw new Error('Access token not found in redirect URI');
                    }

                    await storeToken(accessToken);
                    if (refreshToken) {
                        await storeRefreshToken(refreshToken);
                    }
                    
                    const tokenExpiry = Date.now() + (3600 * 1000);
                    localStorage.setItem('token_expiry', tokenExpiry.toString());

                    const user = await getUserInfo(accessToken);
                    
                    if (user) {
                        // Store the provider that was successfully used for sign-in
                        setLastUsedProvider(provider);
                        
                        const intendedPlan = localStorage.getItem('intendedPlan');
                        const intendedAction = localStorage.getItem('intendedAction');
                        
                        if (intendedPlan && intendedAction === 'upgrade') {
                            showSuccessState('Successfully signed in!', 'Redirecting to pricing for upgrade...');
                            setTimeout(() => {
                                window.location.href = '/pricing/';
                            }, 2000);
                        } else {
                            showSuccessState('Successfully signed in!', 'Redirecting to account...');
                            setTimeout(() => {
                                window.location.href = '/account';
                            }, 2000);
                        }
                    } else {
                        throw new Error('Failed to get user information');
                    }
                }
            } catch (error) {
                console.error('Error in auth completion check:', error);
            }
        }, 100);

        setTimeout(() => {
            if (authWindow && !authWindow.closed) {
                authWindow.close();
                clearInterval(checkAuthCompletion);
                hideLoadingState();
                showError('Authentication timed out. Please try again.');
            }
        }, 300000);

    } catch (error) {
        console.error('Sign in failed:', error);
        hideLoadingState();
        showError(error.message || 'Authentication failed. Please try again.');
    }
}

async function getUserInfo(token) {
    try {
        const response = await fetch(`${SLESH_ENDPOINT}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
        });

        if (!response.ok) {
            throw new Error(`Failed to get user information: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.user) {
            return data.user;
        } else {
            throw new Error(data.message || 'Authentication failed');
        }
    } catch (error) {
        console.error('Error getting user info:', error);
        throw error;
    }
}

async function storeToken(token) {
    try {
        localStorage.setItem('supabase_access_token', token);
        localStorage.setItem('authToken', token);
    } catch (error) {
        console.error('Error storing token:', error);
        throw error;
    }
}

async function storeRefreshToken(token) {
    try {
        localStorage.setItem('supabase_refresh_token', token);
    } catch (error) {
        console.error('Error storing refresh token:', error);
        throw error;
    }
}

function clearStoredTokens() {
    try {
        localStorage.removeItem('supabase_access_token');
        localStorage.removeItem('supabase_refresh_token');
        localStorage.removeItem('authToken');
        
        localStorage.removeItem('user');
        localStorage.removeItem('user_id');
        localStorage.removeItem('email');
        
        sessionStorage.removeItem('justSignedOut');
    } catch (error) {
        console.error('Error clearing tokens:', error);
    }
}

function showLoadingState() {
    loginButtons.style.display = 'none';
    loadingState.style.display = 'block';
    successState.style.display = 'none';
    errorState.style.display = 'none';
}

function hideLoadingState() {
    loadingState.style.display = 'none';
}

function showSuccessState(title = 'Successfully signed in!', subtitle = 'Redirecting to dashboard...') {
    loginButtons.style.display = 'none';
    loadingState.style.display = 'none';
    successState.style.display = 'block';
    errorState.style.display = 'none';
    
    const successTitle = successState.querySelector('p:first-of-type');
    const redirectText = successState.querySelector('.redirect-text');
    
    if (successTitle) successTitle.textContent = title;
    if (redirectText) redirectText.textContent = subtitle;
}

function showError(message) {
    loginButtons.style.display = 'none';
    loadingState.style.display = 'none';
    successState.style.display = 'none';
    errorState.style.display = 'block';
    errorMessage.textContent = message;
}

function resetLoginState() {
    loginButtons.style.display = 'block';
    loadingState.style.display = 'none';
    successState.style.display = 'none';
    errorState.style.display = 'none';
    
    // Reset and reapply last used order (resetLoginButtons is called within updateLoginButtonsOrder)
    updateLoginButtonsOrder();
    
    clearStoredTokens();
}

function resetLoginButtons() {
    const loginButtonsContainer = document.getElementById('loginButtons');
    
    // Restore original button HTML structure
    loginButtonsContainer.innerHTML = `
        <button class="login-btn google-btn" onclick="signIn('google')">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
                <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
                <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
            </svg>
            Sign in with Google
        </button>
        <button class="login-btn microsoft-btn" onclick="signIn('azure')">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5 1.5H1.5V8.5H8.5V1.5Z" fill="#F25022"/>
                <path d="M16.5 1.5H9.5V8.5H16.5V1.5Z" fill="#7FBA00"/>
                <path d="M8.5 9.5H1.5V16.5H8.5V9.5Z" fill="#00A4EF"/>
                <path d="M16.5 9.5H9.5V16.5H16.5V9.5Z" fill="#FFB900"/>
            </svg>
            Sign in with Microsoft
        </button>
    `;
}

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible' && authWindow && authWindow.closed) {
        const justSignedOut = sessionStorage.getItem('justSignedOut');
        if (justSignedOut) {
            return;
        }
        
        setTimeout(() => {
            checkExistingAuth();
        }, 1000);
    }
});

window.addEventListener('beforeunload', function() {
    if (authWindow && !authWindow.closed) {
        authWindow.close();
    }
});

window.addEventListener('error', function(event) {
    console.error('Unhandled error:', event.error);
    hideLoadingState();
    showError('An unexpected error occurred. Please try again.');
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    hideLoadingState();
    showError('An unexpected error occurred. Please try again.');
});
