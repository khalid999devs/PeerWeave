import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../../Components/Space/General/TopBar';
import SideBar from '../../Components/Space/General/SideBar';

const Space = () => {
  return (
    <div className='h-screen w-full p-4 bg-onPrimary-main'>
      <TopBar />
      <SideBar />
      SpaceIn
      <Outlet />
    </div>
  );
};

export default Space;
