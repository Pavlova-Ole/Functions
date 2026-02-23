import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage/AuthPage';
import MainPage from './pages/MainPage/MainPage';
import BoardPage from './pages/BoardPage/BoardPage';
import { ENUM_LINK } from './shared/constants';
import './app/styles/global.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Не найден элемент с id="root"');
}

const root = createRoot(container);

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('kanban_token');
  return token ? children : <Navigate to={ENUM_LINK.AUTH} replace />;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('kanban_token');
  return token ? <Navigate to={ENUM_LINK.BOARDS} replace /> : children;
};

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path={ENUM_LINK.MAIN} element={<Navigate to={ENUM_LINK.AUTH} replace />} />
          
          <Route 
            path={ENUM_LINK.AUTH} 
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            } 
          />
          
          <Route 
            path={ENUM_LINK.BOARDS} 
            element={
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>
            } 
          />
      
          <Route 
            path={ENUM_LINK.BOARD} 
            element={
              <PrivateRoute>
                <BoardPage />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);