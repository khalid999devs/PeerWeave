import React, { createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../../Components/Space/General/TopBar';
import SideBar from '../../Components/Space/General/SideBar';

const Context = createContext('');
const { spaceInfo, setSpaceInfo } = {};

const Space = () => {
  return (
    <Context.Provider value={{}}>
      <div className='h-screen w-full p-12 fixed top-0 left-0 bg-onPrimary-main'>
        <TopBar />
        <SideBar />
        SpaceIn
        <Outlet />
      </div>
    </Context.Provider>
  );
};

export const SpaceContextConsumer = () => {
  return useContext(Context);
};

export default Space;
