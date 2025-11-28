# Slesh Landing Page Login System

This directory contains the login functionality for the Slesh landing page, integrated with the same Supabase authentication system used by the Chrome extension.

## Files

- **`index.html`** - Main login page with Google and Microsoft OAuth buttons
- **`login.css`** - Styling for the login page (matches landing page design)
- **`login.js`** - Authentication logic and OAuth flow handling
- **`callback.html`** - OAuth callback handler page

## How It Works

### 1. Authentication Flow
1. User clicks "Sign In" button on landing page
2. Redirects to `/login` page
3. User chooses Google or Microsoft OAuth
4. Opens popup window for OAuth provider
5. After successful auth, redirects to `callback.html`
6. `callback.html` redirects back to login page
7. Login page detects tokens and completes authentication
8. User is redirected to home page or dashboard

### 2. Integration with Extension
- Uses same Supabase endpoints (`https://api.slesh.ai/auth/*`)
- Same token storage mechanism (localStorage)
- Compatible with extension's auth system
- Users can seamlessly switch between web and extension

### 3. Security Features
- Popup-based OAuth (prevents CSRF)
- Token validation on backend
- Secure token storage
- Automatic token refresh handling
- Error handling and user feedback

## Configuration

The system uses the same configuration as the extension:
- **Supabase URL**: `https://app.slesh.ai`
- **API Endpoint**: `https://api.slesh.ai`
- **Redirect URL**: `/login/callback.html`

## Styling

The login page maintains the same design language as the landing page:
- Geist font family
- Consistent color scheme
- Glassmorphism effects
- Responsive design
- Smooth animations

## Browser Compatibility

- Modern browsers with ES6+ support
- Popup blocking detection
- Mobile-friendly OAuth flow
- Fallback handling for various scenarios

## Usage

1. Navigate to `/login` from the landing page
2. Click "Sign In with Google" or "Sign In with Microsoft"
3. Complete OAuth flow in popup window
4. Return to main site authenticated

## Development

To modify the login system:
1. Update `login.js` for logic changes
2. Modify `login.css` for styling updates
3. Edit `index.html` for structural changes
4. Test OAuth flow in development environment

## Notes

- The system automatically handles existing authentication
- Tokens are stored in localStorage for persistence
- Error states provide clear user feedback
- Mobile devices use visibility change detection for OAuth completion
