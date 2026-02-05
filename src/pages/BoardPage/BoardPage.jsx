import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useBoardContent } from '../../features/boards/lib/useBoardContent';
import { ListCard } from '../../features/boards/ui/ListCard/ListCard';
import { Input } from '../../shared/ui/Input/Input';
import { Button } from '../../shared/ui/Button/Button';
import { ENUM_LINK, ENUM_TEXT } from '../../shared/constants';
import './BoardPage.css';

const BoardPage = () => {
  const { boardId } = useParams();
  
  const {
    boardName,
    updateBoardName,
    lists,
    createList,
    updateList,
    deleteList,
    createTask,
    updateTask,
    deleteTask,
    moveTask
  } = useBoardContent(boardId);

  const [isEditingBoardName, setIsEditingBoardName] = useState(false);
  const [editedBoardName, setEditedBoardName] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editingListId, setEditingListId] = useState(null);
  const [draggingOverListId, setDraggingOverListId] = useState(null);

  const handleStartEditBoardName = () => {
    setIsEditingBoardName(true);
    setEditedBoardName(boardName);
  };

  const handleSaveBoardName = () => {
    if (editedBoardName.trim()) {
      updateBoardName(editedBoardName.trim()); 
    }
    setIsEditingBoardName(false);
  };

  const handleCancelEditBoardName = () => {
    setIsEditingBoardName(false);
    setEditedBoardName('');
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      createList(newListName.trim()); 
      setNewListName('');
      setIsCreatingList(false);
    }
  };

  const handleEditListStart = (listId) => {
    setEditingListId(listId);
  };

  const handleSaveListEdit = (listId, newName) => {
    if (newName.trim()) {
      updateList(listId, { name: newName.trim() });
    }
    setEditingListId(null);
  };

  const handleCancelListEdit = () => {
    setEditingListId(null);
  };

  const handleTaskToggle = (listId, taskId) => {
    const list = lists.find(l => l.id === listId);
    if (!list) return;
    
    const task = list.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    updateTask(listId, taskId, { active: !task.active });
  };

  const handleDragStart = (e, taskId, listId) => {
    e.dataTransfer.setData('taskId', taskId.toString());
    e.dataTransfer.setData('listId', listId.toString());
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggingOverListId(null);
  };

  const handleDragOver = (e, listId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggingOverListId(listId);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDraggingOverListId(null);
  };

  const handleDrop = (e, targetListId) => {
    e.preventDefault();
    setDraggingOverListId(null);
    
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    const sourceListId = parseInt(e.dataTransfer.getData('listId'));
    
    if (!isNaN(taskId) && !isNaN(sourceListId) && sourceListId !== targetListId) {
      moveTask(sourceListId, targetListId, taskId);
    }
  };

  const createTaskDragHandler = (taskId, listId) => {
    return (e) => handleDragStart(e, taskId, listId);
  };


  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  };

  
  const listCardCommonProps = useMemo(() => ({
    onEditStart: handleEditListStart,
    onEditSave: handleSaveListEdit,
    onEditCancel: handleCancelListEdit,
    onDelete: deleteList,
    onTaskCreate: createTask,
    onTaskUpdate: updateTask,
    onTaskDelete: deleteTask,
    onTaskToggle: handleTaskToggle,
    onDragLeave: handleDragLeave, 
    onDragEnd: handleDragEnd,
  }), [
    handleEditListStart, 
    handleSaveListEdit, 
    handleCancelListEdit, 
    deleteList, 
    createTask, 
    updateTask, 
    deleteTask, 
    handleTaskToggle,
    handleDragLeave, 
    handleDragEnd
  ]);

  const renderListCard = (list) => {
    const listProps = {
      key: list.id,
      list,
      isEditing: editingListId === list.id,
      isDragOver: draggingOverListId === list.id,
      onDragOver: (e) => handleDragOver(e, list.id),
      onDrop: (e) => handleDrop(e, list.id),
      onTaskDragStart: (taskId) => createTaskDragHandler(taskId, list.id),
    };

    return <ListCard {...listProps} {...listCardCommonProps} />;
  };

  return (
    <div className="board-page">
      <header className="header">
        <div className="header-content">
          <Link to={ENUM_LINK.BOARDS} className="nav-link">
            {ENUM_TEXT.NAV_BACK_TO_BOARDS}
          </Link>
        </div>
      </header>

      <main className="container">
        <div className="board-header">
          {isEditingBoardName ? (
            <div className="board-name-edit">
              <Input
                type="text"
                value={editedBoardName}
                onChange={(e) => setEditedBoardName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveBoardName();
                  else if (e.key === 'Escape') handleCancelEditBoardName();
                }}
                autoFocus
                fullWidth
              />
              <div className="board-name-edit-buttons">
                <Button variant="primary" size="small" onClick={handleSaveBoardName}>
                  {ENUM_TEXT.FORM_SAVE}
                </Button>
                <Button variant="secondary" size="small" onClick={handleCancelEditBoardName}>
                  {ENUM_TEXT.FORM_CANCEL}
                </Button>
              </div>
            </div>
          ) : (
            <h1 className="board-title" onClick={handleStartEditBoardName}>
              {boardName}
            </h1>
          )}
        </div>

        <div className="lists-container">
          {lists.map(renderListCard)}
          
          {isCreatingList ? (
            <div className="list-card new-list-form">
              <div className="list-form-header">
                <Input
                  type="text"
                  placeholder={ENUM_TEXT.LIST_NAME_PLACEHOLDER}
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleCreateList)}
                  autoFocus
                  fullWidth
                />
              </div>
              <div className="list-form-actions">
                <Button variant="primary" onClick={handleCreateList}>
                  {ENUM_TEXT.FORM_SAVE}
                </Button>
                <Button variant="secondary" onClick={() => setIsCreatingList(false)}>
                  {ENUM_TEXT.FORM_CANCEL}
                </Button>
              </div>
            </div>
          ) : (
            <button className="add-list-button" onClick={() => setIsCreatingList(true)}>
              <span>{ENUM_TEXT.LIST_ADD}</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default BoardPage;