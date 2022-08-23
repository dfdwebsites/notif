import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Store } from '../Store';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/users/signin`,
        {
          username: name,
          password
        }
      );
      ctxDispatch({ type: 'USER_SING_IN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setErrorMessage(err);
    }
  };
  return (
    <div>
      <h2>Login</h2>
      {errorMessage && <div>{errorMessage}</div>}
      <form onSubmit={submitHandler}>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          placeholder="Username"
          id="username"
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="password">password: </label>
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
        />{' '}
        <button> Log in </button>
      </form>
      <p>
        Don't have an account yet? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
