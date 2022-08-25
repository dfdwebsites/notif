import axios from 'axios';
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import CheckboxComponent from '../components/CheckboxComponent';
import ListComponent from '../components/ListComponent';
import { Store } from '../Store';

export default function Expenses() {
  const expenseRef = useRef(null);
  const incomeRef = useRef(null);
  const [editIncomes, setEditIncomes] = useState(false);
  const [editExpenses, setEditExpenses] = useState(false);
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

  const addExpenseHandler = async (value) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/users/${userInfo._id}/addexpense`,
        { expense: { value: value, label: '' } },
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
        { income: { value, label: '' } },
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
  const addExpenseHandlerSubmit = (e) => {
    e.preventDefault();
    addExpenseHandler(expense);
  };

  const createLabel = async (e) => {
    e.preventDefault();
    let array = [...e.target];
    let selectedArray = array
      .filter((elem) => elem.checked)
      .map((el) => el.value);

    try {
      let label = window.prompt('What is the name of the label');
      const { data } = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/users/${userInfo._id}/incomelabel`,
        { arrayOfLabels: selectedArray, label: label },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      console.log(data);
      ctxDispatch({ type: 'USER_SING_IN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setEditIncomes(false);
    } catch (err) {
      console.log(err);
    }
    // e.target.filter(elements=>elements.checked)
  };

  const createLabelForExpenses = async (e) => {
    e.preventDefault();
    let array = [...e.target];
    let selectedArray = array
      .filter((elem) => elem.checked)
      .map((el) => el.value);

    try {
      let label = window.prompt('What is the name of the label');
      const { data } = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/users/${userInfo._id}/expenselabel`,
        { arrayOfLabels: selectedArray, label: label },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      console.log(data);
      ctxDispatch({ type: 'USER_SING_IN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setEditExpenses(false);
    } catch (err) {
      console.log(err);
    }
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
            <div>
              <button onClick={() => addExpenseHandler(5)}>+5</button>
              <button onClick={() => addExpenseHandler(10)}>+10</button>
              <button onClick={() => addExpenseHandler(15)}>+15</button>
              <button onClick={() => addExpenseHandler(20)}>+20</button>
            </div>
            <form onSubmit={addExpenseHandlerSubmit}>
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
          <button onClick={() => setEditExpenses((prev) => !prev)}>
            Edit mode
          </button>
          {editExpenses ? (
            <>
              <form onSubmit={createLabelForExpenses}>
                <button>create Label</button>
                {userInfo.expenses && userInfo.expenses.length && (
                  <CheckboxComponent
                    expenses={userInfo.expenses}
                    thisMonth={thisMonth}
                    forWhat="Expenses"
                  />
                )}
              </form>
            </>
          ) : (
            userInfo.expenses &&
            userInfo.expenses.length && (
              <ListComponent
                expenses={userInfo.expenses}
                thisMonth={thisMonth}
                forWhat="Expenses"
              />
            )
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
                {userInfo.expenses && userInfo.expenses.length && (
                  <CheckboxComponent
                    expenses={userInfo.expenses}
                    thisMonth={thisMonth}
                    forWhat="Income"
                  />
                )}
              </form>
            </>
          ) : (
            userInfo.expenses &&
            userInfo.expenses.length && (
              <ListComponent
                expenses={userInfo.expenses}
                thisMonth={thisMonth}
                forWhat="Income"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
