import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { type ComponentPropsWithoutRef } from 'react';
import { NavLink } from 'react-router';

const Settings = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="p-4">
          <ToggleButton>Toggle theme</ToggleButton>
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

const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const theme = useStorage(exampleThemeStorage);
  return (
    <button
      className={
        props.className +
        ' ' +
        'font-bold mt-4 py-2 px-4 rounded-xl shadow hover:scale-105 ' +
        (theme === 'light' ? 'bg-white text-black' : 'bg-black text-white')
      }
      onClick={exampleThemeStorage.toggle}>
      {props.children}
    </button>
  );
};

export default withErrorBoundary(withSuspense(Settings, <div> Loading ... </div>), <div> Error Occur </div>);
