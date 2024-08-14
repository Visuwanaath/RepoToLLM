import {  Text, Group, ActionIcon } from '@mantine/core';
import { IconBrandGithub, IconCoffee } from '@tabler/icons-react';

function AppFooter() {
  return (
      <Group position="center">
        <Text mr={0} pr={0}>Made by Visuwanaath Selvam in 2024</Text>
        <Text> Source Code: </Text>
          <ActionIcon ml={0} pl={0}
            component="a"
            href="https://github.com/Visuwanaath"
            target="_blank"
            size="lg"
            variant="transparent"
          >
            <IconBrandGithub size={20} />
          </ActionIcon>
          <Text> Buy me a coffee: </Text>
          <ActionIcon ml={0} pl={0}
            component="a"
            href="https://ko-fi.com/visuwa"
            target="_blank"
            size="lg"
            variant="transparent"
          >
            <IconCoffee size={20}/>
          </ActionIcon>
      </Group>
  );
}

export default AppFooter;
