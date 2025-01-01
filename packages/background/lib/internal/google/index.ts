const onLaunchWebAuthFlow = async () => {
  const manifest = chrome.runtime.getManifest();
  if (!manifest.oauth2) throw new Error('No OAuth2 configuration defined in the manifest file');

  const authUrl = new URL('https://accounts.google.com/o/oauth2/auth');
  const clientId = manifest.oauth2.client_id;

  const redirectUri = `https://${chrome.runtime.id}.chromiumapp.org`;

  const state = Math.random().toString(36).substring(7);
  const scopes = manifest.oauth2.scopes || [];

  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);

  authUrl.searchParams.set('scope', scopes.join(' '));
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('include_granted_scopes', 'true');
  authUrl.searchParams.set('prompt', 'consent');

  chrome.identity.launchWebAuthFlow(
    {
      url: authUrl.href,
      interactive: true,
    },
    async redirectUrl => {
      if (chrome.runtime.lastError) {
        console.error(`WebAuthFlow failed: ${chrome.runtime.lastError?.message}`);
        return;
      }

      if (!redirectUrl) {
        console.error('No redirect URL');
        return;
      }

      const params = new URLSearchParams(redirectUrl.split('?')[1]);
      const code = params.get('code');

      if (!code) {
        console.error('No code found');
        return;
      }

      const clientSecret = (manifest.oauth2 as unknown as { client_secret: string }).client_secret;

      console.log('clientSecret: ', clientSecret);

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      if (!response.ok) {
        console.error(`Failed to exchange code for token: ${response.statusText}`);
        return;
      }

      const data = (await response.json()) as { access_token: string; refresh_token: string; expires_in: number };

      return data;
    },
  );
};

const getUserInfo = async (authToken: { access_token: string; refresh_token: string; expires_in: number }) => {
  if (!authToken) {
    throw new Error('No auth token provided');
  }

  const init = {
    method: 'GET',
    async: true,
    headers: {
      Authorization: 'Bearer ' + authToken.access_token,
      'Content-Type': 'application/json',
    },
    contentType: 'json',
  };

  const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', init);

  if (!response.ok) {
    throw new Error(`Failed to get user info: ${response.statusText}`);
  }

  if (response.status === 401) {
    throw new Error('Unauthorized');
  }

  return (await response.json()) as {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
  };
};

const getCalendars = async (authToken: { access_token: string; refresh_token: string; expires_in: number }) => {
  if (!authToken) {
    throw new Error('No auth token provided');
  }

  const init = {
    method: 'GET',
    async: true,
    headers: {
      Authorization: 'Bearer ' + authToken.access_token,
      'Content-Type': 'application/json',
    },
    contentType: 'json',
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', init);

  if (!response.ok) {
    throw new Error(`Failed to get calendars: ${response.statusText}`);
  }

  if (response.status === 401) {
    throw new Error('Unauthorized');
  }

  const data = (await response.json()) as {
    items: {
      accessRole: string;
      backgroundColor: string;
      colorId: string;
      conferenceProperties: { allowedConferenceSolutionTypes: string[] };
      defaultReminders: { method: string; minutes: number }[];
      description: string;
      etag: string;
      foregroundColor: string;
      id: string;
      kind: string;
      notificationSettings: { notifications: { type: string; method: string }[] };
      primary: boolean;
      selected: boolean;
      summary: string;
      timeZone: string;
    }[];
  };

  return data.items;
};

const refreshToken = async (authToken: { access_token: string; refresh_token: string; expires_in: number }) => {
  if (!authToken) {
    throw new Error('No auth token provided');
  }

  const manifest = chrome.runtime.getManifest();
  if (!manifest.oauth2) throw new Error('No OAuth2 configuration defined in the manifest file');

  const clientId = manifest.oauth2.client_id;
  const clientSecret = (manifest.oauth2 as unknown as { client_secret: string }).client_secret;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: authToken.refresh_token,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    console.error(`Failed to refresh token: ${response.statusText}`);
    return;
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };

  return {
    ...authToken,
    access_token: data.access_token,
    expires_in: data.expires_in,
  };
};

export { onLaunchWebAuthFlow, getUserInfo, getCalendars, refreshToken };
