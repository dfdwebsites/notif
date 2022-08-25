import React from 'react';

export default function CheckboxComponent(props) {
  const { expenses, thisMonth, forWhat } = props;

  let fliteredObject = expenses.filter((ex) => ex.month === thisMonth)[0];
  let expeseOrIncome =
    forWhat === 'Income' ? fliteredObject.income : fliteredObject.expense;

  return expeseOrIncome.map((expe, i) => (
    <label key={i}>
      {expe.label && `${expe.label}:`}
      {expe.value}
      <input type="checkbox" value={expe._id} />
    </label>
  ));
}
