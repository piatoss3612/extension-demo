import { withErrorBoundary, withSuspense } from '@extension/shared';
import { useNotification } from '@src/hooks/useNotification';

const Calendar = () => {
  const { toggle, requireInteraction } = useNotification();

  return (
    <div className="container">
      <header className="header">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="mt-4 flex flex-col items-center p-4">
          <p>
            {`Click the button below to show a web notification. ${
              requireInteraction ? 'It will require interaction.' : 'It will not require interaction.'
            } It will show after 3 seconds.`}
          </p>
          <button
            className="mt-4 rounded bg-blue-500 px-4 py-1 font-bold text-white shadow hover:scale-105"
            onClick={toggle}>
            {requireInteraction ? 'Disable' : 'Enable'} Require Interaction
          </button>
          <button
            className="mt-4 rounded bg-blue-500 px-4 py-1 font-bold text-white shadow hover:scale-105"
            onClick={() =>
              chrome.runtime.sendMessage({
                type: 'NOTIFICATION',
                message: 'Hello from Side Panel! I am a Notification!',
                requireInteraction,
              })
            }>
            Show Notification
          </button>
        </div>
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Calendar, <div> Loading ... </div>), <div> Error Occur </div>);
