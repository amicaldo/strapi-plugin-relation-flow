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
    const targetIndex = toBeWatched.findIndex(
      (target) =>
        target.contentTypeUID === model.uid &&
        target.createdByID === result.createdBy.id
    );
    if (targetIndex === -1) return;

    /* Write the entry data to the eventStream */
    const target = toBeWatched[targetIndex];
    target.eventStream.write(`data: ${JSON.stringify(result)}\n\n`);
  });
};
