import React from 'react';
import { Outlet } from 'react-router-dom';

const Admin = () => {
  return (
    <div>
      Admin Main
      <Outlet />
    </div>
  );
};

export default Admin;
