import axios from 'axios';
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Store } from '../Store';

export default function Expenses() {
  const expenseRef = useRef(null);
  const incomeRef = useRef(null);
  const [editIncomes, setEditIncomes] = useState(false);
  const [expense, setExpense] = useState(null);
  const [income, setIncome] = useState(null);
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [thisMonth, setThisMonth] = useState(moment().format('MMMM'));
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const addExpenseHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/users/${userInfo._id}/addexpense`,
        { expense: { value: expense } },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`
          }
        }
      );
      ctxDispatch({ type: 'USER_SING_IN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      expenseRef.current.value = null;
      setExpense(null);
    } catch (err) {
      console.log(err);
    }
  };

  const addIncomeHandler = async (value) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/users/${userInfo._id}/addincome`,
        { income: { value } },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`
          }
        }
      );
      ctxDispatch({ type: 'USER_SING_IN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      incomeRef.current.value = null;
      setIncome(null);
    } catch (err) {
      console.log(err);
    }
  };
  const addIncomeHandlerSubmit = (e) => {
    e.preventDefault();
    addIncomeHandler(income);
  };

  const createLabel = (e) => {
    e.preventDefault();
    let array = [...e.target];
    // console.log(e);
    // console.log(array.filter((elem) => elem.checked).map((el) => el.value));
    let selectedArray = array
      .filter((elem) => elem.checked)
      .map((el) => el.value);
    console.log(selectedArray);
    // e.target.filter(elements=>elements.checked)
  };

  return (
    <div>
      <div>
        <h3>{thisMonth}</h3>
        <select
          value={thisMonth}
          onChange={(e) => setThisMonth(e.target.value)}
        >
          {userInfo.expenses.map((cicle) => (
            <option key={cicle.month} value={cicle.month}>
              {cicle.month}
            </option>
          ))}
        </select>
      </div>
      <div className="todo-container">
        <div>
          expenses
          <div>
            <form onSubmit={addExpenseHandler}>
              <input
                type="number"
                ref={expenseRef}
                onChange={(e) => setExpense(e.target.value)}
              />
              <button disabled={thisMonth !== moment().format('MMMM')}>
                add expense
              </button>
            </form>
          </div>
          <div>List of Expenses for {thisMonth}</div>
          {userInfo.expenses &&
            userInfo.expenses.length &&
            userInfo.expenses
              .filter((ex) => ex.month === thisMonth)[0]
              .expense.map((expe, i) => <li key={i}> {expe.value}€ </li>)}
          {userInfo.expenses && userInfo.expenses.length && (
            <li>
              Total Expenses:{' '}
              {userInfo.expenses
                .filter((ex) => ex.month === thisMonth)[0]
                .expense.reduce((a, c) => a + c.value, 0)}
              €
            </li>
          )}
        </div>
        <div>
          Incomes
          <div>
            <div>
              <button onClick={() => addIncomeHandler(5)}>+5</button>
              <button onClick={() => addIncomeHandler(10)}>+10</button>
              <button onClick={() => addIncomeHandler(15)}>+15</button>
              <button onClick={() => addIncomeHandler(20)}>+20</button>
            </div>
            <form onSubmit={addIncomeHandlerSubmit}>
              <input
                type="number"
                ref={incomeRef}
                onChange={(e) => setIncome(e.target.value)}
              />
              <button disabled={thisMonth !== moment().format('MMMM')}>
                add Income
              </button>
            </form>
          </div>
          <div>List of Incomes for {thisMonth}</div>
          <button onClick={() => setEditIncomes((prev) => !prev)}>
            Edit mode
          </button>
          {editIncomes ? (
            <>
              <form onSubmit={createLabel}>
                <button>create Label</button>
                {userInfo.expenses &&
                  userInfo.expenses.length &&
                  userInfo.expenses
                    .filter((ex) => ex.month === thisMonth)[0]
                    .income.map((expe, i) => (
                      <label key={i}>
                        {' '}
                        {expe.value}
                        <input type="checkbox" value={expe._id} />
                      </label>
                    ))}
              </form>
            </>
          ) : (
            <>
              {userInfo.expenses &&
                userInfo.expenses.length &&
                userInfo.expenses
                  .filter((ex) => ex.month === thisMonth)[0]
                  .income.map((expe, i) => <li key={i}> {expe.value}€ </li>)}
              {userInfo.expenses && userInfo.expenses.length && (
                <li>
                  Total Income:{' '}
                  {userInfo.expenses
                    .filter((ex) => ex.month === thisMonth)[0]
                    .income.reduce((a, c) => a + c.value, 0)}
                  €
                </li>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
