import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Store } from '../Store';
import { getRandomId } from '../utils';

export default function Homescreen() {
  const { state } = useContext(Store);
  const [notifications, setNotifications] = useState('');
  const { userInfo } = state;
  const clickHandler = async () => {
    try {
      const data = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api`);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getdata = async () => {
      if (userInfo) {
        try {
          const { data } = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/notifications/${userInfo._id}`,
            { headers: { authorization: `Bearer ${userInfo.token}` } }
          );
          setNotifications(data);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getdata();
  }, [userInfo]);

  return (
    <div className="App">
      <h1> Home Screen </h1>

      <button onClick={clickHandler}>get data</button>
      <div>
        <h3>Notfications</h3>
        {notifications &&
          notifications.map((notf) => (
            <p key={getRandomId(15)}>{notf.notific.message}</p>
          ))}
      </div>
    </div>
  );
}
