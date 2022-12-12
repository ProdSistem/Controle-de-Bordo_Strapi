export default {
  routes: [
    {
      method: 'GET',
      path: '/export-excel/board-registe',
      handler: 'export-excel.exportBoardRegister',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
