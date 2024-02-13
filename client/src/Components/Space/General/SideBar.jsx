import { IoChatbubblesOutline } from 'react-icons/io5';
import { MdOutlineKeyboardVoice } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { spaceLinks } from '../../../Assets/LinkInfos';
import { useState } from 'react';

const SideBar = () => {
  const [mouseOnIcon, setMouseOnIcon] = useState({
    name: '',
    status: false,
  });

  const navigate = useNavigate();
  const spaceData = {
    name: 'phyHat',
    id: 1,
  };
  return (
    <div className='fixed h-screen top-0 left-0 bg-primary-blue flex items-center flex-col justify-between p-2'>
      <div className='flex flex-col justify-center items-center gap-5'>
        {spaceLinks(spaceData.name, spaceData.id).map((link, key) => {
          return (
            <Link key={key} style={{ fontSize: '1.3rem' }} to={link.path}>
              {<link.icon />}
            </Link>
          );
        })}
      </div>
      <div className='flex flex-col justify-center items-center gap-4 relative'>
        <button
          onMouseEnter={() => {
            setMouseOnIcon({
              name: 'chat',
              status: true,
            });
          }}
          onMouseLeave={() => {
            setMouseOnIcon({
              name: 'chat',
              status: false,
            });
          }}
          onClick={() => {
            navigate(`/space/${spaceData.name}/${spaceData.id}/discussions`);
          }}
        >
          <IoChatbubblesOutline style={{ fontSize: '1.2rem' }} />
        </button>
        <button
          onMouseEnter={() => {
            setMouseOnIcon({
              name: 'chat',
              status: true,
            });
          }}
          onMouseLeave={() => {
            setMouseOnIcon({
              name: 'chat',
              status: false,
            });
          }}
        >
          <MdOutlineKeyboardVoice style={{ fontSize: '1.3rem' }} />
        </button>
        {mouseOnIcon.status && (
          <div className='absolute left-[150%] bottom-0 w-[200px] h-[150px] bg-[rgba(0,0,0,.7)] p-2'>
            Hello from pops
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
