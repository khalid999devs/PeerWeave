import { MdLibraryAdd } from 'react-icons/md';
import { IconButton } from './IconButtons';

export const DropFileInputIcon = ({
  icon,
  onClick,
  text,
  inputFunc,
  iconClasses,
  fileInputRef,
}) => {
  return (
    <>
      <IconButton
        text={text}
        icon={icon}
        onClick={() => {
          onClick();
        }}
        classes={iconClasses}
      />
      <input
        {...inputFunc()}
        ref={fileInputRef}
        style={{ display: 'none' }}
        multiple
      />
    </>
  );
};
