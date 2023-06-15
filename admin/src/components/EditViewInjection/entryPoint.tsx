import React, { useEffect } from 'react';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import RelationFlow from './relationFlow';
import { Attribute } from '../../../../types';
import { Portal } from '@strapi/design-system';

function findRelationFieldElement(
  attribute: Attribute
): HTMLElement | null | undefined {
  const [fieldName, options] = attribute as Attribute;

  /* Make sure the field is a relation */
  if (options.type !== 'relation') return null;

  /* Find the label element */
  const labelElement: Element | null = document.querySelector(
    `[for="${fieldName}"]`
  );

  /* The parent element of the label is the field container */
  return labelElement?.parentElement;
}

export default function InformationZone() {
  /* Get the layout attributes (information about fields) */
  const { attributes }: { attributes: object } =
    useCMEditViewDataManager().layout;

  /* Inject the flow-buttons component under every relation field */
  const [toBeInjected, setToBeInjected] = React.useState<React.JSX.Element[]>(
    []
  );

  useEffect(() => {
    Object.entries(attributes).forEach((attribute: Attribute) => {
      const [fieldName, fieldOptions] = attribute;

      const relationFieldElement = findRelationFieldElement(attribute);

      if (!relationFieldElement) return null;

      setToBeInjected([
        ...toBeInjected,

        <Portal container={relationFieldElement}>
          <RelationFlow
            fieldName={fieldName}
            fieldOptions={fieldOptions}
            fieldElement={relationFieldElement}
          />
        </Portal>,
      ]);
    });
  }, []);

  return toBeInjected;
}
