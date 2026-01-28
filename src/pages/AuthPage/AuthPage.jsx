import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../shared/ui/Button/Button';
import { Input } from '../../shared/ui/Input/Input';
import { Card } from '../../shared/ui/Card/Card';
import styles from './AuthPage.module.css';

const AuthPage = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim()) {
      setError('Введите email');
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    console.log('Вход выполнен');
   
    if (setIsAuth && typeof setIsAuth === 'function') {
      setIsAuth(true);
    }
    
    navigate('/boards');
  };

  return (
    <div className={styles.authPage}>
      <Card className={styles.authContainer}>
        <div className={styles.authHeader}>
          <h1>{isLogin ? 'Вход в систему' : 'Регистрация'}</h1>
          <p className={styles.authSubtitle}>
            {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            <button 
              type="button"
              className={styles.authToggle} 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.authForm} onSubmit={handleSubmit}>
          <Input
            type="email"
            id="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            fullWidth
            placeholder="Введите email"
          />

          {!isLogin && (
            <Input
              type="text"
              id="name"
              name="name"
              label="Имя"
              value={formData.name}
              onChange={handleInputChange}
              required
              fullWidth
              placeholder="Введите имя"
            />
          )}

          <Input
            type="password"
            id="password"
            name="password"
            label="Пароль"
            value={formData.password}
            onChange={handleInputChange}
            required
            fullWidth
            placeholder="Введите пароль"
          />

          {!isLogin && (
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              label="Подтвердите пароль"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              fullWidth
              placeholder="Подтвердите пароль"
            />
          )}

          <Button 
            type="submit" 
            variant="primary"
            className={styles.authBtn}
            fullWidth
          >
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AuthPage;