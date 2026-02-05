import { useState, useEffect, useCallback } from 'react';
import { ENUM_TEXT } from '../../../shared/constants';

export function useBoardContent(boardId) {
  const [lists, setLists] = useState([]);
  const [boardName, setBoardName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = () => {
      try {
       
        const savedLists = localStorage.getItem(`boardLists_${boardId}`);
        if (savedLists) {
          setLists(JSON.parse(savedLists));
        } else {
          
          if (parseInt(boardId) === 1) {
            const initialLists = [
              { 
                id: 1, 
                name: ENUM_TEXT.LIST_1, 
                tasks: [
                  { id: 1, text: ENUM_TEXT.TASK_FIRST, active: true },
                  { id: 2, text: ENUM_TEXT.TASK_SECOND, active: true }
                ]
              },
              { 
                id: 2, 
                name: ENUM_TEXT.LIST_2, 
                tasks: [
                  { id: 3, text: ENUM_TEXT.TASK_THIRD, active: true }
                ]
              },
              { 
                id: 3, 
                name: ENUM_TEXT.LIST_3, 
                tasks: [] 
              }
            ];
            setLists(initialLists);
            localStorage.setItem(`boardLists_${boardId}`, JSON.stringify(initialLists));
          } else {
           
            setLists([]);
            localStorage.setItem(`boardLists_${boardId}`, JSON.stringify([]));
          }
        }

        const savedBoardNames = localStorage.getItem('boardNames');
        if (savedBoardNames) {
          const boardNames = JSON.parse(savedBoardNames);
          setBoardName(boardNames[boardId] || ENUM_TEXT.TEST_BOARD_DEFAULT(boardId));
        } else {
          setBoardName(ENUM_TEXT.TEST_BOARD_DEFAULT(boardId));
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных доски:', error);
        setLists([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [boardId]);

  useEffect(() => {
    localStorage.setItem(`boardLists_${boardId}`, JSON.stringify(lists));
  }, [lists, boardId]);

  useEffect(() => {
    const savedBoardNames = localStorage.getItem('boardNames');
    const boardNames = savedBoardNames ? JSON.parse(savedBoardNames) : {};
    boardNames[boardId] = boardName;
    localStorage.setItem('boardNames', JSON.stringify(boardNames));
  }, [boardName, boardId]);

  const getNextTaskId = useCallback(() => {
    const allTasks = lists.flatMap(list => list.tasks);
    return allTasks.length > 0 ? Math.max(...allTasks.map(t => t.id)) + 1 : 1;
  }, [lists]);

  const getNextListId = useCallback(() => {
    return lists.length > 0 ? Math.max(...lists.map(l => l.id)) + 1 : 1;
  }, [lists]);

  const updateBoardName = (newName) => {
    if (newName.trim()) {
      setBoardName(newName);
    }
  };

  const createList = (listName) => {
    if (!listName.trim()) return null;
    
    const newList = { 
      id: getNextListId(), 
      name: listName.trim(), 
      tasks: [] 
    };
    setLists(prev => [...prev, newList]);
    return newList;
  };

  const updateList = (listId, updates) => {
    setLists(prev => prev.map(list => 
      list.id === listId ? { ...list, ...updates } : list
    ));
  };

  const deleteList = (listId) => {
    setLists(prev => prev.filter(list => list.id !== listId));
  };

  const createTask = (listId, taskText) => {
    if (!taskText.trim()) return null;
    
    const newTask = { 
      id: getNextTaskId(), 
      text: taskText.trim(), 
      active: true 
    };
    
    setLists(prev => prev.map(list => 
      list.id === listId ? { ...list, tasks: [...list.tasks, newTask] } : list
    ));
    
    return newTask;
  };

  const updateTask = (listId, taskId, updates) => {
    setLists(prev => prev.map(list => 
      list.id === listId ? {
        ...list,
        tasks: list.tasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      } : list
    ));
  };

  const deleteTask = (listId, taskId) => {
    setLists(prev => prev.map(list => 
      list.id === listId ? { 
        ...list, 
        tasks: list.tasks.filter(task => task.id !== taskId) 
      } : list
    ));
  };

  const moveTask = (sourceListId, targetListId, taskId) => {
    const sourceList = lists.find(list => list.id === sourceListId);
    const taskToMove = sourceList?.tasks.find(task => task.id === taskId);
    
    if (!taskToMove) return;
    
    setLists(prev => prev.map(list => {
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
    }));
  };

  return {
    boardName,
    updateBoardName,
    lists,
    createList,
    updateList,
    deleteList,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    getNextTaskId,
    getNextListId,
    isLoading
  };
}