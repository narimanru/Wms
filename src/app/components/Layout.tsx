import TopNavigation from './TopNavigation';
import '../../styles/top-navigation.css';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="tn-layout">
      <TopNavigation />
      <main>
        {children}
      </main>
    </div>
  );
}

export default Layout;