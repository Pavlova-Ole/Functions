import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/lib/useAuth';
import { Button } from '../../shared/ui/Button/Button';
import { Input } from '../../shared/ui/Input/Input';
import { Card } from '../../shared/ui/Card/Card';
import styles from './AuthPage.module.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register, isLoading, error: authError } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }
    
    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'Введите имя';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Подтвердите пароль';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setErrors({});
    
    let result;
    if (isLogin) {
      result = await login({
        email: formData.email,
        password: formData.password
      });
    } else {
      result = await register({
        email: formData.email,
        name: formData.name,
        password: formData.password
      });
    }
    
    if (result.success) {
      navigate('/boards');
    }
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: '',
      name: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className={styles.authPage}>
      <Card className={styles.authContainer}>
        <h1 className={styles.authTitle}>
          {isLogin ? 'Вход в систему' : 'Регистрация'}
        </h1>
        
        {authError && (
          <div className={styles.authError}>
            {authError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <Input
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            placeholder="example@mail.com"
            required
            fullWidth
            disabled={isLoading}
          />
          
          {!isLogin && (
            <Input
              type="text"
              name="name"
              label="Имя"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              placeholder="Ваше имя"
              required
              fullWidth
              disabled={isLoading}
            />
          )}
          
          <Input
            type="password"
            name="password"
            label="Пароль"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            placeholder="Минимум 6 символов"
            required
            fullWidth
            disabled={isLoading}
          />
          
          {!isLogin && (
            <Input
              type="password"
              name="confirmPassword"
              label="Подтвердите пароль"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              placeholder="Повторите пароль"
              required
              fullWidth
              disabled={isLoading}
            />
          )}
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isLoading}
            className={styles.authButton}
          >
            {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </Button>
        </form>
        
        <div className={styles.authSwitch}>
          <span className={styles.authSwitchText}>
            {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
          </span>
          <button
            type="button"
            onClick={handleSwitchMode}
            className={styles.authSwitchButton}
            disabled={isLoading}
          >
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;