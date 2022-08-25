import React from 'react';

export default function ListComponent(props) {
  const { expenses, thisMonth, forWhat } = props;

  let fliteredObject = expenses.filter((ex) => ex.month === thisMonth)[0];
  let expeseOrIncome =
    forWhat === 'Income' ? fliteredObject.income : fliteredObject.expense;

  return (
    <>
      {expeseOrIncome.map((expe, i) => (
        <li key={i}>
          {expe.label && `${expe.label}:`}
          {expe.value}€
        </li>
      ))}
      <li>
        Total {forWhat}: {expeseOrIncome.reduce((a, c) => a + c.value, 0)}€
      </li>
    </>
  );
}
