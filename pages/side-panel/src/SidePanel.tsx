import '@src/SidePanel.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { useState, type ComponentPropsWithoutRef } from 'react';

const SidePanel = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const logo = 'side-panel/smile_pepe.jpeg';
  const goGithubSite = () => chrome.tabs.create({ url: 'https://github.com/piatoss3612/extension-demo' });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getAuthToken = () => {
    setIsLoading(true);

    chrome.identity.getAuthToken({ interactive: true }, async token => {
      console.log(token);

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
        <button onClick={goGithubSite}>
          <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
        </button>
        <p>
          Edit <code>pages/side-panel/src/SidePanel.tsx</code>
        </p>
        <ToggleButton>Toggle theme</ToggleButton>
        <button
          className="mt-4 rounded bg-blue-500 px-4 py-1 font-bold text-white shadow hover:scale-105"
          onClick={getAuthToken}>
          {isLoading ? 'Loading...' : 'Get Auth Token'}
        </button>
        <button
          className="mt-4 rounded bg-blue-500 px-4 py-1 font-bold text-white shadow hover:scale-105"
          onClick={() =>
            chrome.runtime.sendMessage({
              type: 'WEB_NOTIFICATION',
              message: 'Hello from Side Panel! I am a Web Notification!',
            })
          }>
          Show Web Notification (3s delay)
        </button>
        <button
          className="mt-4 rounded bg-blue-500 px-4 py-1 font-bold text-white shadow hover:scale-105"
          onClick={() =>
            chrome.runtime.sendMessage({
              type: 'PUSH_NOTIFICATION',
              message: 'Hello from Side Panel! I am a Push Notification!',
            })
          }>
          Show Push Notification
        </button>
      </header>
    </div>
  );
};

const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const theme = useStorage(exampleThemeStorage);
  return (
    <button
      className={
        props.className +
        ' ' +
        'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
        (theme === 'light' ? 'bg-white text-black' : 'bg-black text-white')
      }
      onClick={exampleThemeStorage.toggle}>
      {props.children}
    </button>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
