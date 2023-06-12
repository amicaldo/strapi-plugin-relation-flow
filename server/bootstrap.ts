import { Strapi } from '@strapi/strapi';
import { Event } from '@strapi/database/lib/lifecycles';
import toBeWatched from './watchDog';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.db.lifecycles.subscribe((event: Event) => {
    /* Only handle the afterCreate event */
    if (event.action !== 'afterCreate') return;

    /* Extract the actual content created, and the model data from event */
    const { result, model } = event;

    /* Find the target object's index in the toBeWatched array */
    toBeWatched.forEach((target) => {
      if (
        target.contentTypeUID !== model.uid ||
        target.createdByID !== result.createdBy.id
      )
        return;

      /* Sanitize the result object */
      const sanitizedResult = {
        id: result.id,
        createdBy: result.createdBy,
      };

      /* Write the entry data to the eventStream */
      target.eventStream.write(`data: ${JSON.stringify(sanitizedResult)}\n\n`);
    });
  });
};
