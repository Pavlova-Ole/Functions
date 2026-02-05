export const ENUM_LINK = {
    MAIN: '/',
    AUTH: '/auth',
    BOARDS: '/boards',
    BOARD: '/boards/:boardId',
    
    getBoardPath: (boardId) => `/boards/${boardId}`,
   
    getAuthPath: () => '/auth',
    
    getBoardsPath: () => '/boards',
};