import {  Text, Group, ActionIcon } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';

function AppFooter() {
  return (
      <Group position="center">
        <Text mr={0} pr={0}>Made by Visuwanaath Selvam in 2024</Text>
          <ActionIcon ml={0} pl={0}
            component="a"
            href="https://github.com/Visuwanaath"
            target="_blank"
            size="lg"
            variant="transparent"
          >
            <IconBrandGithub size={20} />
          </ActionIcon>
      </Group>
  );
}

export default AppFooter;
