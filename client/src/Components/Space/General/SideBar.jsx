import { IoChatbubblesOutline } from 'react-icons/io5';
import { MdOutlineKeyboardVoice } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { spaceLinks } from '../../../Assets/LinkInfos';
import { useState } from 'react';
import Tooltip from '../../../Assets/Components/Tooltip';
import ChatRoom from './ChatRoom';

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
    <div className='fixed h-screen top-0 left-0 bg-primary-blue flex items-center flex-col justify-between'>
      <div className='flex flex-col justify-center items-center gap-3'>
        {spaceLinks(spaceData.name, spaceData.id).map((link, key) => {
          return (
            <Link
              key={key}
              style={{ fontSize: '1.3rem' }}
              className='relative group p-2 hover:bg-primary-main rounded-sm'
              to={link.path}
            >
              {<link.icon />}
              <Tooltip text={link.name} />
            </Link>
          );
        })}
      </div>
      <div className='flex flex-col justify-center items-center gap-4 relative'>
        <button
          onClick={() => {
            setMouseOnIcon({
              name: 'chat',
              status: true,
            });

            // navigate(`/space/${spaceData.name}/${spaceData.id}/discussions`);
          }}
          className='relative group p-2 hover:bg-primary-main rounded-sm'
        >
          <IoChatbubblesOutline style={{ fontSize: '1.2rem' }} />
          <Tooltip text={'Chat Room'} />
        </button>
        <button
          onClick={() => {
            setMouseOnIcon({
              name: 'voice',
              status: true,
            });
          }}
          className='relative group p-2 hover:bg-primary-main rounded-sm'
        >
          <MdOutlineKeyboardVoice style={{ fontSize: '1.3rem' }} />
          <Tooltip text={'Voide Room'} />
        </button>
      </div>
      {mouseOnIcon.status && mouseOnIcon.name === 'chat' && (
        <div
          className='fixed left-[165px] top-[50%] bg-opacity-85 h-[99vh] rounded-lg bg-primary-blue  w-[250px] block'
          style={{ transform: 'translate(-50%,-50%)' }}
        >
          <ChatRoom setMouseOnIcon={setMouseOnIcon} />
        </div>
      )}
    </div>
  );
};

export default SideBar;
