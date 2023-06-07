import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('strapi-plugin-relation-flow')
      .service('myService')
      .getWelcomeMessage();
  },
});
