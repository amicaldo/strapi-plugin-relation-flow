import { Strapi } from '@strapi/strapi';
import { PassThrough } from 'stream';
import toBeWatched from '../watchDog';

export default ({ strapi }: { strapi: Strapi }) => ({
  getEventStream(contentTypeUID: string, createdByID: number): PassThrough {
    /* Validate the contentTypeUID */
    if (!strapi.contentTypes[contentTypeUID])
      throw new Error(`The content-type ${contentTypeUID} does not exist`);

    /* Validate the createdByID */
    createdByID = Number(createdByID);
    if (isNaN(createdByID) || createdByID < 1)
      throw new Error('Invalid createdBy ID');

    /* Initialize a new PassThrough stream */
    const eventStream = new PassThrough();

    /* Push the new target to the toBeWatched array */
    toBeWatched.push({
      contentTypeUID,
      createdByID,
      eventStream,
    });

    /* Handle the eventStream close event */
    eventStream.on('close', () => {
      /* Remove the target from the toBeWatched array */
      const targetIndex = toBeWatched.findIndex(
        (target) =>
          target.contentTypeUID === contentTypeUID &&
          target.createdByID === createdByID
      );
      if (targetIndex === -1) return;
      toBeWatched.splice(targetIndex, 1);
    });

    /* Return the eventStream, for the controller to respond */
    return eventStream;
  },
});
