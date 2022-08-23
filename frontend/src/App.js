import axios from 'axios';

function App() {
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
      <h1> Tesing </h1>

      <button onClick={clickHandler}>get data</button>
    </div>
  );
}

export default App;
