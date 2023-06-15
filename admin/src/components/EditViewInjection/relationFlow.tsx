/*
 * Component coordinating the flow of a relation field, by getting injected into the field's container.
 */

import React, { useState } from 'react';
import { AttributeOptions } from '../../../../types';
import { Button, Flex, Box } from '@strapi/design-system';
import { Plus, Cross } from '@strapi/icons';
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';
import WaitForNewEntry from './waitForNewEntry';
import { Link } from 'react-router-dom';

export default function RelationFlow({
  fieldName,
  fieldOptions,
  fieldElement,
}: {
  fieldName: string;
  fieldOptions: AttributeOptions;
  fieldElement: HTMLElement;
}) {
  const { formatMessage } = useIntl();

  const { targetModel } = fieldOptions;

  const selectElement = fieldElement.querySelector('div');
  if (!selectElement) return null;

  const [userCreatingNewEntry, setUserCreatingNewEntry] =
    useState<boolean>(false);

  const [watchContentAbortCtrl, setWatchContentAbortCtrl] = useState<
    AbortController | undefined
  >();

  const createOperationHandler = () => {
    setWatchContentAbortCtrl(new AbortController());

    setUserCreatingNewEntry(true);

    selectElement.style.display = 'none';
  };

  const cancelOperationHandler = () => {
    watchContentAbortCtrl?.abort();

    setUserCreatingNewEntry(false);

    selectElement.style.display = 'block';
  };

  const createNewEntryURI = `/content-manager/collectionType/${targetModel}/create`;

  return (
    <div>
      {userCreatingNewEntry && (
        <WaitForNewEntry
          targetModel={targetModel!}
          fieldName={fieldName}
          relationType={fieldOptions.relationType!}
          onEntryFound={cancelOperationHandler}
          abortController={watchContentAbortCtrl}
        />
      )}

      <Flex>
        <Box style={{ padding: 2, paddingLeft: 0 }}>
          <Link to={createNewEntryURI} target='_blank'>
            <Button
              startIcon={<Plus />}
              disabled={userCreatingNewEntry}
              onClick={createOperationHandler}
            >
              {formatMessage({
                id: getTrad('edit.buttons.create'),
                defaultMessage: 'FIXME',
              })}
            </Button>
          </Link>
        </Box>

        <Box padding={1}>
          <Button
            variant='danger-light'
            startIcon={<Cross />}
            disabled={!userCreatingNewEntry}
            onClick={cancelOperationHandler}
          >
            {formatMessage({
              id: getTrad('edit.buttons.cancel'),
              defaultMessage: 'FIXME',
            })}
          </Button>
        </Box>
      </Flex>
    </div>
  );
}
