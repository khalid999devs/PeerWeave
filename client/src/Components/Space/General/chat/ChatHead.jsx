import { IconButton } from '../../../../Assets/Components/IconButtons';
import { CgArrowsExpandRight } from 'react-icons/cg';
import { IoClose } from 'react-icons/io5';

const ChatHead = ({ setMouseOnIcon, navigate }) => {
  return (
    <div className='flex flex-row justify-between items-center pb-1'>
      <div>
        <IconButton
          icon={<CgArrowsExpandRight />}
          onClick={() => {
            navigate(`discussions`);
          }}
          classes={'bg-primary-blue hover:bg-primary-main text-lg'}
        />
      </div>
      <div>
        <IconButton
          icon={<IoClose />}
          onClick={() => setMouseOnIcon(false)}
          classes={'bg-primary-blue hover:bg-primary-main text-lg'}
        />
      </div>
    </div>
  );
};

export default ChatHead;
