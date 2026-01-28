import React from 'react';

export const Draggable = ({ 
  children, 
  data,
  onDragStart,
  onDragEnd 
}) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', data.taskId.toString());
    e.dataTransfer.setData('listId', data.listId.toString());
    e.dataTransfer.effectAllowed = 'move';
    
    if (onDragStart) onDragStart();
  };

  const handleDragEnd = (e) => {
    if (onDragEnd) onDragEnd();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ cursor: 'grab' }}
    >
      {typeof children === 'function' ? children(false) : children}
    </div>
  );
};