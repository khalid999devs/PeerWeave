import axios from 'axios';
import { useState, createContext, useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import reqs from '../../Assets/requests';
const ProfileContext = createContext('');

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState({
    id: 0,
    userName: '',
    fullName: '',
    email: '',
    image: '',
  });
  useEffect(() => {
    axios
      .get(reqs.VALID_CLIENT_INFO, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.succeed) {
          setUserProfile(res.data?.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        userProfile,
        setUserProfile,
      }}
    >
      <div className='px-5 m-auto my-10 '>
        <div className='pt-6 md:pl-6 w-full'>
          <Outlet context={userProfile} />
        </div>
      </div>
    </ProfileContext.Provider>
  );
};

export const ProfileContextConsumer = () => {
  return useContext(ProfileContext);
};

export default Dashboard;
