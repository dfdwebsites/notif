import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Store } from '../Store';

export default function Header() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const logoutHandler = () => {
    ctxDispatch({ type: 'USER_SING_OUT' });
    localStorage.removeItem('userInfo');
    navigate('/');
  };
  return (
    <header>
      <nav>
        <div className="logo"></div>
        <ul>
          <li>
            <Link className="nav-item" to="/">
              home
            </Link>
          </li>
          {!userInfo ? (
            <>
              <li>
                <Link className="nav-item" to="/login">
                  log-in
                </Link>
              </li>
              <li>
                <Link className="nav-item" to="/register">
                  register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link className="nav-item" to="/todo">
                  todo
                </Link>
              </li>
              <li>
                <Link className="nav-item" to="/expense">
                  Expenses
                </Link>
              </li>
              <li>
                <Link className="nav-item" to="/profile">
                  {userInfo.username}
                </Link>
              </li>
              <button onClick={logoutHandler}>Log out</button>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
