// import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Expenses from './screens/Expenses';
import Homescreen from './screens/Homescreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import Todo from './screens/Todo';
import { Store } from './Store';

function App() {
  const [clicked, setClicked] = useState(false);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { message } = state;

  useEffect(() => {
    if (clicked) ctxDispatch({ type: 'TESTING' });
    else ctxDispatch({ type: 'TESTING_TWO' });
    console.log(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clicked]);

  return (
    <BrowserRouter>
      <Header />
      <main>
        {/* {message}
        <button onClick={() => setClicked((prev) => !prev)}>Click</button> */}
        <Routes>
          <Route path="/" element={<Homescreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/todo"
            element={
              <ProtectedRoute>
                <Todo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expense"
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
