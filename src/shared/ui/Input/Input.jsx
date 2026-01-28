import React from 'react';
import styles from './Input.module.css';

export const Input = ({ 
  type = 'text',
  id,
  name,
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  className = '',
  fullWidth = false,
  autoFocus = false
}) => {
  const inputClass = `${styles.input} ${fullWidth ? styles.fullWidth : ''} ${className}`;
  
  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        className={inputClass}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoFocus={autoFocus}
      />
    </div>
  );
};