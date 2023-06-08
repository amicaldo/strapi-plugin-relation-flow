export default [
  {
    method: 'GET',
    path: '/watch-content/:contentTypeUID',
    handler: 'watchContentController.index',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
];
