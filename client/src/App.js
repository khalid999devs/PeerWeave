import { Outlet } from 'react-router-dom';
import Navbar from './Components/Nav/Navbar';
import FooterMain from './Components/Footer/FooterMain';
import { createContext, useContext, useEffect, useState } from 'react';
import './axios/global';
import reqs from './Assets/requests';
import axios from 'axios';

const Context = createContext('');

function App() {
  const [user, setUser] = useState({
    id: null,
    name: 'Khalid Ahammed',
    email: '',
    userName: 'hj',
    avatar: '',
    role: '',
    ownedSpaces: [],
  });
  const [loading, setLoading] = useState(false);
  const [contextTrigger, setContextTrigger] = useState(false);

  const resetUser = () => {
    setUser({
      id: null,
      name: '',
      email: '',
      userName: '',
      avatar: '',
      role: '',
      ownedSpaces: [],
    });
  };
  const logout = () => {
    axios
      .get(reqs.CLIENT_LOGOUT, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) {
          resetUser(null);
          setContextTrigger(!contextTrigger);
        } else {
          throw new Error(res.data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const setClientUser = (data) => {
    setUser((user) => {
      return {
        ...user,
        id: data?.id,
        name: data?.fullName,
        userName: data?.userName,
        avatar: data?.img,
        email: data?.email,
        role: data?.role,
        ownedSpaces: data?.clientspaces,
      };
    });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(reqs.IS_CLIENT_VALID, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) {
          setClientUser({ ...user, ...res.data?.result });
        }
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err.response);
        setLoading(false);
      });
  }, [contextTrigger]);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        logout,
        contextTrigger,
        setContextTrigger,
        setClientUser,
        loading,
      }}
    >
      <div className='w-full min-h-screen bg-primary-main'>
        <Navbar />

        <Outlet />

        <FooterMain />
      </div>
    </Context.Provider>
  );
}

export const ContextConsumer = () => {
  return useContext(Context);
};

export default App;
