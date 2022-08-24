const lettersArray = 'abcdefghigklmnopqrstuvwxyz1234567890!@#$%^&*()';

export const getRandomId = (num) => {
  let id = '';
  for (let i = 0; i < num; i++) {
    id += lettersArray.charAt(Math.floor(Math.random() * lettersArray.length));
  }
  return id;
};
