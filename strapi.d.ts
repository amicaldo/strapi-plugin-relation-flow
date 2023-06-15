import { Event as StrapiEvent } from '@strapi/database/lib/lifecycles';

declare module '@strapi/database/lib/lifecycles' {
  export interface Event extends StrapiEvent {
    result: {
      createdBy: {
        id: number;
      };

      [k: string]: any;
    };
  }
}
