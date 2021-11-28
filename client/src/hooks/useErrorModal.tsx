import { Group, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import React, { useCallback } from 'react';

export const useErrorModal = () => {
  const modals = useModals();

  return {
    openModal: useCallback(
      (children: React.ReactNode) => {
        modals.openModal({
          children: (
            <Group direction="column" position="center">
              <CrossCircledIcon width={100} height={100} color="rgb(240, 62, 62)" />
              <Text>{children}</Text>
            </Group>
          ),
        });
      },
      [modals],
    ),
  };
};
