// Authentication functions - now using the auth service
function isAuthenticated() {
  return window.authService.isAuthenticated();
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

async function signOut() {
  console.log('Sign out initiated from settings page');
  
  // Clear subscription cache
  subscriptionCache = {
    data: null,
    timestamp: 0,
    ttl: 5 * 60 * 1000
  };
  
  try {
    await window.authService.signOut();
    
    // Update navigation immediately
    updateNavigation();
    
    // Redirect to home page instead of reloading
    window.location.href = '/';
  } catch (error) {
    console.error('Error during sign out:', error);
    // Fallback: clear tokens manually and redirect
    window.authService.clearStoredTokens();
    updateNavigation();
    window.location.href = '/';
  }
}

// Cache for subscription status to avoid repeated API calls
let subscriptionCache = {
  data: null,
  timestamp: 0,
  ttl: 5 * 60 * 1000 // 5 minutes cache
};

async function getSubscriptionStatus(forceRefresh = false) {
  if (!isAuthenticated()) return null;
  
  // Deprecated: replaced by /profile/ endpoint usage inside updateSubscriptionDisplay
  return null;
}

async function updateSubscriptionDisplay(forceRefresh = false) {
  if (!isAuthenticated()) return;
  
  try {
    const response = await fetch(`${window.slesh_endpoint}/profile/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getCookie('authToken') || localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to load profile');
    const profile = await response.json();
    
    if (!profile.success) {
      throw new Error(profile.message || 'Failed to load profile data');
    }

    const planName = profile.subscriptionPlan || 'starter';
    const planDisplay = planName === 'starter' ? 'Free' : (planName.charAt(0).toUpperCase() + planName.slice(1));

    document.getElementById('plan-name-display').textContent = planDisplay;
    document.getElementById('plan-status-display').textContent = planName === 'starter' ? 'No billing required' : 'Billing active';
    document.getElementById('plan-badge-display').textContent = 'Active';

    const limits = profile.limits || {};
    const usage = profile.usage || {};

    const apiUsed = usage.total_tokens || 0;
    const apiLimit = limits.total_tokens === -1 ? '∞' : (limits.total_tokens || 0).toLocaleString();
    document.getElementById('usage-api').textContent = `${apiUsed.toLocaleString()} / ${apiLimit}`;

    const pdfUsed = usage.pdf_counter || 0;
    const pdfLimit = limits.pdf_counter === -1 ? '∞' : (limits.pdf_counter || 0).toLocaleString();
    document.getElementById('usage-pdfs').textContent = `${pdfUsed.toLocaleString()} / ${pdfLimit}`;

    const videoUsed = usage.video_counter || 0;
    const videoLimit = limits.video_counter === -1 ? '∞' : (limits.video_counter || 0).toLocaleString();
    document.getElementById('usage-videos').textContent = `${videoUsed.toLocaleString()} / ${videoLimit}`;

    const autoUsed = usage.automations_counter || 0;
    const autoLimit = limits.automations_counter === -1 ? '∞' : (limits.automations_counter || 0).toLocaleString();
    document.getElementById('usage-automations').textContent = `${autoUsed.toLocaleString()} / ${autoLimit}`;

    if (planName === 'starter') {
      document.getElementById('upgradePlanBtn').style.display = 'inline-block';
      document.getElementById('manageSubscriptionBtn').style.display = 'none';
    } else {
      document.getElementById('upgradePlanBtn').style.display = 'none';
      document.getElementById('manageSubscriptionBtn').style.display = 'inline-block';
    }
  } catch (err) {
    console.error('Error loading profile:', err);
  }
}

// Function to show/hide loading state
function showLoadingState() {
  document.getElementById('loadingContainer').style.display = 'flex';
  document.getElementById('mainContent').style.display = 'none';
}

function hideLoadingState() {
  document.getElementById('loadingContainer').style.display = 'none';
  document.getElementById('mainContent').style.display = 'block';
}

// Function to initialize the page with proper loading state
async function initializePage() {
  if (!isAuthenticated()) {
    // User not authenticated, redirect to login
    window.location.href = '/login/';
    return;
  }

  // User is authenticated, show loading state
  showLoadingState();
  
  try {
    // Wait for subscription data to load
    await updateSubscriptionDisplay();
    
    // Load connected apps data
    await loadConnectedApps();
    
    // Handle OAuth redirect success
    handleOAuthRedirect();
    
    // Hide loading and show content
    hideLoadingState();
  } catch (error) {
    console.error('Error initializing page:', error);
    // Show content even if there's an error
    hideLoadingState();
  }
}

async function openManageSubscription() {
  if (!isAuthenticated()) {
    alert('Please sign in to manage your subscription');
    return;
  }
  
  try {
    const response = await fetch(`${window.slesh_endpoint}/stripe/dashboard/create-portal-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getCookie('authToken') || localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const portalWindow = window.open(data.url, '_blank');
      
      // Check if portal window was opened successfully
      if (portalWindow) {
        // Simple timeout approach - refresh after portal interaction
        // This avoids COOP policy issues with window.closed checks
        setTimeout(() => {
          updateSubscriptionDisplay(true);
        }, 5000); // Refresh after 5 seconds
      }
    } else {
      alert('Unable to open subscription management. Please try again.');
    }
  } catch (error) {
    console.error('Error opening subscription portal:', error);
    alert('Error opening subscription management. Please try again.');
  }
}

function updateNavigation() {
  const loginLinks = document.querySelectorAll('.login-link');
  const isLoggedIn = isAuthenticated();
  
  // Update login/account links - always show "Account"
  loginLinks.forEach(link => {
    link.textContent = 'Account';
    if (isLoggedIn) {
      // User is logged in, go to account page
      link.href = '/account';
    } else {
      // User is not logged in, go to login page
      link.href = '/login';
    }
    link.classList.remove('sign-out-link');
    link.onclick = null;
  });
  
  // Note: Subscription display is now handled by initializePage()
  // to prevent stuttering during page load
}

// Handle OAuth redirect success
function handleOAuthRedirect() {
  const urlParams = new URLSearchParams(window.location.search);
  const connected = urlParams.get('connected');
  const status = urlParams.get('status');
  
  if (connected && status === 'success') {
    // Show success message
    const appName = connected === 'google-drive' ? 'Google Drive' : 
                   connected === 'gmail' ? 'Gmail' : 
                   connected === 'google-calendar' ? 'Google Calendar' : 
                   connected === 'x' ? 'X' :
                   'App';
    
    alert(`${appName} has been successfully connected!`);
    
    // Clean up URL parameters
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
    
    // Refresh connected apps to show the new connection
    loadConnectedApps();
  } else if (connected && status === 'cancelled') {
    // Show cancelled message
    const appName = connected === 'google-drive' ? 'Google Drive' : 
                   connected === 'gmail' ? 'Gmail' : 
                   connected === 'google-calendar' ? 'Google Calendar' : 
                   connected === 'x' ? 'X' :
                   'App';
    
    alert(`${appName} connection was cancelled.`);
    
    // Clean up URL parameters
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }
}

// Connected Apps Functions
async function loadConnectedApps() {
  if (!isAuthenticated()) return;
  
  try {
    const response = await fetch(`${window.slesh_endpoint}/connected-apps/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getCookie('authToken') || localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        updateConnectedAppsDisplay(data.connectedApps || []);
      }
    }
  } catch (error) {
    console.error('Error loading connected apps:', error);
  }
}

function updateConnectedAppsDisplay(connectedApps) {
  // Find Google Drive connection
  const googleDriveApp = connectedApps.find(app => app.app_name === 'google_drive');
  if (googleDriveApp) {
    updateGoogleDriveStatus(googleDriveApp);
  } else {
    updateGoogleDriveStatus(null);
  }

  // Find Gmail connection
  const gmailApp = connectedApps.find(app => app.app_name === 'gmail');
  if (gmailApp) {
    updateGmailStatus(gmailApp);
  } else {
    updateGmailStatus(null);
  }

  // Find Google Calendar connection
  const googleCalendarApp = connectedApps.find(app => app.app_name === 'google_calendar');
  if (googleCalendarApp) {
    updateGoogleCalendarStatus(googleCalendarApp);
  } else {
    updateGoogleCalendarStatus(null);
  }

  // Find X connection
  const xApp = connectedApps.find(app => app.app_name === 'x');
  if (xApp) {
    updateXStatus(xApp);
  } else {
    updateXStatus(null);
  }
}

// Permission mapping for each app (excluding userinfo scopes)
const PERMISSION_MAPPINGS = {
  google_drive: {
    'https://www.googleapis.com/auth/drive': {
      name: 'Full Drive Access',
      description: 'View, edit, create, and delete all files in your Google Drive'
    },
    'https://www.googleapis.com/auth/drive.file': {
      name: 'Create/Edit Files',
      description: 'Create and edit files in your Google Drive'
    },
    'https://www.googleapis.com/auth/documents': {
      name: 'Google Docs',
      description: 'Access and edit Google Docs documents'
    },
    'https://www.googleapis.com/auth/spreadsheets': {
      name: 'Google Sheets',
      description: 'Access and edit Google Sheets spreadsheets'
    },
    'https://www.googleapis.com/auth/presentations': {
      name: 'Google Slides',
      description: 'Access and edit Google Slides presentations'
    }
  },
  gmail: {
    'https://www.googleapis.com/auth/gmail.readonly': {
      name: 'Read Messages',
      description: 'View your Gmail messages'
    },
    'https://www.googleapis.com/auth/gmail.send': {
      name: 'Send Messages',
      description: 'Send emails on your behalf'
    },
    'https://www.googleapis.com/auth/gmail.modify': {
      name: 'Modify Messages',
      description: 'Mark messages as read, delete, or organize'
    }
  },
  google_calendar: {
    'https://www.googleapis.com/auth/calendar': {
      name: 'Full Calendar Access',
      description: 'View and manage all your calendars'
    },
    'https://www.googleapis.com/auth/calendar.events': {
      name: 'Manage Events',
      description: 'Create, edit, and delete calendar events'
    },
    'https://www.googleapis.com/auth/calendar.freebusy': {
      name: 'Availability',
      description: 'View your availability in your calendars'
    }
  },
  x: {
    'users.read': {
      name: 'Account Verification',
      description: 'Verify you own this X account for @SleshGo interactions'
    }
  }
};

// All possible scopes for each app (excluding userinfo scopes)
const ALL_SCOPES = {
  google_drive: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/presentations',
  ],
  gmail: [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.modify'
  ],
  google_calendar: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.freebusy'
  ],
  x: [
    'users.read'
  ]
};

function updatePermissionTooltip(appName, grantedScopes, connection = null) {
  const tooltipId = `${appName}Tooltip`;
  const permissionsId = `${appName}Permissions`;
  const tooltip = document.getElementById(tooltipId);
  const permissionsList = document.getElementById(permissionsId);
  
  // Convert appName to match ALL_SCOPES keys
  const scopeKey = appName === 'googleDrive' ? 'google_drive' : 
                  appName === 'googleCalendar' ? 'google_calendar' : 
                  appName;
  
  if (!tooltip || !permissionsList) {
    return;
  }

  const allScopes = ALL_SCOPES[scopeKey] || [];
  const permissionMapping = PERMISSION_MAPPINGS[scopeKey] || {};
  
  // Process permission tooltip
  
  // Clear existing permissions
  permissionsList.innerHTML = '';

  // Add each permission with status (show ALL possible scopes, not just granted ones)
  allScopes.forEach(scope => {
    const isGranted = grantedScopes && grantedScopes.includes(scope);
    const permission = permissionMapping[scope];
    
    if (permission) {
      const li = document.createElement('li');
      li.className = 'permission-item';
      
      // Customize permission name for X account verification
      let permissionName = permission.name;
      if (appName === 'x' && scope === 'users.read' && connection && connection.provider_user_email) {
        permissionName = `Account Verification for @${connection.provider_user_email}`;
      }
      
      li.innerHTML = `
        <div class="permission-icon ${isGranted ? 'granted' : 'denied'}">
          ${isGranted ? '✓' : '✗'}
        </div>
        <div class="permission-name">${permissionName}</div>
      `;
      
      permissionsList.appendChild(li);
      
      // Add description as a separate item that spans full width
      if (permission.description) {
        const descLi = document.createElement('li');
        descLi.className = 'permission-description';
        descLi.textContent = permission.description;
        descLi.style.gridColumn = '1 / -1';
        descLi.style.marginLeft = '28px';
        descLi.style.marginTop = '-4px';
        descLi.style.marginBottom = '8px';
        permissionsList.appendChild(descLi);
      }
    }
  });
}

function updateButtonGroup(appName, connectionType, buttonGroupId) {
  const buttonGroup = document.getElementById(buttonGroupId);
  
  if (!buttonGroup) return;

  // Clear existing buttons
  buttonGroup.innerHTML = '';

  if (connectionType === 'partial') {
    // Only disconnect button for partial connections (simplified)
    const disconnectBtn = document.createElement('button');
    disconnectBtn.className = 'connect-button connected';
    disconnectBtn.textContent = 'Disconnect';
    disconnectBtn.onclick = () => handleConnection(`${appName}`, 'disconnect');

    buttonGroup.appendChild(disconnectBtn);
  } else if (connectionType === 'connected') {
    // Only disconnect button for full connections
    const disconnectBtn = document.createElement('button');
    disconnectBtn.className = 'connect-button connected';
    disconnectBtn.textContent = 'Disconnect';
    disconnectBtn.onclick = () => handleConnection(`${appName}`, 'disconnect');

    buttonGroup.appendChild(disconnectBtn);
  } else {
    // Only connect button for disconnected/expired/error states
    const connectBtn = document.createElement('button');
    connectBtn.className = 'connect-button';
    connectBtn.textContent = 'Connect';
    connectBtn.onclick = () => handleConnection(`${appName}`, 'connect');

    buttonGroup.appendChild(connectBtn);
  }
}

function handleConnection(appName, action) {
  if (action === 'connect') {
    if (appName === 'googleDrive') {
      connectGoogleDrive();
    } else if (appName === 'gmail') {
      showGoogleWarningDialog(appName);
    } else if (appName === 'googleCalendar') {
      connectGoogleCalendar();
    } else if (appName === 'x') {
      handleXConnection();
    }
  } else if (action === 'disconnect') {
    if (appName === 'googleDrive') handleGoogleDriveConnection();
    else if (appName === 'gmail') handleGmailConnection();
    else if (appName === 'googleCalendar') handleGoogleCalendarConnection();
    else if (appName === 'x') handleXConnection();
  }
}

function determineConnectionStatus(grantedScopes, allScopes) {
  if (!grantedScopes || grantedScopes.length === 0) {
    return 'disconnected';
  }
  
  // Check if all required scopes are granted
  const allScopesGranted = allScopes.every(scope => grantedScopes.includes(scope));
  
  if (allScopesGranted) {
    return 'connected';
  } else if (grantedScopes.length > 0) {
    return 'partial';
  } else {
    return 'disconnected';
  }
}

function updateGoogleDriveStatus(connection) {
  const statusElement = document.getElementById('googleDriveStatus');
  const statusIndicator = statusElement.querySelector('.status-indicator');
  const statusText = statusElement.querySelector('.status-text');
  
  if (connection && connection.connection_status === 'active') {
    const grantedScopes = connection.scopes || [];
    const allScopes = ALL_SCOPES.google_drive;
    const connectionType = determineConnectionStatus(grantedScopes, allScopes);
    
    // Connection status processed
    
    
    if (connectionType === 'connected') {
      statusIndicator.className = 'status-indicator connected';
      statusText.textContent = 'Connected';
      statusElement.className = 'connection-status permission-tooltip connected'; // Add tooltip class
      // Update permission tooltip
      updatePermissionTooltip('googleDrive', grantedScopes);
    } else if (connectionType === 'partial') {
      statusIndicator.className = 'status-indicator partial';
      statusText.textContent = 'Partially Connected';
      statusElement.className = 'connection-status permission-tooltip partial'; // Add tooltip class
      // Update permission tooltip
      updatePermissionTooltip('googleDrive', grantedScopes);
    }
    
    // Update button group
    updateButtonGroup('googleDrive', connectionType, 'googleDriveButtonGroup');
  } else if (connection && connection.connection_status === 'expired') {
    statusIndicator.className = 'status-indicator expired';
    statusText.textContent = 'Expired';
    statusElement.className = 'connection-status'; // Remove tooltip class
    updateButtonGroup('googleDrive', 'expired', 'googleDriveButtonGroup');
  } else if (connection && connection.connection_status === 'error') {
    statusIndicator.className = 'status-indicator error';
    statusText.textContent = 'Error';
    statusElement.className = 'connection-status'; // Remove tooltip class
    updateButtonGroup('googleDrive', 'error', 'googleDriveButtonGroup');
  } else {
    statusIndicator.className = 'status-indicator disconnected';
    statusText.textContent = 'Not Connected';
    statusElement.className = 'connection-status'; // Remove tooltip class
    updateButtonGroup('googleDrive', 'disconnected', 'googleDriveButtonGroup');
  }
}

function updateGmailStatus(connection) {
  const statusElement = document.getElementById('gmailStatus');
  const statusIndicator = statusElement.querySelector('.status-indicator');
  const statusText = statusElement.querySelector('.status-text');
  
  if (connection && connection.connection_status === 'active') {
    const grantedScopes = connection.scopes || [];
    const allScopes = ALL_SCOPES.gmail;
    const connectionType = determineConnectionStatus(grantedScopes, allScopes);
    
    
    if (connectionType === 'connected') {
      statusIndicator.className = 'status-indicator connected';
      statusText.textContent = 'Connected';
      statusElement.className = 'connection-status permission-tooltip connected'; // Add tooltip class
      // Update permission tooltip
      updatePermissionTooltip('gmail', grantedScopes);
    } else if (connectionType === 'partial') {
      statusIndicator.className = 'status-indicator partial';
      statusText.textContent = 'Partially Connected';
      statusElement.className = 'connection-status permission-tooltip partial'; // Add tooltip class
      // Update permission tooltip
      updatePermissionTooltip('gmail', grantedScopes);
    }
    
    // Update button group
    updateButtonGroup('gmail', connectionType, 'gmailButtonGroup');
  } else if (connection && connection.connection_status === 'expired') {
    statusIndicator.className = 'status-indicator expired';
    statusText.textContent = 'Expired';
    statusElement.className = 'connection-status'; // Remove tooltip class
    updateButtonGroup('gmail', 'expired', 'gmailButtonGroup');
  } else if (connection && connection.connection_status === 'error') {
    statusIndicator.className = 'status-indicator error';
    statusText.textContent = 'Error';
    statusElement.className = 'connection-status'; // Remove tooltip class
    updateButtonGroup('gmail', 'error', 'gmailButtonGroup');
  } else {
    statusIndicator.className = 'status-indicator disconnected';
    statusText.textContent = 'Not Connected';
    statusElement.className = 'connection-status'; // Remove tooltip class
    updateButtonGroup('gmail', 'disconnected', 'gmailButtonGroup');
  }
}

function updateGoogleCalendarStatus(connection) {
  const statusElement = document.getElementById('googleCalendarStatus');
  const statusIndicator = statusElement.querySelector('.status-indicator');
  const statusText = statusElement.querySelector('.status-text');
  
  if (connection && connection.connection_status === 'active') {
    const grantedScopes = connection.scopes || [];
    const allScopes = ALL_SCOPES.google_calendar;
    const connectionType = determineConnectionStatus(grantedScopes, allScopes);
    
    
    if (connectionType === 'connected') {
      statusIndicator.className = 'status-indicator connected';
      statusText.textContent = 'Connected';
      statusElement.className = 'connection-status permission-tooltip connected'; // Add tooltip class
      // Update permission tooltip
      updatePermissionTooltip('googleCalendar', grantedScopes);
    } else if (connectionType === 'partial') {
      statusIndicator.className = 'status-indicator partial';
      statusText.textContent = 'Partially Connected';
      statusElement.className = 'connection-status permission-tooltip partial'; // Add tooltip class
      // Update permission tooltip
      updatePermissionTooltip('googleCalendar', grantedScopes);
    }
    
    // Update button group
    updateButtonGroup('googleCalendar', connectionType, 'googleCalendarButtonGroup');
  } else if (connection && connection.connection_status === 'expired') {
    statusIndicator.className = 'status-indicator expired';
    statusText.textContent = 'Expired';
    statusElement.className = 'connection-status'; // Remove tooltip class
    updateButtonGroup('googleCalendar', 'expired', 'googleCalendarButtonGroup');
  } else if (connection && connection.connection_status === 'error') {
    statusIndicator.className = 'status-indicator error';
    statusText.textContent = 'Error';
    statusElement.className = 'connection-status'; // Remove tooltip class
    updateButtonGroup('googleCalendar', 'error', 'googleCalendarButtonGroup');
  } else {
    statusIndicator.className = 'status-indicator disconnected';
    statusText.textContent = 'Not Connected';
    statusElement.className = 'connection-status'; // Remove tooltip class
    updateButtonGroup('googleCalendar', 'disconnected', 'googleCalendarButtonGroup');
  }
}

async function handleGoogleDriveConnection() {
  if (!isAuthenticated()) {
    alert('Please sign in to connect apps');
    return;
  }
  
  // Check if we have a Google Drive connection by looking at the status
  const statusElement = document.getElementById('googleDriveStatus');
  const statusText = statusElement.querySelector('.status-text');
  const isConnected = statusText && (statusText.textContent === 'Connected' || statusText.textContent === 'Partially Connected');
  
  if (isConnected) {
    // Disconnect Google Drive
    if (confirm('Are you sure you want to disconnect Google Drive? This will revoke access to your Google Drive files.')) {
      await disconnectGoogleDrive();
    }
  } else {
    // Connect Google Drive
    await connectGoogleDrive();
  }
}

async function handleGmailConnection() {
  if (!isAuthenticated()) {
    alert('Please sign in to connect apps');
    return;
  }
  
  // Check if we have a Gmail connection by looking at the status
  const statusElement = document.getElementById('gmailStatus');
  const statusText = statusElement.querySelector('.status-text');
  const isConnected = statusText && (statusText.textContent === 'Connected' || statusText.textContent === 'Partially Connected');
  
  if (isConnected) {
    // Disconnect Gmail
    if (confirm('Are you sure you want to disconnect Gmail? This will revoke access to your Gmail messages.')) {
      await disconnectGmail();
    }
  } else {
    // Connect Gmail
    await connectGmail();
  }
}

async function handleGoogleCalendarConnection() {
  if (!isAuthenticated()) {
    alert('Please sign in to connect apps');
    return;
  }
  
  // Check if we have a Google Calendar connection by looking at the status
  const statusElement = document.getElementById('googleCalendarStatus');
  const statusText = statusElement.querySelector('.status-text');
  const isConnected = statusText && (statusText.textContent === 'Connected' || statusText.textContent === 'Partially Connected');
  
  if (isConnected) {
    // Disconnect Google Calendar
    if (confirm('Are you sure you want to disconnect Google Calendar? This will revoke access to your calendar events.')) {
      await disconnectGoogleCalendar();
    }
  } else {
    // Connect Google Calendar
    await connectGoogleCalendar();
  }
}

async function connectGoogleDrive() {
  try {
    const response = await fetch(`${window.slesh_endpoint}/connected-apps/google-drive/connect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getCookie('authToken') || localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.authUrl) {
        // Redirect to OAuth flow (no popup, no COOP issues)
        window.location.href = data.authUrl;
      }
    } else {
      alert('Failed to initiate Google Drive connection. Please try again.');
    }
  } catch (error) {
    console.error('Error connecting Google Drive:', error);
    alert('Error connecting Google Drive. Please try again.');
  }
}

async function disconnectGoogleDrive() {
  try {
    const response = await fetch(`${window.slesh_endpoint}/connected-apps/google-drive/disconnect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getCookie('authToken') || localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        // Refresh connected apps display
        await loadConnectedApps();
      } else {
        alert('Failed to disconnect Google Drive. Please try again.');
      }
    } else {
      alert('Failed to disconnect Google Drive. Please try again.');
    }
  } catch (error) {
    console.error('Error disconnecting Google Drive:', error);
    alert('Error disconnecting Google Drive. Please try again.');
  }
}

async function connectGmail() {
  try {
    const response = await fetch(`${window.slesh_endpoint}/connected-apps/gmail/connect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getCookie('authToken') || localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.authUrl) {
        // Redirect to OAuth flow (no popup, no COOP issues)
        window.location.href = data.authUrl;
      }
    } else {
      alert('Failed to initiate Gmail connection. Please try again.');
    }
  } catch (error) {
    console.error('Error connecting Gmail:', error);
    alert('Error connecting Gmail. Please try again.');
  }
}

async function disconnectGmail() {
  try {
    const response = await fetch(`${window.slesh_endpoint}/connected-apps/gmail/disconnect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getCookie('authToken') || localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        // Refresh connected apps display
        await loadConnectedApps();
      } else {
        alert('Failed to disconnect Gmail. Please try again.');
      }
    } else {
      alert('Failed to disconnect Gmail. Please try again.');
    }
  } catch (error) {
    console.error('Error disconnecting Gmail:', error);
    alert('Error disconnecting Gmail. Please try again.');
  }
}

async function connectGoogleCalendar() {
  try {
    const response = await fetch(`${window.slesh_endpoint}/connected-apps/google-calendar/connect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getCookie('authToken') || localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.authUrl) {
        // Redirect to OAuth flow (no popup, no COOP issues)
        window.location.href = data.authUrl;
      }
    } else {
      alert('Failed to initiate Google Calendar connection. Please try again.');
    }
  } catch (error) {
    console.error('Error connecting Google Calendar:', error);
    alert('Error connecting Google Calendar. Please try again.');
  }
}

async function disconnectGoogleCalendar() {
  try {
    const response = await fetch(`${window.slesh_endpoint}/connected-apps/google-calendar/disconnect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getCookie('authToken') || localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        // Refresh connected apps display
        await loadConnectedApps();
      } else {
        alert('Failed to disconnect Google Calendar. Please try again.');
      }
    } else {
      alert('Failed to disconnect Google Calendar. Please try again.');
    }
  } catch (error) {
    console.error('Error disconnecting Google Calendar:', error);
    alert('Error disconnecting Google Calendar. Please try again.');
  }
}

// ==================== X FUNCTIONS ====================

function updateXStatus(connection) {
  const statusElement = document.getElementById('xStatus');
  const statusIndicator = statusElement.querySelector('.status-indicator');
  const statusText = statusElement.querySelector('.status-text');
  
  if (connection && connection.connection_status === 'active') {
    const grantedScopes = connection.scopes || [];
    const allScopes = ALL_SCOPES.x;
    const connectionType = determineConnectionStatus(grantedScopes, allScopes);
    
    if (connectionType === 'connected') {
      statusIndicator.className = 'status-indicator connected';
      statusText.textContent = 'Connected';
      statusElement.className = 'connection-status permission-tooltip connected';
      // Update permission tooltip with connection data for user handle
      updatePermissionTooltip('x', grantedScopes, connection);
    } else if (connectionType === 'partial') {
      statusIndicator.className = 'status-indicator partial';
      statusText.textContent = 'Partially Connected';
      statusElement.className = 'connection-status permission-tooltip partial';
      // Update permission tooltip with connection data for user handle
      updatePermissionTooltip('x', grantedScopes, connection);
    }
    
    // Update button group
    updateButtonGroup('x', connectionType, 'xButtonGroup');
  } else if (connection && connection.connection_status === 'expired') {
    statusIndicator.className = 'status-indicator expired';
    statusText.textContent = 'Expired';
    statusElement.className = 'connection-status';
    updateButtonGroup('x', 'expired', 'xButtonGroup');
  } else if (connection && connection.connection_status === 'error') {
    statusIndicator.className = 'status-indicator error';
    statusText.textContent = 'Error';
    statusElement.className = 'connection-status';
    updateButtonGroup('x', 'error', 'xButtonGroup');
  } else {
    statusIndicator.className = 'status-indicator disconnected';
    statusText.textContent = 'Not Connected';
    statusElement.className = 'connection-status';
    updateButtonGroup('x', 'disconnected', 'xButtonGroup');
  }
}

async function handleXConnection() {
  if (!isAuthenticated()) {
    alert('Please sign in to connect apps');
    return;
  }
  
  // Check if we have an X connection by looking at the status
  const statusElement = document.getElementById('xStatus');
  const statusText = statusElement.querySelector('.status-text');
  const isConnected = statusText && (statusText.textContent === 'Connected' || statusText.textContent === 'Partially Connected');
  
  if (isConnected) {
    // Disconnect X
    if (confirm('Are you sure you want to disconnect X? This will remove verification for your X account.')) {
      await disconnectX();
    }
  } else {
    // Connect X
    await connectX();
  }
}

async function connectX() {
  try {
    const response = await fetch(`${window.slesh_endpoint}/connected-apps/x/connect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getCookie('authToken') || localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.authUrl) {
        // Redirect to OAuth flow (no popup, no COOP issues)
        window.location.href = data.authUrl;
      }
    } else {
      alert('Failed to initiate X connection. Please try again.');
    }
  } catch (error) {
    console.error('Error connecting X:', error);
    alert('Error connecting X. Please try again.');
  }
}

async function disconnectX() {
  try {
    const response = await fetch(`${window.slesh_endpoint}/connected-apps/x/disconnect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getCookie('authToken') || localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        // Refresh connected apps display
        await loadConnectedApps();
      } else {
        alert('Failed to disconnect X. Please try again.');
      }
    } else {
      alert('Failed to disconnect X. Please try again.');
    }
  } catch (error) {
    console.error('Error disconnecting X:', error);
    alert('Error disconnecting X. Please try again.');
  }
}

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', function() {
  updateNavigation();
  
  // Initialize the page with proper loading state
  initializePage();
  
  // Add event listeners for plan buttons
  document.getElementById('upgradePlanBtn').addEventListener('click', function() {
    window.location.href = '/pricing';
  });
  
  document.getElementById('manageSubscriptionBtn').addEventListener('click', openManageSubscription);
  
  // Dialog event listeners
  // Close dialog button
  document.getElementById('closeDialogBtn').addEventListener('click', hideGoogleWarningDialog);
  
  // Cancel connection button
  document.getElementById('cancelConnectionBtn').addEventListener('click', hideGoogleWarningDialog);
  
  // Proceed with connection button
  document.getElementById('proceedConnectionBtn').addEventListener('click', proceedWithConnection);
  
  // Close dialog when clicking outside
  document.getElementById('googleWarningDialog').addEventListener('click', function(e) {
    if (e.target === this) {
      hideGoogleWarningDialog();
    }
  });
  
  // Close dialog with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const dialog = document.getElementById('googleWarningDialog');
      if (dialog.classList.contains('show')) {
        hideGoogleWarningDialog();
      }
    }
  });
  
  // Event listeners are now handled by the button group system
  // No need for individual button listeners
});

// Also check auth state when page becomes visible (for redirects)
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    // Small delay to ensure any redirects have completed
    setTimeout(() => {
      updateNavigation();
    }, 100);
  }
});

// Check auth state on page focus (for when user returns to tab)
window.addEventListener('focus', function() {
  setTimeout(() => {
    updateNavigation();
  }, 100);
});

// Reduced frequency auth state check (every 30 seconds instead of 2 seconds)
setInterval(() => {
  updateNavigation();
}, 30000);

// Check auth state when URL changes (for redirects)
let currentUrl = window.location.href;
setInterval(() => {
  if (currentUrl !== window.location.href) {
    currentUrl = window.location.href;
    // URL changed, update navigation
    setTimeout(() => {
      updateNavigation();
    }, 100);
  }
}, 1000); // Reduced from 100ms to 1000ms

// Toggle switch functionality
const usageToggle = document.getElementById("usageToggle");
let isEnabled = true; // Default state

usageToggle.addEventListener("click", function () {
  isEnabled = !isEnabled;
  usageToggle.classList.toggle("disabled", !isEnabled);
});

// Clear data button
document
  .getElementById("clearDataBtn")
  .addEventListener("click", function () {
    if (
      confirm(
        "Are you sure you want to clear all your conversations? This action cannot be undone."
      )
    ) {
      // Handle clear data action
      alert("All conversations have been cleared.");
    }
  });

// Delete account button
document
  .getElementById("deleteAccountBtn")
  .addEventListener("click", function () {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data."
      )
    ) {
      // Handle account deletion
      alert(
        "Account deletion initiated. You will receive a confirmation email."
      );
    }
  });

// Sign out button
document
  .getElementById("signOutBtn")
  .addEventListener("click", function () {
    if (
      confirm(
        "Are you sure you want to sign out? You will need to sign in again to access your account."
      )
    ) {
      signOut();
    }
  });

// Mobile menu functionality
const menu = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links-mobile");
menu.addEventListener("click", () => {
  menu.classList.toggle("open");
  navLinks.style.display =
    navLinks.style.display === "flex" ? "none" : "flex";
});

const navLinksMobile = document.querySelectorAll(".nav-links-mobile a");
navLinksMobile.forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    navLinks.style.display = "none";
  });
});

// ==================== GOOGLE WARNING DIALOG FUNCTIONS ====================

let pendingConnection = null; // Store which connection is pending

function showGoogleWarningDialog(appName) {
  console.log('showGoogleWarningDialog called with appName:', appName);
  pendingConnection = appName;
  const dialog = document.getElementById('googleWarningDialog');
  console.log('Dialog element found:', dialog);
  dialog.classList.add('show');
  
  // Prevent body scroll when dialog is open
  document.body.style.overflow = 'hidden';
}

function hideGoogleWarningDialog() {
  const dialog = document.getElementById('googleWarningDialog');
  dialog.classList.remove('show');
  
  // Restore body scroll
  document.body.style.overflow = '';
  
  // Clear pending connection
  pendingConnection = null;
}

function proceedWithConnection() {
  console.log('proceedWithConnection called, pendingConnection:', pendingConnection);
  
  if (!pendingConnection) {
    console.log('No pending connection, returning');
    return;
  }
  
  // Store the connection type before clearing it
  const connectionType = pendingConnection;
  
  // Hide dialog first
  hideGoogleWarningDialog();
  
  // Proceed with the actual connection using the regular connection logic
  if (connectionType === 'googleDrive') {
    connectGoogleDrive();
  } else if (connectionType === 'gmail') {
    connectGmail();
  } else if (connectionType === 'googleCalendar') {
    connectGoogleCalendar();
  }
}

