import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './BoardPage.css';

const BoardPage = () => {
  const { boardId } = useParams();
  
  
  const [boardName, setBoardName] = useState(() => {
    const savedBoardNames = localStorage.getItem('boardNames');
    if (savedBoardNames) {
      const boardNames = JSON.parse(savedBoardNames);
      return boardNames[boardId] || `Доска ${boardId}`;
    }
    return `Доска ${boardId}`;
  });

  const [isEditingBoardName, setIsEditingBoardName] = useState(false);
  const [editedBoardName, setEditedBoardName] = useState('');

  
  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem(`boardLists_${boardId}`);
    if (savedLists) return JSON.parse(savedLists);
    
    
    if (parseInt(boardId) === 1) {
      return [
        { id: 1, name: 'Список 1', tasks: [
          { id: 1, text: 'Первая задача', active: true },
          { id: 2, text: 'Вторая задача', active: true }
        ]},
        { id: 2, name: 'Список 2', tasks: [
          { id: 3, text: 'Третья задача', active: true }
        ]},
        { id: 3, name: 'Список 3', tasks: [] }
      ];
    }
    return [];
  });
  
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editingListId, setEditingListId] = useState(null);
  const [editingListInput, setEditingListInput] = useState('');
  const [newTaskText, setNewTaskText] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [draggingOverListId, setDraggingOverListId] = useState(null);

  
  const getNextTaskId = () => {
    const allTasks = lists.flatMap(list => list.tasks);
    return allTasks.length > 0 ? Math.max(...allTasks.map(t => t.id)) + 1 : 1;
  };

  const getNextListId = () => {
    return lists.length > 0 ? Math.max(...lists.map(l => l.id)) + 1 : 1;
  };

  useEffect(() => {
    const savedBoardNames = localStorage.getItem('boardNames');
    const boardNames = savedBoardNames ? JSON.parse(savedBoardNames) : {};
    boardNames[boardId] = boardName;
    localStorage.setItem('boardNames', JSON.stringify(boardNames));
  }, [boardName, boardId]);


  useEffect(() => {
    localStorage.setItem(`boardLists_${boardId}`, JSON.stringify(lists));
  }, [lists, boardId]);

  
  const handleStartEditBoardName = () => {
    setIsEditingBoardName(true);
    setEditedBoardName(boardName);
  };

  const handleSaveBoardName = () => {
    if (editedBoardName.trim()) {
      setBoardName(editedBoardName);
    }
    setIsEditingBoardName(false);
  };

  const handleCancelEditBoardName = () => {
    setIsEditingBoardName(false);
    setEditedBoardName('');
  };

  const handleBoardNameKeyPress = (e) => {
    if (e.key === 'Enter') handleSaveBoardName();
    else if (e.key === 'Escape') handleCancelEditBoardName();
  };

 
  const handleDragStart = (e, taskId, listId) => {
    e.dataTransfer.setData('taskId', taskId.toString());
    e.dataTransfer.setData('listId', listId.toString());
    e.target.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggingOverListId(null);
  };

  const handleDragOver = (e, listId) => {
    e.preventDefault();
    setDraggingOverListId(listId);
  };

  const handleDragLeave = () => {
    setDraggingOverListId(null);
  };

  const handleDrop = (e, targetListId) => {
    e.preventDefault();
    setDraggingOverListId(null);
    
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    const sourceListId = parseInt(e.dataTransfer.getData('listId'));
    
    if (isNaN(taskId) || isNaN(sourceListId) || sourceListId === targetListId) return;
    
    const sourceList = lists.find(list => list.id === sourceListId);
    const taskToMove = sourceList?.tasks.find(task => task.id === taskId);
    if (!taskToMove) return;
    
    const updatedLists = lists.map(list => {
      if (list.id === sourceListId) {
        return {
          ...list,
          tasks: list.tasks.filter(task => task.id !== taskId)
        };
      }
      if (list.id === targetListId) {
        return {
          ...list,
          tasks: [...list.tasks, taskToMove]
        };
      }
      return list;
    });
    
    setLists(updatedLists);
  };

  
  const handleCreateList = () => {
    if (newListName.trim()) {
      const newList = { 
        id: getNextListId(), 
        name: newListName, 
        tasks: [] 
      };
      setLists([...lists, newList]);
      setNewListName('');
      setIsCreatingList(false);
    }
  };

  const handleEditList = (listId, currentName) => {
    setEditingListId(listId);
    setEditingListInput(currentName);
  };

  const handleSaveListEdit = () => {
    if (editingListInput.trim()) {
      const updatedLists = lists.map(list => 
        list.id === editingListId ? { ...list, name: editingListInput } : list
      );
      setLists(updatedLists);
      setEditingListId(null);
      setEditingListInput('');
    }
  };

  const handleCancelEditList = () => {
    setEditingListId(null);
    setEditingListInput('');
  };

  const handleDeleteList = (listId) => {
    if (window.confirm('Удалить этот список?')) {
      setLists(lists.filter(list => list.id !== listId));
    }
  };

 
  const handleCreateTask = (listId) => {
    const text = newTaskText[listId]?.trim();
    if (text) {
      const newTask = { 
        id: getNextTaskId(), 
        text, 
        active: true 
      };
      const updatedLists = lists.map(list => 
        list.id === listId ? { ...list, tasks: [...list.tasks, newTask] } : list
      );
      setLists(updatedLists);
      setNewTaskText({ ...newTaskText, [listId]: '' });
    }
  };

  const handleEditTask = (listId, taskId, currentText) => {
    setEditingTaskId(`${listId}-${taskId}`);
    setEditTaskText(currentText);
  };

  const handleSaveTaskEdit = (listId, taskId) => {
    if (editTaskText.trim()) {
      const updatedLists = lists.map(list => 
        list.id === listId ? {
          ...list,
          tasks: list.tasks.map(task =>
            task.id === taskId ? { ...task, text: editTaskText } : task
          )
        } : list
      );
      setLists(updatedLists);
      setEditingTaskId(null);
      setEditTaskText('');
    }
  };

  const handleToggleTaskStatus = (listId, taskId) => {
    const updatedLists = lists.map(list => 
      list.id === listId ? {
        ...list,
        tasks: list.tasks.map(task =>
          task.id === taskId ? { ...task, active: !task.active } : task
        )
      } : list
    );
    setLists(updatedLists);
  };

  const handleDeleteTask = (listId, taskId) => {
    if (window.confirm('Удалить эту задачу?')) {
      const updatedLists = lists.map(list => 
        list.id === listId ? { 
          ...list, 
          tasks: list.tasks.filter(task => task.id !== taskId) 
        } : list
      );
      setLists(updatedLists);
    }
  };
  
  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="board-page">
      <header className="header">
        <div className="header-content">
          <Link to="/boards" className="nav-link">← Назад к доскам</Link>
        </div>
      </header>

      <main className="container">
        <div className="board-header">
          {isEditingBoardName ? (
            <div className="board-name-edit">
              <input
                type="text"
                className="input-field board-name-input"
                value={editedBoardName}
                onChange={(e) => setEditedBoardName(e.target.value)}
                onKeyDown={handleBoardNameKeyPress}
                autoFocus
              />
              <div className="board-name-edit-buttons">
                <button className="btn btn-primary btn-small" onClick={handleSaveBoardName}>
                  Сохранить
                </button>
                <button className="btn btn-secondary btn-small" onClick={handleCancelEditBoardName}>
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <h1 onClick={handleStartEditBoardName}>
              {boardName}
            </h1>
          )}
        </div>

        <div className="lists-container">
          {lists.map(list => (
            <div 
              key={list.id} 
              className={`list-card ${draggingOverListId === list.id ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, list.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, list.id)}
            >
              {editingListId === list.id ? (
                <div className="list-edit-form-container">
                  <input
                    type="text"
                    className="input-field edit-list-input"
                    value={editingListInput}
                    onChange={(e) => setEditingListInput(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleSaveListEdit)}
                    placeholder="Введите новое название..."
                    autoFocus
                  />
                  <div className="list-edit-buttons">
                    <button className="btn btn-primary btn-small" onClick={handleSaveListEdit}>
                      Сохранить
                    </button>
                    <button className="btn btn-secondary btn-small" onClick={handleCancelEditList}>
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div className="list-header">
                  <h3>{list.name}</h3>
                  <div className="list-actions">
                    <button 
                      className="btn-icon" 
                      onClick={() => handleEditList(list.id, list.name)} 
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-icon" 
                      onClick={() => handleDeleteList(list.id)} 
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}

              <div className="tasks-list">
                {list.tasks.length === 0 ? (
                  <div 
                    className={`empty-task ${draggingOverListId === list.id ? 'drag-over' : ''}`}
                    onDragOver={(e) => handleDragOver(e, list.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, list.id)}
                  >
                    <p>Нет задач</p>
                  </div>
                ) : (
                  list.tasks.map(task => {
                    const taskEditId = `${list.id}-${task.id}`;
                    return (
                      <div 
                        key={task.id} 
                        className="task-item"
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id, list.id)}
                        onDragEnd={handleDragEnd}
                      >
                        {editingTaskId === taskEditId ? (
                          <div className="task-edit-form">
                            <input
                              type="text"
                              className="input-field"
                              value={editTaskText}
                              onChange={(e) => setEditTaskText(e.target.value)}
                              onKeyPress={(e) => handleKeyPress(e, () => handleSaveTaskEdit(list.id, task.id))}
                              autoFocus
                            />
                            <div className="edit-actions">
                              <button className="btn btn-secondary btn-small" onClick={() => setEditingTaskId(null)}>
                                Отмена
                              </button>
                              <button className="btn btn-primary btn-small" onClick={() => handleSaveTaskEdit(list.id, task.id)}>
                                Сохранить
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="task-content">
                            <span className={`task-text ${!task.active ? 'task-inactive' : ''}`}>
                              {task.text}
                            </span>
                            <div className="task-actions">
                              <button 
                                className="btn-icon" 
                                onClick={() => handleToggleTaskStatus(list.id, task.id)}
                                title={task.active ? 'Завершить' : 'Активировать'}
                              >
                                {task.active ? '◯' : '✔'}
                              </button>
                              <button 
                                className="btn-icon" 
                                onClick={() => handleEditTask(list.id, task.id, task.text)} 
                                title="Редактировать"
                              >
                                ✏️
                              </button>
                              <button 
                                className="btn-icon" 
                                onClick={() => handleDeleteTask(list.id, task.id)} 
                                title="Удалить"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="add-task-form">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Добавить задачу..."
                  value={newTaskText[list.id] || ''}
                  onChange={(e) => setNewTaskText({ ...newTaskText, [list.id]: e.target.value })}
                  onKeyPress={(e) => handleKeyPress(e, () => handleCreateTask(list.id))}
                />
                <button className="btn btn-primary btn-small" onClick={() => handleCreateTask(list.id)}>
                  Добавить
                </button>
              </div>
            </div>
          ))}
          
          {isCreatingList ? (
            <div className="list-card new-list-form">
              <div className="list-form-header">
                <input
                  type="text"
                  className="input-field list-name-input"
                  placeholder="Введите название списка..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleCreateList)}
                  autoFocus
                />
              </div>
              <div className="list-form-actions">
                <button className="btn btn-primary" onClick={handleCreateList}>
                  Сохранить
                </button>
                <button className="btn btn-secondary" onClick={() => setIsCreatingList(false)}>
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <button className="add-list-button" onClick={() => setIsCreatingList(true)}>
              <span>Добавить список</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default BoardPage;