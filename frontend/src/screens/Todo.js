import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Store } from '../Store';
import { getRandomId } from '../utils';
import moment from 'moment';

export default function Todo() {
  const navigate = useNavigate();
  const todoInputRef = useRef(null);
  const todoDateRef = useRef(null);
  const todoTimeRef = useRef(null);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [newTodo, setNewTodo] = useState('');
  const [todoDate, setTodoDate] = useState('');
  const [todoTime, setTodoTime] = useState('');

  useEffect(() => {
    if (!userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const deleteTodo = async (todo) => {
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
          date: todoDate,
          time: todoTime,
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
        todoInputRef.current.value = '';
        todoDateRef.current.value = '';
        todoTimeRef.current.value = '';
        setNewTodo('');
        setTodoDate('');
        setTodoTime('');
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
                <button onClick={() => deleteTodo(todo)}>remove</button>
              </div>
            ))
          ) : (
            <h3>No todos</h3>
          )}
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="date"
              ref={todoDateRef}
              onChange={(e) => setTodoDate(e.target.value)}
            />
            <input
              type="time"
              ref={todoTimeRef}
              onChange={(e) => setTodoTime(e.target.value)}
            />
            <input
              type="text"
              placeholder="what to do"
              ref={todoInputRef}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button>Create todo</button>
          </form>
        </div>
      </div>
    </>
  );
}
