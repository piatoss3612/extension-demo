import { withErrorBoundary, withSuspense } from '@extension/shared';
import { useTheme } from '@src/hooks';
import { useState } from 'react';

const Home = () => {
  const { isLight } = useTheme();
  const logo = isLight ? 'side-panel/logo_vertical.svg' : 'side-panel/logo_vertical_dark.svg';
  const goGithubSite = () => chrome.tabs.create({ url: 'https://github.com/piatoss3612/extension-demo' });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getAuthToken = () => {
    setIsLoading(true);

    chrome.identity.getAuthToken({ interactive: true }, async token => {
      const init = {
        method: 'GET',
        async: true,
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        contentType: 'json',
      };

      const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', init);
      const data = await response.json();

      console.log(data);

      setIsLoading(false);
    });
  };

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
        <h1 className="text-2xl font-bold">Home</h1>
        <button onClick={goGithubSite} className="mt-4">
          <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
        </button>
        <button
          className="mt-4 rounded bg-blue-500 px-4 py-1 font-bold text-white shadow hover:scale-105"
          onClick={getAuthToken}>
          {isLoading ? 'Loading...' : 'Get Auth Token'}
        </button>
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Home, <div> Loading ... </div>), <div> Error Occur </div>);
