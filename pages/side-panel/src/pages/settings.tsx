import { withErrorBoundary, withSuspense } from '@extension/shared';
import { useTheme } from '@src/hooks';
import { type ComponentPropsWithoutRef } from 'react';

const Settings = () => {
  const { isLight } = useTheme();

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="p-4">
          <ToggleButton>Toggle theme</ToggleButton>
        </div>
      </header>
    </div>
  );
};

const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const { isLight, toggle } = useTheme();
  return (
    <button
      className={
        props.className +
        ' ' +
        'font-bold mt-4 py-2 px-4 rounded-xl shadow hover:scale-105 ' +
        (isLight ? 'bg-white text-black' : 'bg-black text-white')
      }
      onClick={toggle}>
      {props.children}
    </button>
  );
};

export default withErrorBoundary(withSuspense(Settings, <div> Loading ... </div>), <div> Error Occur </div>);
