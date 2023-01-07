export default {
  routes: [
    {
      method: 'GET',
      path: '/users/findAll',
      handler: 'users.findAll',
      config: {
        prefix: '',
      },
    },
  ],
};
