import React from 'react';
import {
  FaFile,
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaFolder,
} from 'react-icons/fa';
import { FaFileAudio } from 'react-icons/fa6';
import { RiFileVideoFill } from 'react-icons/ri';

const fileIcons = {
  pdf: { icon: FaFilePdf, color: 'red' },
  jpg: { icon: FaFileImage, color: '#224e13' },
  png: { icon: FaFileImage, color: '#224e13' },
  txt: { icon: FaFileAlt, color: 'green' },
  mp3: { icon: FaFileAudio, color: 'black' },
  mp4: { icon: RiFileVideoFill, color: 'black' },
  // Add more mappings as needed
};

const FileIcon = ({ name, classes }) => {
  const isFolder = !name.includes('.');
  const extension = name.split('.').pop();
  const IconComponent = isFolder
    ? FaFolder
    : fileIcons[extension]
    ? fileIcons[extension].icon
    : FaFile;
  const color = isFolder
    ? 'yellow'
    : fileIcons[extension]
    ? fileIcons[extension].color
    : 'black';

  return <IconComponent color={color} className={classes} />;
};

export default FileIcon;
