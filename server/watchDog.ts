import { PassThrough } from 'stream';

export interface Target {
  contentTypeUID: string;
  createdByID: number;
  eventStream: PassThrough;
}

const toBeWatched: Target[] = [];

export default toBeWatched;
