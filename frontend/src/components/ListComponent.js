import React from 'react';

export default function ListComponent({ expenses, thisMonth, forWhat }) {
  let filteredObject = expenses.filter((ex) => ex.month === thisMonth)[0];
  let expeseOrIncome;
  if (filteredObject) {
    expeseOrIncome =
      forWhat === 'Income' ? filteredObject.income : filteredObject.expense;
  }

  return (
    expeseOrIncome && (
      <>
        {expeseOrIncome.map((expe, i) => (
          <li className="list-item" key={i}>
            <span>{expe.label && `${expe.label}:`}</span>
            <span className="list-item-line"></span>
            <span>{expe.value}€</span>
          </li>
        ))}
        <li className="total">
          Total {forWhat}:{' '}
          <strong>{expeseOrIncome.reduce((a, c) => a + c.value, 0)}€</strong>
        </li>
      </>
    )
  );
}
