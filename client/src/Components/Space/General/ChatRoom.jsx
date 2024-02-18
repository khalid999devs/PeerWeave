import React, { useEffect, useState } from 'react';
import { IconButton } from '../../../Assets/Components/IconButtons';
import { VscSend } from 'react-icons/vsc';
import { MdAttachFile } from 'react-icons/md';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000');

    socket.addEventListener('open', () => {
      console.log('Connected to server');
      setWs(socket);
    });

    socket.addEventListener('message', (event) => {
      setMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)]);
    });

    socket.addEventListener('close', () => {
      console.log('Disconnected from server');
    });

    // Clean up the WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== '' && ws) {
      const message = {
        text: input,
        sender: username,
        type: 'text',
      };
      ws.send(JSON.stringify(message));
      setInput('');
    }
  };

  const handleDirectoryDrop = async (item) => {
    const reader = item.createReader();
    const entries = await new Promise((resolve) => reader.readEntries(resolve));

    entries.forEach(async (entry) => {
      if (entry.isFile) {
        const file = await new Promise((resolve) => entry.file(resolve));
        console.log('Dropped file:', file);
        // Process the file as needed
      } else if (entry.isDirectory) {
        console.log('Dropped directory:', entry);
        // Recursively handle nested entries if needed
        await handleDirectoryDrop(entry);
      }
    });
  };

  const handleDrop = async (acceptedFiles, event) => {
    acceptedFiles.forEach(async (file) => {
      if (file.type === 'application/x-moz-file' && file.size === 0) {
        return; // Skip empty folders (Firefox specific)
      }
      console.log(file);
      let entry;
      if ('webkitGetAsEntry' in file) {
        entry = file.webkitGetAsEntry();
        if (entry) {
          if (entry.isDirectory) {
            console.log('Dropped directory:', entry);
            // Handle dropped directory
            await handleDirectoryDrop(entry);
          } else {
            console.log('Dropped file:', file);
            // Process the file as needed
          }
        }
      } else {
        console.log('Dropped file:', file);
        // Process the file as needed
      }

      // Show an alert for each dropped file or folder
      alert(
        `Dropped: ${file.name} (${entry.isDirectory() ? 'Folder' : 'File'})`
      );
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    noClick: true, // Prevent opening the file dialog on click
    noKeyboard: true, // Disable keyboard input
  });

  const openDirectory = () => {
    // Open the directory when the button is clicked
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.click();
  };

  return (
    <div
      className='w-full h-full flex flex-col justify-between p-2 px-3'
      {...getRootProps()}
    >
      <div className='flex flex-row justify-between items-center'>
        <div>Hi</div>
        <div>Hell</div>
      </div>
      <div className='chat-body flex flex-col-reverse h-full overflow-y-auto gap-2 text-sm py-3'>
        {/* Your chat messages */}
      </div>
      <div
        className='grid place-items-center gap-1 max-h-[80px] mt-2 w-full'
        style={{ gridTemplateColumns: 'auto 1fr auto' }}
      >
        <div className='h-full' onClick={openDirectory}>
          <input {...getInputProps()} directory='' webkitdirectory='' />
          <IconButton
            icon={<MdAttachFile />}
            children={<></>}
            classes={'bg-primary-blue hover:bg-primary-main'}
          />
        </div>
        <div className='flex flex-row justify-center items-center rounded-md'>
          <input
            type='text'
            placeholder='message...'
            className='px-2 w-full h-full py-1 rounded-md bg-onPrimary-main text-sm text-primary-main border-none'
          />
        </div>
        <div className='h-full'>
          <IconButton
            icon={<VscSend />}
            classes={'bg-primary-blue hover:bg-primary-main'}
            onClick={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
