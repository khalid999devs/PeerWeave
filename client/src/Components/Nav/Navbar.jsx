import React from 'react';
import { HomeLinks } from '../../Assets/LinkInfos';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className={`w-full`}>
      <div className='flex flex-row justify-center items-center gap-3'>
        {HomeLinks.map((link, key) => {
          return (
            <Link key={key} style={{ fontSize: '1.1rem' }} to={link.path}>
              {link.name}
            </Link>
          );
        })}
        <Link to={'/space/phyHat/1'}>Space</Link>
      </div>
    </div>
  );
};

export default Navbar;
