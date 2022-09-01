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
        { expense: { value: value, label: 'untitled' } },
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
        { income: { value, label: 'untitled' } },
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
  const swapFlex = () => {
    if (
      document.querySelector('.expenses-container').style.flexDirection ===
      'row'
    ) {
      document.querySelector('.expenses-container').style.flexDirection =
        'row-reverse';
    } else {
      document.querySelector('.expenses-container').style.flexDirection = 'row';
    }
  };
  return (
    <div>
      <div className="expenses-page-title">
        <h2 className="w-100 text-align-center big-fs">{thisMonth}</h2>
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
        <button onClick={swapFlex}>icon for reverse</button>
      </div>
      <div className="expenses-container">
        <div className="expenses-div">
          <h3 className="expense expenses-category-title text-align-center">
            Expenses
          </h3>

          <div className="center" style={{ gap: '5px' }}>
            <button
              className="primary-btn expense"
              onClick={() => addExpenseHandler(5)}
            >
              -5€
            </button>
            <button
              className="primary-btn expense"
              onClick={() => addExpenseHandler(10)}
            >
              -10€
            </button>
            <button
              className="primary-btn expense"
              onClick={() => addExpenseHandler(15)}
            >
              -15€
            </button>
            <button
              className="primary-btn expense"
              onClick={() => addExpenseHandler(20)}
            >
              -20€
            </button>
          </div>
          <form className="add-expense-form" onSubmit={addExpenseHandlerSubmit}>
            <input
              type="number"
              ref={expenseRef}
              placeholder="other value"
              onChange={(e) => setExpense(e.target.value)}
            />
            <button
              className="primary-btn "
              disabled={thisMonth !== moment().format('MMMM')}
            >
              add expense
            </button>
          </form>
          <div className="list-title" style={{ gap: '10px' }}>
            <p>List of Expenses for {thisMonth}</p>{' '}
            <button
              className="edit-btn primary-btn"
              onClick={() => setEditExpenses((prev) => !prev)}
            >
              {editExpenses ? 'Cancel' : 'Edit mode'}
            </button>
          </div>

          {editExpenses ? (
            <>
              <form className="label-form" onSubmit={createLabelForExpenses}>
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
        <div className="income-div">
          <h3 className="income expenses-category-title text-align-center">
            Income
          </h3>
          <div>
            <div className="center" style={{ gap: '5px' }}>
              <button
                className="primary-btn income"
                onClick={() => addIncomeHandler(5)}
              >
                +5€
              </button>
              <button
                className="primary-btn income"
                onClick={() => addIncomeHandler(10)}
              >
                +10€
              </button>
              <button
                className="primary-btn income"
                onClick={() => addIncomeHandler(15)}
              >
                +15€
              </button>
              <button
                className="primary-btn income"
                onClick={() => addIncomeHandler(20)}
              >
                +20€
              </button>
            </div>
            <form
              className="add-expense-form"
              onSubmit={addIncomeHandlerSubmit}
            >
              <input
                placeholder="other value"
                type="number"
                ref={incomeRef}
                onChange={(e) => setIncome(e.target.value)}
              />
              <button
                className="primary-btn "
                disabled={thisMonth !== moment().format('MMMM')}
              >
                add Income
              </button>
            </form>
          </div>
          <div className="list-title" style={{ gap: '10px' }}>
            <p>List of Incomes for {thisMonth}</p>
            <button
              className="edit-btn primary-btn"
              onClick={() => setEditIncomes((prev) => !prev)}
            >
              {editIncomes ? 'Cancel' : 'Edit mode'}
            </button>
          </div>
          {editIncomes ? (
            <>
              <form className="label-form" onSubmit={createLabel}>
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
