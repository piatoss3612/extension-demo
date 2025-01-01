import { withErrorBoundary, withSuspense } from '@extension/shared';
import { useEffect, useState } from 'react';

const Home = () => {
  const logo = 'side-panel/temp_logo.png';
  const goGithubSite = () => chrome.tabs.create({ url: 'https://github.com/piatoss3612/extension-demo' });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  } | null>(null);
  const [userInfo, setUserInfo] = useState<{
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
  } | null>(null);
  const [calendars, setCalendars] = useState<
    {
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
    }[]
  >([]);

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

        console.log('data: ', data);

        setAuthToken(data);
      },
    );
  };

  const getUserInfo = async () => {
    if (!authToken) {
      return;
    }

    setIsLoading(true);

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
      setIsLoading(false);
      return;
    }

    if (response.status === 401) {
      setAuthToken(null);
      setIsLoading(false);
      return;
    }

    const data = await response.json();

    setUserInfo(data);
    setIsLoading(false);
  };

  const getCalendars = async () => {
    if (!authToken) {
      return;
    }

    setIsLoading(true);

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

    const data = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      return;
    }

    if (response.status === 401) {
      setAuthToken(null);
      setIsLoading(false);
      return;
    }

    setCalendars(data.items);

    setIsLoading(false);
  };

  useEffect(() => {
    if (!authToken) {
      return;
    }

    const interval = setInterval(async () => {
      // refresh token
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

      console.log('refreshed data: ', data);

      setAuthToken(prev => {
        if (prev) {
          return {
            ...prev,
            access_token: data.access_token,
            expires_in: data.expires_in,
          };
        }

        return null;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [authToken]);

  return (
    <div className="container">
      <header className="header">
        <h1 className="text-2xl font-bold">Sidekick</h1>
        <button onClick={goGithubSite} className="mt-4">
          <img src={chrome.runtime.getURL(logo)} className="size-60" alt="logo" />
        </button>
        {userInfo && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-sm font-bold">User Info</p>
            <img src={userInfo.picture} alt="user" className="size-10 rounded-full" />
            <p className="text-sm">{userInfo.name}</p>
            <p className="text-sm">{userInfo.email}</p>
          </div>
        )}
        {calendars.length > 0 && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-sm font-bold">Calendars</p>
            {calendars.map(calendar => (
              <div key={calendar.id} className="flex flex-col items-center gap-2">
                <p className="text-sm">{calendar.summary}</p>
              </div>
            ))}
          </div>
        )}
        {!authToken && (
          <button
            className="mt-4 rounded bg-blue-500 px-4 py-1 font-bold text-white shadow hover:scale-105"
            onClick={onLaunchWebAuthFlow}>
            {isLoading ? 'Loading...' : 'Get Auth Token'}
          </button>
        )}
        {authToken && (
          <>
            <button
              className="mt-4 rounded bg-blue-500 px-4 py-1 font-bold text-white shadow hover:scale-105"
              onClick={getUserInfo}>
              {isLoading ? 'Loading...' : 'Get User Info'}
            </button>
            <button
              className="mt-4 rounded bg-blue-500 px-4 py-1 font-bold text-white shadow hover:scale-105"
              onClick={getCalendars}>
              {isLoading ? 'Loading...' : 'Get Calendars'}
            </button>
            <button
              onClick={() => {
                setAuthToken(null);
                setUserInfo(null);
                setCalendars([]);
              }}
              className="mt-4 rounded bg-blue-500 px-4 py-1 font-bold text-white shadow hover:scale-105">
              Logout
            </button>
          </>
        )}
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Home, <div> Loading ... </div>), <div> Error Occur </div>);
