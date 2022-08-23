import React from 'react';
import axios from 'axios';

export default function Homescreen() {
  const clickHandler = async () => {
    try {
      const data = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api`);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="App">
      <h1> Home Screen </h1>

      <button onClick={clickHandler}>get data</button>
    </div>
  );
}
