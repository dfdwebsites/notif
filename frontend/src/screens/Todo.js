import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Store } from '../Store';
import { getRandomId } from '../utils';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function Todo() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [newTodo, setNewTodo] = useState('');
  console.log(date);
  useEffect(() => {
    if (!userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const handleTodo = async (todo) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/users/${userInfo._id}/removetodo`,
        { todo },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      ctxDispatch({ type: 'USER_SING_IN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/users/${userInfo._id}/todos`,
        {
          todo: newTodo,
          todoId: getRandomId(20)
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`
          }
        }
      );
      ctxDispatch({ type: 'USER_SING_IN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setTimeout(() => {
        setNewTodo('');
      }, 0);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1>Todo List</h1>
      <div className="todo-container">
        <div>
          {userInfo.todos.length ? (
            userInfo.todos.map((todo, i) => (
              <div key={i}>
                {todo.todo}
                <button onClick={() => handleTodo(todo)}>remove</button>
              </div>
            ))
          ) : (
            <h3>No todos</h3>
          )}
        </div>
        <div>
          <Calendar onChange={setDate} value={date} />
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="what to do"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button>Create todo</button>
          </form>
        </div>
      </div>
    </>
  );
}
