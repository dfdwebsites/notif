import React from 'react';

export default function CheckboxComponent(props) {
  const { expenses, thisMonth, forWhat } = props;

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
          <label key={i}>
            {expe.label && `${expe.label}:`}
            {expe.value}
            <input type="checkbox" value={expe._id} />
          </label>
        ))}
      </>
    )
  );
}
