import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const PageLayout = () => {
  return (
    <div className="layout-wrapper">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="page-content page-enter">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
