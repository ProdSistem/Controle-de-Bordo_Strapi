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
    {
      method: 'GET',
      path: '/export-excel/functionary',
      handler: 'export-excel.exportFunctionary',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/export-excel/vehicle',
      handler: 'export-excel.exportVehicle',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
