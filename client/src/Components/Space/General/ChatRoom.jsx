import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { IconButton } from '../../../Assets/Components/IconButtons';
import { VscSend } from 'react-icons/vsc';
import { MdAttachFile } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { CgArrowsExpandRight } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import { ContextConsumer } from '../../../App';
import { MdLibraryAdd } from 'react-icons/md';
import { DropFileInputIcon } from '../../../Assets/Components/FileInputs';
import FileIcon from '../../../Assets/Components/FileIcon';
import reqs, { wso } from '../../../Assets/requests';
import ChatBody from './chat/ChatBody';
import ChatHead from './chat/ChatHead';
import ChatInput from './chat/ChatInput';

const ChatRoom = ({ setMouseOnIcon }) => {
  const { user } = ContextConsumer();

  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [username, setUsername] = useState('');
  // Added state for managing uploaded files
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [sendingActive, setSendingActive] = useState(false);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [nameObjFiles, setNameObjFiles] = useState([]);
  const [replyTo, setReplyTo] = useState({});
  const [msgPg, setMsgPg] = useState(0);
  const [alertMsg, setAlertMsg] = useState('');
  const chatBodyRef = useRef(null);

  const parseJSONs = (obj, mode) => {
    let msgData = {
      ...obj,
      text: obj.text,
      type: obj.type,
      time: obj.time,
      replyTo: JSON.parse(obj.replyTo),
      owner: JSON.parse(obj.owner),
      mentions: JSON.parse(obj.mentions),
      filesUrl: JSON.parse(obj.filesUrl),
      parentsUrl: JSON.parse(obj.parentsUrl),
    };
    if (mode === 'stringfy') {
      return JSON.stringify(msgData);
    } else {
      return msgData;
    }
  };

  // const setMessage = (data) => {
  //   let newData = data.map(item=>{return parseJSONs(item)});
  //   setMessages((prevMessages) => [...prevMessages, ...newData]);
  // };
  // console.log(messages);
  const onFileClick = async (file) => {
    try {
      const response = await axios.get(
        `${reqs.DOWNLOAD_FILES}?type=${file.type}&name=${file.name}&destName=${file.dest}`,
        {
          responseType: 'arraybuffer',
          withCredentials: true,
        }
      );

      const contentDisposition = response.headers['content-disposition'];
      const filenameMatch =
        contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const defaultFilename = file.name; // Default filename if not provided by the server

      const filename =
        filenameMatch && filenameMatch[1] ? filenameMatch[1] : defaultFilename;

      // Create a Blob using the binary data from the response
      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/octet-stream',
      });

      // Create a download link and trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchMessage = () => {
    axios
      .post(
        reqs.GET_SPACE_DISCUSSIONS,
        {
          skip: msgPg,
          rowNum: 15,
          spaceId: 1,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.succeed) {
          let newData = res.data.result.map((item) => {
            return parseJSONs(item);
          });
          setMessages((prevMessages) => [...newData]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const deleteMessage=()=>{
  //   axios.delete().then(res=>{
  //     if(res.data.succeed){

  //     }
  //   }).catch(err=>{
  //     console.log(err);
  //   })
  // }

  const closeConnection = () => {
    if (ws) {
      ws.close();
    }
  };
  const checkConnection = () => {
    if (!ws) {
      alertMsg(
        'Chatroom Websocket connection unavailable, manual mode on! Please refresh the chat manually to see latest  messages'
      );
      alert(
        'Chatroom Websocket connection unavailable, manual mode on! Please refresh the chat manually to see latest  messages'
      );
      return false;
    }
    return true;
  };

  useEffect(() => {
    fetchMessage();
  }, [msgPg]);

  useEffect(() => {
    //opening the websocket connection
    closeConnection();

    const socket = new WebSocket(`${wso}/ws`);

    socket.addEventListener('error', () => {
      console.log('Chat Websocket error happenned!');
    });

    socket.addEventListener('open', () => {
      console.log('Connected to chat websocket server');
      setWs(socket);
    });

    socket.addEventListener('close', () => {
      console.log('Disconnected from chat websocket server');
    });

    socket.addEventListener('message', (event) => {
      //event is the message broadcasted from the server
      setMessages((prevMessages) => {
        return [JSON.parse(event.data), ...prevMessages];
      });
    });

    return () => {
      if (socket) socket.close();
    };
  }, []);

  const sendMessage = async (input, setInput) => {
    if (input.trim() !== '' && uploadedFiles.length < 1) {
      const time = Date.now().toString();

      const message = {
        text: input,
        type: 'text',
        time,
        replyTo: JSON.stringify(replyTo || {}),
        owner: JSON.stringify(user),
        mentions: JSON.stringify([]),
      };
      try {
        const res = await axios.post(
          `${reqs.UPLOAD_DISCUSSION_FILES}${1}`,
          { ...message },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );

        if (res.data.succeed) {
          console.log(parseJSONs(res.data.result), 'stringfy');
          if (!checkConnection()) {
            return;
          }
          ws.send(parseJSONs(res.data.result, 'stringfy'));
          replyTo.type && setReplyTo({});
          chatBodyRef.current.scrollTop =
            chatBodyRef.current.scrollHeight + 100;
          setInput('');
        } else {
          alert('Error sending message. Please try again');
        }
      } catch (error) {
        alert(error.response?.data?.msg || error.message || 'something wrong!');
        console.error('Error uploading file:', error);
      }
    } else if (uploadedFiles.length > 0) {
      await uploadAndSendMessage(input, setInput);
    } else {
      alert('Please Enter any message first');
    }
  };

  const uploadAndSendMessage = async (input, setInput) => {
    const time = Date.now().toString();
    const formData = new FormData();
    const message = {
      text: input,
      type: input.length > 0 ? 'textFile' : 'file',
      time: time,
      replyTo: JSON.stringify(replyTo || {}),
      owner: JSON.stringify(user),
      mentions: JSON.stringify([]),
    };

    for (const prop in message) {
      formData.append(prop, message[prop]);
    }
    let parentFiles = previewFiles.map((item) => {
      return { name: item.name, type: item.type };
    });
    formData.append('parentFiles', JSON.stringify(parentFiles));
    formData.append('nameObjFiles', JSON.stringify(nameObjFiles));
    uploadedFiles.forEach((file) => {
      formData.append('discussions', file);
    });
    try {
      const res = await axios.post(
        `${reqs.UPLOAD_DISCUSSION_FILES}${1}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      if (res.data.succeed) {
        if (!checkConnection()) {
          return;
        }
        ws.send(parseJSONs(res.data.result, 'stringfy'));

        replyTo.type && setReplyTo({});
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight + 100;
        setInput('');
      } else {
        alert('Error sending file or folders. Please try again');
      }
    } catch (error) {
      alert(error.response?.data?.msg || error.message || 'something wrong!');
      console.error('Error uploading file:', error);
    }

    // Clear the uploaded files after sending
    setUploadedFiles([]);
    setPreviewFiles([]);
    setNameObjFiles([]);
  };

  const addFileToStructure = (pathParts, file, currentNode) => {
    const filteredPathParts = pathParts.filter((part) => part.trim() !== '');

    for (let i = 0; i < filteredPathParts.length; i++) {
      const part = filteredPathParts[i];
      let nextNode = currentNode.children.find((child) => child.name === part);

      if (!nextNode) {
        if (i === filteredPathParts.length - 1) {
          nextNode = { name: part, type: 'file', file: file };
        } else {
          nextNode = { name: part, type: 'folder', children: [] };
        }
        currentNode.children.push(nextNode);
      }

      currentNode = nextNode;
    }
  };

  const handleDrop = async (acceptedFiles) => {
    // Process all files and directories
    const rootDirectory = { name: 'root', type: 'folder', children: [] };
    const nameObjStruct = {};

    const processedFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        file.dist = file.path.split('/').slice(0, -1).join('/');
        nameObjStruct[file.name] = file;
        if (
          file.path &&
          file.webkitGetAsEntry &&
          file.webkitGetAsEntry().isDirectory
        ) {
        } else {
          /*---------------folder files--------------*/
          const pathParts = file.path.startsWith('/')
            ? file.path.slice(1).split('/')
            : file.path.split('/');

          addFileToStructure(pathParts, file, rootDirectory);
        }

        return file;
      })
    );
    if (rootDirectory.children.length > 0) {
      setSendingActive(true);
    }

    setUploadedFiles((prevFiles) => {
      return [...prevFiles, ...processedFiles];
    });
    setPreviewFiles((prevFiles) => {
      return [...prevFiles, ...rootDirectory.children];
    });
    setNameObjFiles((prevFiles) => {
      return { ...prevFiles, ...nameObjStruct };
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    noClick: true,
    noKeyboard: true,
  });

  const removeFiles = (name, input) => {
    setPreviewFiles(previewFiles.filter((file) => file.name !== name));
    setUploadedFiles(uploadedFiles.filter((file) => file.name !== name));

    if (previewFiles.length - 1 < 1 && input.length < 1) {
      setSendingActive(false);
    }
    const resetFileInput = () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset the input value
      }
    };
    resetFileInput();
  };

  const fileInputRef = React.createRef();

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      {...getRootProps()}
      className='w-full h-full flex flex-col justify-between p-2 px-3 relative'
    >
      <ChatHead setMouseOnIcon={setMouseOnIcon} navigate={navigate} />
      <ChatBody
        chatBodyRef={chatBodyRef}
        messages={messages}
        user={user}
        setReplyTo={setReplyTo}
        replyTo={replyTo}
      />
      <ChatInput
        openFileSelector={openFileSelector}
        getInputProps={getInputProps}
        fileInputRef={fileInputRef}
        previewFiles={previewFiles}
        sendingActive={sendingActive}
        setSendingActive={setSendingActive}
        sendMessage={sendMessage}
        removeFiles={removeFiles}
        replyTo={replyTo}
        user={user}
        setReplyTo={setReplyTo}
      />

      <div
        className={`absolute top-[50%] left-[50%] bg-primary-blue rounded-lg w-[95%] h-[95%] ${
          isDragActive ? 'flex' : 'hidden'
        } justify-center items-center text-md`}
        style={{ transform: 'translate(-50%,-50%)' }}
      >
        Drop files and folders here
      </div>
    </div>
  );
};

export default ChatRoom;
