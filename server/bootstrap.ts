import { Strapi } from '@strapi/strapi';
import { Event } from '@strapi/database/lib/lifecycles';
import toBeWatched from './watchDog';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.db.lifecycles.subscribe(async (event: Event) => {
    /* Only handle the afterCreate event */
    if (event.action !== 'afterCreate') return;

    /* Extract the actual content created, and the model data from event */
    const { result, model } = event;

    /* Find the target object's index in the toBeWatched array */
    for (const target of toBeWatched) {
      if (
        target.contentTypeUID !== model.uid ||
        target.createdByID !== result.createdBy.id
      )
        return;

      /* Get the target model's main field */
      const targetModelSchema = strapi.getModel(target.contentTypeUID);
      const targetModelConfig = await strapi
        .plugin('content-manager')
        .service('content-types')
        .findConfiguration(targetModelSchema);
      const { mainField: targetModelMainField }: { mainField: string } =
        targetModelConfig.settings;

      /* Craft the event data object */
      const eventData = {
        id: result.id,
        mainField: targetModelMainField, // tells the ui which field to display as preview of the relation
        [targetModelMainField]: result[targetModelMainField], // data of the main field will be displayed in the relation ui
      };

      /* Write the entry data to the eventStream */
      target.eventStream.write(`data: ${JSON.stringify(eventData)}\n\n`);
    }
  });
};
