import { IconChevronDown } from '@tabler/icons-react';
import { Checkbox, Group, Text } from '@mantine/core';

const renderTreeNode = ({
  node,
  expanded,
  hasChildren,
  elementProps,
  tree
}) => {
  const checked = tree.isNodeChecked(node.value);
  const indeterminate = tree.isNodeIndeterminate(node.value);
  
  return (
    <Group gap="xs" bg={hasChildren ? 'green':''}  {...elementProps} >
      <Checkbox.Indicator
        checked={checked}
        indeterminate={indeterminate}
        onClick={() => (!checked ? tree.checkNode(node.value) : tree.uncheckNode(node.value))}
      />

      <Group gap={5} onClick={() => tree.toggleExpanded(node.value)}>
        <span>{node.label}</span>

        {hasChildren && (
          <IconChevronDown
            size={14}
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            
          />
        )}
      </Group>
    </Group>
  );
};
export default renderTreeNode;
