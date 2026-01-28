import React from 'react';
import styles from './IconButton.module.css';

export const IconButton = ({ 
  children, 
  onClick, 
  title = '', 
  className = '', 
  disabled = false,
  type = 'button',
  'aria-label': ariaLabel
}) => {
  const buttonClass = `${styles.iconButton} ${className} ${disabled ? styles.disabled : ''}`;
  
  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      title={title}
      disabled={disabled}
      aria-label={ariaLabel || title}
    >
      {children}
    </button>
  );
};