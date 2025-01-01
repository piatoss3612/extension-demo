import { withErrorBoundary, withSuspense } from '@extension/shared';

const Settings = () => {
  return (
    <div className="container">
      <header className="header">
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Settings, <div> Loading ... </div>), <div> Error Occur </div>);
