import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './Pages/Error/ErrorPage';
import Home from './Pages/Home/Home';

import ClientLogin from './Pages/Auth/ClientLogin';
import ClientSignUp from './Pages/Auth/ClientSignUp';
import AdminLogin from './Pages/Auth/AdminLogin';
import ChangePass from './Pages/Auth/ChangePass';

import Dashboard from './Pages/Dashboard/Dashboard';
import GeneralInfo from './Pages/Dashboard/GeneralInfo';

import Admin from './Pages/Admin/Admin';
import AdminDashboard from './Pages/Admin/AdminDashboard';

import ExploreProjects from './Pages/Explore/ExploreProjects';
import ProjectView from './Pages/ProjectView/ProjectView';

import Resources from './Pages/Resources/Resources';
import EducationRcs from './Pages/Resources/EducationRcs';

import Space from './Pages/Space/Space';
import ChatRoom from './Pages/Space/ChatRoom';
import CodeEditor from './Pages/Space/CodeEditor';
import Plannings from './Pages/Space/Plannings';
import Settings from './Pages/Space/Settings';
import SpaceResources from './Pages/Space/SpaceResources';
import Trackings from './Pages/Space/Trackings';
import Whiteboard from './Pages/Space/Whiteboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/login',
        element: <ClientLogin />,
      },
      {
        path: '/signup',
        element: <ClientSignUp />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
        children: [
          {
            index: true,
            element: <GeneralInfo />,
          },
        ],
      },
      {
        path: '/explore/projects',
        element: <ExploreProjects />,
      },
      {
        path: '/resources',
        element: <Resources />,
        children: [
          {
            index: true,
            element: <EducationRcs />,
          },
        ],
      },
      {
        path: '/project/view/:id',
        element: <ProjectView />,
      },
      {
        path: '/change-pass',
        element: <ChangePass />,
      },

      {
        path: '/space/:name/:id',
        element: <Space />,
        children: [
          {
            index: true,
            element: <Plannings />,
          },
          {
            path: 'whiteboard',
            element: <Whiteboard />,
          },
          {
            path: 'editor',
            element: <CodeEditor />,
          },
          {
            path: 'resources',
            element: <SpaceResources />,
          },
          {
            path: 'trackings',
            element: <Trackings />,
          },
          {
            path: 'settings',
            element: <Settings />,
          },
          {
            path: 'discussions',
            element: <ChatRoom />,
          },
        ],
      },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: <Admin />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);
