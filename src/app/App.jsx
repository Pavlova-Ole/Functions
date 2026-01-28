import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../pages/AuthPage/AuthPage';
import MainPage from '../pages/MainPage/MainPage';
import BoardPage from '../pages/BoardPage/BoardPage';
import './styles/global.css';

function App() {
  const [isAuth, setIsAuth] = useState(false);

  console.log('App: isAuth =', isAuth);

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route 
            path="/auth" 
            element={<AuthPage setIsAuth={setIsAuth} />}
          />
          
          <Route 
            path="/boards" 
            element={
              isAuth ? 
                <MainPage setIsAuth={setIsAuth} /> : 
                <Navigate to="/auth" replace />
            }
          />
          
          <Route 
            path="/boards/:boardId" 
            element={
              isAuth ? 
                <BoardPage setIsAuth={setIsAuth} /> : 
                <Navigate to="/auth" replace />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;