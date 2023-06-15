/**
 * Component responsible for observing the creation of the relation target model's new entry.
 * Shows a loader until that happens, then connect the new entry to the relation.
 */

import React, { useEffect } from 'react';
import { Loader } from '@strapi/design-system';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { normalizeRelation } from '@strapi/admin/admin/src/content-manager/components/RelationInputDataManager/utils/normalizeRelations';
import useFlowNewContent from '../../hooks/useFlowNewContent';

export default function WaitForNewEntry({
  targetModel, // The target model of the relation
  fieldName, // The name of the relation field
  relationType, // The type of the relation
  abortController, // The abort controller used to cancel the watch-content event source
  onEntryFound,
}: {
  targetModel: string;
  fieldName: string;
  relationType: string;
  abortController?: AbortController;
  onEntryFound: () => void;
}) {
  const { relationConnect } = useCMEditViewDataManager();

  /* Use the useFlowNewContent hook to observe the creation of the new entry */
  const flowNewContent = useFlowNewContent(targetModel, abortController!);

  useEffect(() => {
    if (!flowNewContent) return;

    /* Connect the new entry to the relation */
    const { id, mainField } = flowNewContent;

    const normalizedRelation = normalizeRelation(
      { ...flowNewContent, value: id, label: flowNewContent[mainField] },
      {
        shouldAddLink: true,
        mainFieldName: mainField,
        targetModel,
      }
    );

    const toOneRelation = [
      'oneWay',
      'oneToOne',
      'manyToOne',
      'oneToManyMorph',
      'oneToOneMorph',
    ].includes(relationType);

    relationConnect({
      name: fieldName,
      value: normalizedRelation,
      toOneRelation,
    });

    /* Callback */
    onEntryFound();
  }, [flowNewContent]);

  return flowNewContent ? null : <Loader small />;
}
