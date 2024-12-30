import { withErrorBoundary, withSuspense } from '@extension/shared';
import { useTheme } from '@src/hooks';
import { useState } from 'react';

const Home = () => {
  const { isLight } = useTheme();
  const logo = 'side-panel/logo.png';
  const goGithubSite = () => chrome.tabs.create({ url: 'https://github.com/piatoss3612/extension-demo' });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string>('');
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

  const getAuthToken = () => {
    setIsLoading(true);

    chrome.identity.getAuthToken({ interactive: true }, token => {
      setIsLoading(false);

      if (!token) {
        setAuthToken('');
        return;
      }

      setAuthToken(token);
    });
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
        Authorization: 'Bearer ' + authToken,
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
      setAuthToken('');
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
        Authorization: 'Bearer ' + authToken,
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
      setAuthToken('');
      setIsLoading(false);
      return;
    }

    setCalendars(data.items);

    setIsLoading(false);
  };

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
        <h1 className="text-2xl font-bold">Sidekick</h1>
        <button onClick={goGithubSite} className="mt-4">
          <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
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
            onClick={getAuthToken}>
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
          </>
        )}
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Home, <div> Loading ... </div>), <div> Error Occur </div>);
