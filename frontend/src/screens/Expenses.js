import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Store } from '../Store';

export default function Expenses() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  return <div>Expenses</div>;
}
