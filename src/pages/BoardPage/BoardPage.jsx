import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {useGetBoardsQuery, useEditBoardMutation,
  useGetListsQuery, useCreateListMutation, useEditListMutation, useDeleteListMutation,
  useGetTasksQuery, useCreateTaskMutation, useEditTaskMutation, useDeleteTaskMutation,
  useReorderTaskMutation,
  useReorderListMutation
} from '../../shared/api/apiSlice';
import { ListCard } from '../../features/boards/ui/ListCard/ListCard';
import { Input } from '../../shared/ui/Input/Input';
import { Button } from '../../shared/ui/Button/Button';
import { ENUM_LINK, ENUM_TEXT } from '../../shared/constants';
import './BoardPage.css';

const ListCardWrapper = ({ 
  list, listIndex, boardId, editingListId, draggingOverListId,
  handleEditListStart, handleCancelListEdit,
  handleDragOver, handleDrop, handleDragLeave, handleDragEnd, 
  createTaskDragHandler, handleListDragStart
}) => {
  const { data } = useGetTasksQuery({ boardId, listId: list.id });
  
  const rawTasks = Array.isArray(data) ? data : [];
  const tasks = rawTasks.map(t => ({
    ...t,
    title: t.name,
    text: t.name,
    content: t.name,
    active: t.isActive
  }));

  const [editList] = useEditListMutation();
  const [deleteList] = useDeleteListMutation();
  const [createTask] = useCreateTaskMutation();
  const [editTask] = useEditTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const handleTaskToggle = (listId, taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      editTask({ boardId, listId, taskId, name: task.name, isActive: !task.isActive }).unwrap().catch(() => {});
    }
  };

  const handleTaskUpdate = (listId, taskId, payload) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    let newName = task.name;
    if (typeof payload === 'string') newName = payload;
    else if (payload && typeof payload === 'object') {
      newName = payload.name || payload.title || payload.text || task.name;
    }
    editTask({ boardId, listId, taskId, name: newName || 'Без названия', isActive: task.isActive }).unwrap().catch(() => {});
  };

  const handleTaskDelete = (arg1, arg2) => {
    const safeListId = arg2 ? arg1 : list.id;
    const safeTaskId = arg2 ? arg2 : arg1;
    deleteTask({ boardId, listId: safeListId, taskId: safeTaskId }).unwrap().catch(() => {});
  };

  const handleTaskCreate = (listId, payload) => {
    let newTaskName = 'Новая задача';
    if (typeof payload === 'string') newTaskName = payload;
    else if (payload && payload.name) newTaskName = payload.name;
    
    createTask({ listId, name: newTaskName }).unwrap().catch(() => {});
  };

  const listProps = {
    list: { ...list, tasks: tasks },
    tasks: tasks,
    isEditing: editingListId === list.id,
    isDragOver: draggingOverListId === list.id,
    
    onDragOver: (e, targetTaskIndex) => handleDragOver(e, list.id, targetTaskIndex),
    onDrop: (e) => handleDrop(e, list.id, listIndex),
    
    onTaskDragStart: (taskId, index) => createTaskDragHandler(taskId, list.id, index),
    onListDragStart: (e) => handleListDragStart(e, list.id, listIndex),
    onListDragEnd: handleDragEnd
  };

  const listCardCommonProps = {
    onEditStart: handleEditListStart,
    onEditSave: (listId, newName) => {
      handleCancelListEdit(); 
      editList({ boardId, listId, name: newName || 'Колонка' }).unwrap().catch(() => {});
    },
    onEditCancel: handleCancelListEdit,
    onDelete: (listId) => deleteList({ boardId, listId }).unwrap().catch(() => {}),
    onTaskCreate: handleTaskCreate,
    onTaskUpdate: handleTaskUpdate,
    onTaskDelete: handleTaskDelete,
    onTaskToggle: handleTaskToggle,
    onDragLeave: handleDragLeave,
    onDragEnd: handleDragEnd,
  };

  return <ListCard key={list.id} {...listProps} {...listCardCommonProps} />;
};

const BoardPage = () => {
  const { boardId } = useParams();
  const { data: boards = [] } = useGetBoardsQuery();
  const [editBoard] = useEditBoardMutation();
  const currentBoard = boards.find(b => b.id === boardId);
  const boardName = currentBoard ? currentBoard.name : 'Загрузка...';
  
  const { data: lists = [] } = useGetListsQuery(boardId);
  const [createList] = useCreateListMutation();

  const [reorderTask] = useReorderTaskMutation();
  const [reorderList] = useReorderListMutation();

  const [isEditingBoardName, setIsEditingBoardName] = useState(false);
  const [editedBoardName, setEditedBoardName] = useState('');

  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editingListId, setEditingListId] = useState(null);
  
  const [draggingOverListId, setDraggingOverListId] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleStartEditBoardName = () => { setIsEditingBoardName(true); setEditedBoardName(boardName); };
  const handleCancelEditBoardName = () => { setIsEditingBoardName(false); setEditedBoardName(''); };

  const handleSaveBoardName = () => {
    if (editedBoardName && editedBoardName.trim()) {
      editBoard({ boardId, name: editedBoardName.trim() });
    }
    setIsEditingBoardName(false);
  };

  const handleCreateList = () => {
    if (newListName && newListName.trim()) {
      createList({ boardId, name: newListName.trim() });
      setNewListName('');
      setIsCreatingList(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); action(); }
  };

  const handleTaskDragStart = (e, taskId, listId, index) => {
    e.stopPropagation();
    e.dataTransfer.setData('type', 'task');
    e.dataTransfer.setData('taskId', taskId.toString());
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => e.target.classList.add('dragging'), 0);
  };

  const handleListDragStart = (e, listId, index) => {
    e.stopPropagation();
    e.dataTransfer.setData('type', 'list');
    e.dataTransfer.setData('listId', listId.toString());
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => e.target.classList.add('dragging'), 0);
  };

  const handleDragEnd = (e) => { 
    e.target.classList.remove('dragging'); 
    setDraggingOverListId(null); 
    setDragOverIndex(null);
  };

  const handleDragOver = (e, listId, targetIndex = null) => { 
    e.preventDefault(); 
    setDraggingOverListId(listId);
    if (targetIndex !== null) setDragOverIndex(targetIndex);
  };

  const handleDragLeave = (e) => { 
    e.preventDefault(); 
  };

  const handleDrop = async (e, targetListId, targetListIndex) => { 
    e.preventDefault(); 
    setDraggingOverListId(null); 

    const dragType = e.dataTransfer.getData('type');

    if (dragType === 'task') {
      const taskId = e.dataTransfer.getData('taskId');
      const sourceListId = e.dataTransfer.getData('sourceListId');
      
      let newOrder = dragOverIndex !== null ? dragOverIndex : 0;
      if (dragOverIndex === null) {
        const targetList = lists.find(l => l.id === targetListId);
        newOrder = targetList && targetList.tasks ? targetList.tasks.length : 0;
      }

      if (!taskId) return;

      try {
        await reorderTask({ 
          boardId, 
          taskId, 
          order: newOrder, 
          newListId: targetListId,
          sourceListId: sourceListId,
        }).unwrap();
      } catch (error) {
        console.error('Ошибка при перемещении задачи:', error);
      }
    } 
    else if (dragType === 'list') {
      const listId = e.dataTransfer.getData('listId');
      
      if (!listId || targetListIndex === undefined) return;

      try {
        await reorderList({ 
          boardId, 
          listId, 
          order: targetListIndex 
        }).unwrap();
      } catch (error) {
        console.error('Ошибка сортировки списков:', error);
      }
    }
    setDragOverIndex(null);
  };

  const createTaskDragHandler = (taskId, listId, index) => (e) => handleTaskDragStart(e, taskId, listId, index);

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
                value={editedBoardName || ''} 
                onChange={(e) => setEditedBoardName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveBoardName();
                  else if (e.key === 'Escape') handleCancelEditBoardName();
                }}
                autoFocus fullWidth
              />
              <div className="board-name-edit-buttons">
                <Button variant="primary" size="small" onClick={handleSaveBoardName}>{ENUM_TEXT.FORM_SAVE}</Button>
                <Button variant="secondary" size="small" onClick={handleCancelEditBoardName}>{ENUM_TEXT.FORM_CANCEL}</Button>
              </div>
            </div>
          ) : (
            <h1 className="board-title" onClick={handleStartEditBoardName}>
              {boardName}
            </h1>
          )}
        </div>

        <div className="lists-container">
          {lists.map((list, index) => (
            <ListCardWrapper 
              key={list.id} 
              list={list} 
              listIndex={index}
              boardId={boardId}
              editingListId={editingListId}
              draggingOverListId={draggingOverListId}
              handleEditListStart={setEditingListId}
              handleCancelListEdit={() => setEditingListId(null)}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              handleDragLeave={handleDragLeave}
              handleDragEnd={handleDragEnd}
              createTaskDragHandler={createTaskDragHandler}
              handleListDragStart={handleListDragStart}
            />
          ))}
          
          {isCreatingList ? (
            <div className="list-card new-list-form">
              <div className="list-form-header">
                <Input
                  type="text"
                  placeholder={ENUM_TEXT.LIST_NAME_PLACEHOLDER}
                  value={newListName || ''} 
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleCreateList)}
                  autoFocus fullWidth
                />
              </div>
              <div className="list-form-actions">
                <Button variant="primary" onClick={handleCreateList}>{ENUM_TEXT.FORM_SAVE}</Button>
                <Button variant="secondary" onClick={() => setIsCreatingList(false)}>{ENUM_TEXT.FORM_CANCEL}</Button>
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
