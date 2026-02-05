import React, { useState } from 'react';
import { IconButton } from '../../../../shared/ui/IconButton/IconButton';
import { Button } from '../../../../shared/ui/Button/Button';
import { Input } from '../../../../shared/ui/Input/Input';
import { TaskItem } from '../TaskItem/TaskItem';
import { EditIcon, DeleteIcon } from '../../../../shared/ui/Icon/Icon';
import { ENUM_TEXT } from '../../../../shared/constants';
import styles from './ListCard.module.css';

export const ListCard = ({ 
  list, 
  isEditing, 
  isDragOver,
  onEditStart,        
  onEditSave,        
  onEditCancel,      
  onDelete,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onTaskToggle,
  onDragOver,
  onDragLeave,
  onTaskDragStart,
  onTaskDragEnd, 
  onDrop,
  children
}) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [editingListName, setEditingListName] = useState(list.name);

  const handleIconClick = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    if (action && typeof action === 'function') {
      action();
    }
  };

  const handleEditSave = () => {
    if (editingListName.trim()) {
      onEditSave(list.id, editingListName.trim());
    }
  };

  const handleCreateTask = () => {
    if (newTaskText.trim()) {
      onTaskCreate(list.id, newTaskText.trim());
      setNewTaskText('');
    }
  };
  
  const handleListKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSave();
    } else if (e.key === 'Escape') {
      if (onEditCancel) onEditCancel(list.id);
    }
  };

  const handleTaskKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCreateTask();
    }
  };

  if (isEditing) {
    return (
      <div className={styles.listCard}>
        <div className={styles.listEditForm}>
          <Input
            value={editingListName}
            onChange={(e) => setEditingListName(e.target.value)}
            onKeyDown={handleListKeyPress}
            placeholder={ENUM_TEXT.LIST_EDIT_PLACEHOLDER}
            autoFocus
            fullWidth
          />
          <div className={styles.editActions}>
            <Button 
              variant="primary" 
              size="small"
              onClick={handleEditSave}
            >
              {ENUM_TEXT.FORM_SAVE}
            </Button>
            <Button 
              variant="secondary" 
              size="small"
              onClick={() => onEditCancel && onEditCancel(list.id)} 
            >
              {ENUM_TEXT.FORM_CANCEL}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.listCard} ${isDragOver ? styles.dragOver : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className={styles.listHeader}>
        <h3>{list.name}</h3>
        <div className={styles.listActions}>
          <IconButton 
            onClick={(e) => handleIconClick(e, () => onEditStart && onEditStart(list.id))}
            title={ENUM_TEXT.FORM_EDIT}
          >
            <EditIcon size={18} />
          </IconButton>
        
          <IconButton 
            onClick={(e) => handleIconClick(e, () => onDelete && onDelete(list.id))}
            title={ENUM_TEXT.FORM_DELETE}
          >
            <DeleteIcon size={18} />
          </IconButton>
        </div>
      </div>

      <div className={styles.tasksList}>
        {list.tasks.length === 0 ? (
          <div className={styles.emptyTask}>
            <p>{ENUM_TEXT.TASK_NO_TASKS}</p>
          </div>
        ) : (
          list.tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              listId={list.id}
              onUpdate={(updates) => onTaskUpdate(list.id, task.id, updates)}
              onDelete={() => onTaskDelete(list.id, task.id)}
              onToggle={() => onTaskToggle(list.id, task.id)}
              onDragStart={onTaskDragStart ? onTaskDragStart(task.id) : undefined} 
              onDragEnd={onTaskDragEnd}
            />
          ))
        )}
      </div>

      <div className={styles.addTaskForm}>
        <Input
          type="text"
          placeholder={ENUM_TEXT.TASK_PLACEHOLDER}
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={handleTaskKeyPress}
          fullWidth
        />
        <Button 
          variant="primary" 
          size="small"
          onClick={handleCreateTask}
          disabled={!newTaskText.trim()}
        >
          {ENUM_TEXT.FORM_ADD}
        </Button>
      </div>

      {children}
    </div>
  );
};