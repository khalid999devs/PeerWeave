import React, { memo } from 'react';
import { IconButton } from '../../../../Assets/Components/IconButtons';
import FileIcon from '../../../../Assets/Components/FileIcon';
import { MdOutlineReply } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { splitTextWithDot, strWithExtSplit } from '../../../../Assets/utils';
import axios from 'axios';
import reqs from '../../../../Assets/requests';
import { onFileClick } from '../../../../Assets/ReqFunctions/downloadFile';

const FileWithName = ({ file, onClick }) => {
  return (
    <div
      className='p-1 px-2 flex flex-row gap-1 bg-onPrimary-main w-fit my-1 rounded-lg cursor-pointer items-center'
      onClick={() => onClick(file)}
    >
      <div className='p-1 max-w-[30px] rounded-lg'>
        <FileIcon name={file.name} classes={'text-xl'} />
      </div>
      <div className='w-full'>
        <p className='text-md text-primary-main text-left w-full font-semibold'>
          {strWithExtSplit(file.name, 20)}
        </p>
        {file.type === 'file' && (
          <p className='text-xs opacity-75 text-primary-main'>
            {file.size < 1024 * 1024
              ? `${(file.size / 1024).toFixed(2)} KB`
              : `${(file.size / 1024 / 1024).toFixed(2)} MB`}{' '}
          </p>
        )}
      </div>
    </div>
  );
};

const ChatBody = ({
  messages,
  user,
  chatBodyRef,
  setReplyTo,
  replyTo,
  deleteMessage,
}) => {
  console.log(messages);

  const scrollToId = (id) => {
    chatBodyRef.current.querySelectorAll('.pChat').forEach((item) => {
      let isMsgThere = false;
      if (Number(item.id) === id) {
        isMsgThere = true;
        chatBodyRef.current.scrollTo({
          top: item.offsetTop - 50,
          left: 0,
        });
      }
      if (!isMsgThere) {
        //calculate and set the id to fetch trigger and rerender
      }
    });
  };

  return (
    <div
      ref={chatBodyRef}
      className='chat-body flex flex-col-reverse h-full overflow-y-auto gap-2 text-sm py-3 text-white '
    >
      {messages.map((item, key) => {
        const date = new Date(Number(item.time)).toLocaleString();
        return (
          <div
            key={key}
            id={item.id}
            className={`pChat p-1 relative group ${
              user.userName === item.owner.userName ? 'pl-10' : 'pr-10'
            }`}
          >
            {item.replyTo.id && (
              <div
                className={`flex w-full items-center ${
                  user.userName === item.owner.userName
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  onClick={() => scrollToId(item.replyTo.id)}
                  className={`bg-secondary-main p-2 w-fit max-w-[80%] opacity-60 rounded-t-md cursor-pointer text-xs`}
                >
                  {item.replyTo.type === 'text' ||
                  item.replyTo.type === 'textFile' ? (
                    splitTextWithDot(item.replyTo.text, 25)
                  ) : (
                    <FileIcon name={item.replyTo.parentsUrl[0].name} />
                  )}
                </div>
              </div>
            )}

            <div
              className={`hidden group-hover:flex absolute top-[50%] ${
                user.userName === item.owner.userName
                  ? 'right-[75%]'
                  : 'left-[90%]'
              } flex-col gap-1 px-1 py-2 w-fit`}
              style={{ transform: 'translate(-50%,-50%)' }}
            >
              <IconButton
                icon={<MdOutlineReply className='rounded-full' />}
                classes={'bg-[rgba(0,0,0,0)] px-1 py-1'}
                onClick={() => {
                  const { id, owner, parentsUrl, text, type } = item;
                  setReplyTo({ id, owner, parentsUrl, text, type });
                }}
              />
              <IconButton
                icon={<MdDelete className='rounded-full' />}
                classes={'bg-[rgba(0,0,0,0)] px-1 py-1'}
                onClick={() => {
                  deleteMessage(item.id);
                }}
              />
            </div>
            {item.type === 'text' ? (
              <div
                className={`flex flex-col p-3 py-2 rounded-md ${
                  user.userName === item.owner.userName
                    ? 'justify-end bg-primary-blue'
                    : 'justify-start bg-primary-main'
                } item-center `}
              >
                {item.owner.name && (
                  <h1 className='text-xs text-secondary-main font-bold mb-2'>
                    {item.owner.name}
                  </h1>
                )}

                {item.text}
                <div className='flex justify-end items-end mt-1'>
                  <p className='text-xs opacity-75 text-secondary-main'>
                    {date}
                  </p>
                </div>
              </div>
            ) : item.type === 'textFile' ? (
              <div
                className={`flex flex-col p-3 py-2 rounded-md ${
                  user.userName === item.owner.userName
                    ? 'item-end bg-primary-blue'
                    : 'item-start bg-primary-main'
                } justify-center `}
              >
                {item.owner.name && (
                  <h1 className='text-xs text-secondary-main font-bold mb-2'>
                    {item.owner.name}
                  </h1>
                )}

                {item.text}
                <div className='mt-1 '>
                  {item.parentsUrl.map((file, key) => {
                    return (
                      <FileWithName
                        file={file}
                        key={key}
                        onClick={onFileClick}
                      />
                    );
                  })}
                </div>
                <div className='flex justify-end items-end mt-1'>
                  <p className='text-xs opacity-75 text-secondary-main'>
                    {date}
                  </p>
                </div>
              </div>
            ) : (
              <div
                className={`flex flex-col p-3 py-2 rounded-md ${
                  user.userName === item.owner.userName
                    ? 'item-end bg-primary-blue'
                    : 'item-start bg-primary-main'
                } justify-start `}
              >
                {item.owner.name && (
                  <h1 className='text-xs text-secondary-main font-bold mb-2'>
                    {item.owner.name}
                  </h1>
                )}

                {item.parentsUrl.map((file, key) => {
                  return (
                    <FileWithName file={file} key={key} onClick={onFileClick} />
                  );
                })}
                <div className='flex justify-end items-end mt-1'>
                  <p className='text-xs opacity-75 text-secondary-main'>
                    {date}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default memo(ChatBody);
