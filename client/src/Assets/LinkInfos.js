import { LuListTodo } from 'react-icons/lu';
import { FaChalkboard } from 'react-icons/fa';
import { RxCodesandboxLogo } from 'react-icons/rx';
import { GrResources } from 'react-icons/gr';
import { PiPath } from 'react-icons/pi';
import { IoSettingsOutline } from 'react-icons/io5';

export const HomeLinks = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Explore',
    path: '/explore/projects',
  },
  {
    name: 'Resources',
    path: '/resources',
  },
];

export const spaceLinks = (name, id) => {
  const og = `/space/${name}/${id}`;
  const links = [
    {
      name: 'Plannings',
      path: og,
      icon: LuListTodo,
    },
    {
      name: 'Whiteboard',
      path: 'whiteboard',
      icon: FaChalkboard,
    },
    {
      name: 'Code Editor',
      path: 'editor',
      icon: RxCodesandboxLogo,
    },
    {
      name: 'Resources',
      path: 'resources',
      icon: GrResources,
    },
    {
      name: 'Trackings',
      path: 'trackings',
      icon: PiPath,
    },
    {
      name: 'Settings',
      path: 'settings',
      icon: IoSettingsOutline,
    },
  ];
  return links;
};
