import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from './components/Navbar';
import { Container } from 'react-bootstrap';
import Cancel from './pages/cancel';
import Store from './pages/store';
import Success from './pages/success';
import CartProvider from './CartContext';
import { auth, provider } from './firebaseConfig.js';
import { signInWithPopup } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);

  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const newUser = result.user;
        sessionStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <CartProvider>
      <Container>
        <NavbarComponent user={user} onLogout={handleLogout}></NavbarComponent>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <Store />
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10%' }}>
                      <h1>Welcome to PayMe !</h1>
                    </div>
                    <button
                      className='signInButton'
                      onClick={handleSignIn}
                    >
                      <img
                        className='googleLogo'
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                        alt="Google Logo"
                      />
                      Sign In with Google
                    </button>
                  </>
                )
              }
            />
            <Route path="success" element={<Success user={user} />} />
            <Route path="cancel" element={<Cancel user={user} />} />
          </Routes>
        </BrowserRouter>
      </Container>
    </CartProvider>
  );
}

export default App;
