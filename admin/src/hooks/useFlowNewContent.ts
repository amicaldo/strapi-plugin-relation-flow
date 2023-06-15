/**
 * Hook to receive server sent events about new entries being created from a specific content type by the current admin user.
 */

import { useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { auth } from '@strapi/helper-plugin';
import { WatchContentResult } from '../../../types';

export default function useFlowNewContent(
  contentTypeUID: string, // content type to be watched
  abortController: AbortController // abort controller to cancel the event source from outside
) {
  const [flowNewContent, setFlowNewContent] = useState<WatchContentResult>();

  /* Generate the URL to watch for new content */
  const { id: adminUserID }: { id: number } = auth.getUserInfo();
  const watchContentEventURL = `${process.env.STRAPI_ADMIN_BACKEND_URL}/relation-flow/watch-content/${contentTypeUID}?createdBy=${adminUserID}`;

  /* Fetch the watch-content server sent event */
  const fetchNewContent = async () => {
    await fetchEventSource(watchContentEventURL, {
      openWhenHidden: true,
      headers: {
        Authorization: `Bearer ${auth.getToken()}`,
        Accept: 'text/event-stream',
      },
      onmessage: (event) => setFlowNewContent(JSON.parse(event.data)),
      signal: abortController.signal,
    });
  };

  fetchNewContent();

  return flowNewContent;
}
