import React, { useRef, useState } from 'react';
import { DropFileInputIcon } from '../../../../Assets/Components/FileInputs';
import { MdAttachFile, MdLibraryAdd } from 'react-icons/md';
import { IconButton } from '../../../../Assets/Components/IconButtons';
import { IoClose } from 'react-icons/io5';
import FileIcon from '../../../../Assets/Components/FileIcon';
import { VscSend } from 'react-icons/vsc';
import { splitTextWithDot } from '../../../../Assets/utils';

const ChatInput = ({
  openFileSelector,
  getInputProps,
  fileInputRef,
  previewFiles,
  sendingActive,
  setSendingActive,
  sendMessage,
  removeFiles,
  replyTo,
  user,
  setReplyTo,
}) => {
  const [input, setInput] = useState('');
  const filePrevRef = useRef(null);
  const inputContainerRef = useRef(null);

  // console.log(
  //   (filePrevRef?.current?.getBoundingClientRect().height || 0) +
  //     (inputContainerRef?.current?.getBoundingClientRect().height || 0) +
  //     200
  // );
  return (
    <div
      ref={inputContainerRef}
      className='grid place-items-center gap-1 max-h-[80px] mt-2 w-full'
      style={{ gridTemplateColumns: 'auto 1fr auto' }}
    >
      {replyTo.type && (
        <div
          className={`absolute w-full p-2 ${
            previewFiles.length > 0 ? 'min-h-[250px]' : 'min-h-[150px]'
          } bg-opacity-75 rounded-lg bg-primary-blue text-xs`}
        >
          <div className='flex flex-row justify-between items-center w-full '>
            <h5 className='font-bold'>
              Replying To{' '}
              {replyTo.owner.userName === user.userName
                ? 'yourself'
                : replyTo.owner.name}
            </h5>
            <IconButton
              icon={<IoClose />}
              onClick={() => {
                setReplyTo({});
              }}
            />
          </div>
          <div className='flex flex-row justify-between items-center w-full mb-1 mt-[2px] px-1 pr-3 opacity-60'>
            <p>
              {replyTo.type === 'text' || replyTo.type === 'textFile'
                ? splitTextWithDot(replyTo.text, 20)
                : replyTo.type}
            </p>
            <div>
              {replyTo.type === 'textFile' || replyTo.type === 'file' ? (
                <FileIcon
                  name={replyTo.parentsUrl[0].name}
                  classes={'text-lg'}
                />
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      )}
      <DropFileInputIcon
        icon={<MdAttachFile />}
        onClick={openFileSelector}
        iconClasses={'bg-primary-blue hover:bg-primary-main z-10'}
        inputFunc={getInputProps}
        fileInputRef={fileInputRef}
      />

      <div className='flex flex-row justify-center items-center rounded-md relative '>
        {previewFiles.length > 0 && (
          <div
            ref={filePrevRef}
            className='absolute w-full bottom-[105%] left-0 flex flex-row justify-start items-center px-2 py-1 max-h-[200px] bg-onPrimary-main rounded-md gap-2'
          >
            <div>
              <DropFileInputIcon
                icon={<MdLibraryAdd />}
                onClick={openFileSelector}
                iconClasses={'bg-secondary-main hover:bg-primary-main !px-1'}
                inputFunc={getInputProps}
                fileInputRef={fileInputRef}
              />
            </div>
            <div className='flex flex-row overflow-y-auto gap-1 w-full py-2 pb-1'>
              {previewFiles.map((item, key) => {
                return (
                  <div
                    className='relative p-1 max-w-[30px]  rounded-md'
                    key={key}
                  >
                    <div className='absolute -top-1 -right-1'>
                      <IconButton
                        icon={<IoClose />}
                        onClick={() => removeFiles(item.name, input)}
                        classes={
                          'bg-primary-blue  hover:bg-primary-main text-lg !px-0 !py-0 text-lg !rounded-full'
                        }
                      />
                    </div>
                    <FileIcon name={item.name} classes={'text-xl'} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <textarea
          type='text'
          placeholder='Type message here...'
          value={input}
          onChange={(e) => {
            const iVal = e.target.value;
            setInput(iVal);
            if (iVal.length > 0 && !sendingActive) {
              setSendingActive(true);
            } else if (
              iVal.length < 1 &&
              sendingActive &&
              previewFiles.length < 1
            ) {
              setSendingActive(false);
            }
          }}
          className='px-2 w-full h-full py-1 rounded-md bg-onPrimary-main text-sm text-primary-main border-none resize-none'
          rows={input.length > 20 ? 2 : 1}
        ></textarea>
      </div>
      <IconButton
        icon={<VscSend />}
        onClick={() => sendMessage(input, setInput)}
        classes={'bg-primary-blue hover:bg-primary-main z-10'}
        disabled={!sendingActive}
        props={{ disabled: !sendingActive }}
      />
    </div>
  );
};

export default ChatInput;
