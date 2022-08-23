import React, { createContext, useReducer } from 'react';

export const Store = createContext();
const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  message: 'No message yet'
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'TESTING':
      return { ...state, message: 'testing complete' };
    case 'TESTING_TWO':
      return { ...state, message: 'testing two' };
    case 'USER_SING_IN':
      return { ...state, userInfo: action.payload };
    case 'USER_SING_OUT':
      return { ...state, userInfo: null };
    default:
      return state;
  }
};
export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
