export const ENUM_LINK = {
    MAIN: '/',               
    AUTH: '/auth',            
    BOARDS: '/boards',
    BOARD: '/boards/:boardId',
  };

  export const getBoardPath = (boardId) => `/boards/${boardId}`;
  