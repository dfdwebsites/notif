import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Store } from '../Store';
import { Link } from 'react-router-dom';

export default function RegisterScreen() {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (confirmPassword !== password) {
      alert('Password and Confirm Password dont match');
      return;
    }
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/users/register`,
        {
          username: name,
          password
        }
      );
      ctxDispatch({ type: 'USER_SING_IN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };
  return (
    <div>
      <h3>Register</h3>
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
        <label htmlFor="confirmPass">confirm password: </label>
        <input
          type="password"
          placeholder="confirm Password"
          id="confirmPass"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />{' '}
        <button> Register </button>
      </form>
      <p>
        Allready have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
