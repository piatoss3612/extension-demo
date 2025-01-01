import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen items-center justify-center px-3 py-6">
      <main className="flex size-full max-w-[360px] flex-col items-center justify-center justify-self-center">
        {children}
      </main>
    </div>
  );
};

export default Layout;
