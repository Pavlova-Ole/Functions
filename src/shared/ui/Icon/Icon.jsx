import React from 'react';
import styles from './Icon.module.css';

export const Icon = ({ 
  name, 
  size = 20, 
  color = 'currentColor',
  className = '',
  ...props 
}) => {
 
  const icons = {
  
    edit: 'M 200 -200 h 57 l 391 -391 l -57 -57 l -391 391 v 57 Z m -80 80 v -170 l 528 -527 q 12 -11 26.5 -17 t 30.5 -6 q 16 0 31 6 t 26 18 l 55 56 q 12 11 17.5 26 t 5.5 30 q 0 16 -5.5 30.5 T 817 -647 L 290 -120 H 120 Z m 640 -584 l -56 -56 l 56 56 Z m -141 85 l -28 -29 l 57 57 l -29 -28 Z',
    
    delete: 'M 280 -120 q-33 0 -56.5 -23.5 T 200 -200 v -520 h -40 v -80 h 200 v -40 h 240 v 40 h 200 v 80 h -40 v 520 q 0 33 -23.5 56.5 T 680 -120 H 280 Z m 400 -600 H 280 v 520 h 400 v -520 Z M 360 -280 h 80 v -360 h -80 v 360 Z m 160 0 h 80 v -360 h -80 v 360 Z M 280 -720 v 520 v -520 Z',
    
    check: 'M 382-240 L 154 -468 l 57 -57 l 171 171 l 367 -367 l 57 57 l -424 424 Z',
    
    circle: 'M 480 -80 q -83 0 -156 -31.5 T 197 -197 q -54 -54 -85.5 -127 T 80 -480 q 0 -83 31.5 -156 T 197 -763 q 54 -54 127 -85.5 T 480 -880 q 83 0 156 31.5 T 763 -763 q 54 54 85.5 127 T 880 -480 q 0 83 -31.5 156 T 763 -197 q -54 54 -127 85.5 T 480 -80 Z m 0 -80 q 134 0 227 -93 t 93 -227 q 0 -134 -93 -227 t -227 -93 q -134 0 -227 93 t -93 227 q 0 134 93 227 t 227 93 Z',
    
  };

  if (!icons[name]) {
    console.warn(`Иконка "${name}" не найдена`);
    return null;
  }

  return (
    <svg 
      className={`${styles.icon} ${className}`}
      width={size} 
      height={size} 
      viewBox="0 -960 960 960" 
      fill={color}
      aria-hidden="true"
      {...props}
    >
      <path d={icons[name]} />
    </svg>
  );
};

export const EditIcon = (props) => <Icon name="edit" {...props} />;
export const DeleteIcon = (props) => <Icon name="delete" {...props} />;
export const CheckIcon = (props) => <Icon name="check" {...props} />;
export const CircleIcon = (props) => <Icon name="circle" {...props} />;

