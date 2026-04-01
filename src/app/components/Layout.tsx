import SideNavigation from './SideNavigation';
import TopHeader from './TopHeader';
import '../../styles/side-navigation.css';
import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <TopHeader isCollapsed={isCollapsed} />
      <div className="sn-layout">
        <SideNavigation isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main style={{ marginLeft: isCollapsed ? '72px' : '260px', marginTop: '51px', transition: 'margin-left 0.3s', background: '#FAFAFA', minHeight: '100vh' }}>
          {children}
        </main>
      </div>
    </>
  );
}

export default Layout;