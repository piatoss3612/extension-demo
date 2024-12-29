import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { useState } from 'react';
import { NavLink } from 'react-router';

const Notification = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';

  const [requireInteraction, setRequireInteraction] = useState<boolean>(false);

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
        <h1 className="text-2xl font-bold">Notification</h1>
        <div className="mt-8 flex flex-col items-center rounded-lg border border-gray-300 p-4">
          <h2 className={`${isLight ? 'text-gray-900' : 'text-gray-100'} text-center text-lg font-bold uppercase`}>
            Web Notification
          </h2>
          <p>
            {`Click the button below to show a web notification. ${
              requireInteraction ? 'It will require interaction.' : 'It will not require interaction.'
            } It will show after 3 seconds.`}
          </p>
          <button
            className="mt-4 rounded bg-blue-500 px-4 py-1 font-bold text-white shadow hover:scale-105"
            onClick={() => setRequireInteraction(!requireInteraction)}>
            {requireInteraction ? 'Disable' : 'Enable'} Require Interaction
          </button>
          <button
            className="mt-4 rounded bg-blue-500 px-4 py-1 font-bold text-white shadow hover:scale-105"
            onClick={() =>
              chrome.runtime.sendMessage({
                type: 'WEB_NOTIFICATION',
                message: 'Hello from Side Panel! I am a Web Notification!',
                requireInteraction,
              })
            }>
            Show Web Notification
          </button>
        </div>
        <div className="mt-4 flex flex-col items-center rounded-lg border border-gray-300 p-4">
          <NavLink to="/" className="font-bold text-blue-500 hover:underline">
            Go to Home
          </NavLink>
        </div>
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Notification, <div> Loading ... </div>), <div> Error Occur </div>);
