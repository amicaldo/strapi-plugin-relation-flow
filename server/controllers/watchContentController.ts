import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx) {
    /* Set up server-sent events for this request/response */
    ctx.request.socket.setTimeout(0);
    ctx.req.socket.setNoDelay(true);
    ctx.req.socket.setKeepAlive(true);

    ctx.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    /* Send back the event stream for watching content-type (entry creation) */
    try {
      ctx.body = strapi
        .plugin('relation-flow')
        .service('watchContentService')
        .getEventStream(ctx.params.contentTypeUID, ctx.query.createdBy);
    } catch (error) {
      ctx.badRequest(error.message);
    }
  },
});
