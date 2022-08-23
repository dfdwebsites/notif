import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Store } from '../Store';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (!userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  return <h1>{userInfo.username}</h1>;
}
