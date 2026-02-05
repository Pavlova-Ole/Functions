import React, { useState } from 'react';
import { IconButton } from '../../../../shared/ui/IconButton/IconButton';
import { Button } from '../../../../shared/ui/Button/Button';
import { Input } from '../../../../shared/ui/Input/Input';
import { CircleIcon, CheckIcon, EditIcon, DeleteIcon } from '../../../../shared/ui/Icon/Icon';
import { ENUM_TEXT } from '../../../../shared/constants';
import styles from './TaskItem.module.css';

export const TaskItem = ({ 
  task, 
  listId, 
  onUpdate, 
  onDelete, 
  onToggle, 
  onDragStart,
  onDragEnd
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleIconClick = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onUpdate({ text: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(task.text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  if (isEditing) {
    return (
      <div className={styles.taskEditForm}>
        <Input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus
          fullWidth
        />
        <div className={styles.editActions}>
          <Button 
            variant="primary" 
            size="small"
            onClick={handleSaveEdit}
          >
            {ENUM_TEXT.FORM_SAVE}
          </Button>
          <Button 
            variant="secondary" 
            size="small"
            onClick={handleCancelEdit}
          >
            {ENUM_TEXT.FORM_CANCEL}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.taskItem} ${!task.active ? styles.taskInactive : ''}`}
      draggable="true"
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{ cursor: 'grab' }}
    >
      <div className={styles.taskContent}>
        <span className={`${styles.taskText} ${!task.active ? styles.taskInactive : ''}`}>
          {task.text}
        </span>
        <div className={styles.taskActions}>
          <IconButton 
            onClick={(e) => handleIconClick(e, onToggle)}
            title={task.active ? ENUM_TEXT.TASK_COMPLETE : ENUM_TEXT.TASK_ACTIVATE}
          >
            {task.active ? <CircleIcon size={16} /> : <CheckIcon size={16} />}
          </IconButton>
          <IconButton
            onClick={(e) => handleIconClick(e, () => setIsEditing(true))}
            title={ENUM_TEXT.FORM_EDIT}
          >
            <EditIcon size={16} />
          </IconButton>
          <IconButton 
            onClick={(e) => handleIconClick(e, onDelete)} 
            title={ENUM_TEXT.FORM_DELETE}
          >
            <DeleteIcon size={16} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};