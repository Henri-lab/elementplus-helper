/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useRef, useEffect } from 'react';
import { Tree, Input, Button, Tooltip, Modal, Checkbox, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface TreeNode {
  key: string;
  title: string;
  children?: TreeNode[];
  check?: boolean;
}

interface MenuItem {
  label: string;
  action: 'add' | 'delete' | 'edit';
}

interface TreeWithContextMenuProps {
  initialData: TreeNode[];
  menuItems?: MenuItem[];
}

const defaultMenuItems: MenuItem[] = [
  { label: 'Add Child Node', action: 'add' },
  { label: 'Delete Node', action: 'delete' },
  { label: 'Edit Node', action: 'edit' },
];

const TreeWithContextMenu: React.FC<TreeWithContextMenuProps> = ({
  initialData,
  menuItems = defaultMenuItems,
}) => {
  const [data, setData] = useState<TreeNode[]>(initialData);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [filterText, setFilterText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState('');
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const handleRightClick = ({ event, node }: any) => {
    setSelectedNode(node);
    setMenuPosition({ x: event.clientX, y: event.clientY });
    setContextMenuVisible(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
      setContextMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleMenuAction = (action: 'add' | 'delete' | 'edit') => {
    if (!selectedNode) return;

    if (action === 'add') {
      const newNode: TreeNode = { key: `${Date.now()}`, title: 'New Node' };
      addNode(data, selectedNode.key, newNode);
    } else if (action === 'delete') {
      deleteNode(data, selectedNode.key);
    } else if (action === 'edit') {
      setIsEditing(true);
      setEditingText(selectedNode.title);
    }

    setContextMenuVisible(false);
  };

  const addNode = (nodes: TreeNode[], parentKey: string, newNode: TreeNode): TreeNode[] => {
    return nodes.map(node => {
      if (node.key === parentKey) {
        return { ...node, children: [...(node.children || []), newNode] };
      } else if (node.children) {
        return { ...node, children: addNode(node.children, parentKey, newNode) };
      }
      return node;
    });
  };

  const deleteNode = (nodes: TreeNode[], key: string): TreeNode[] => {
    return nodes
      .filter(node => node.key !== key)
      .map(node => ({
        ...node,
        children: node.children ? deleteNode(node.children, key) : [],
      }));
  };

  const updateNode = (nodes: TreeNode[], key: string, newTitle: string): TreeNode[] => {
    return nodes.map(node => {
      if (node.key === key) {
        return { ...node, title: newTitle };
      } else if (node.children) {
        return { ...node, children: updateNode(node.children, key, newTitle) };
      }
      return node;
    });
  };

  const handleEditSubmit = () => {
    if (selectedNode) {
      setData(updateNode(data, selectedNode.key, editingText));
      message.success('Node updated successfully');
    }
    setIsEditing(false);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  const filteredData = data.filter(node =>
    node.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      <Input
        placeholder="Filter keyword"
        value={filterText}
        onChange={handleFilterChange}
        style={{ width: '240px', marginBottom: '10px' }}
      />
      <Tree
        treeData={filteredData}
        titleRender={node => (
          <span>
            <Checkbox checked={node.check} />
            <Tooltip title={node.title}>
              <span>{node.title}</span>
            </Tooltip>
            <PlusOutlined onClick={() => handleMenuAction('add')} style={{ marginLeft: '10px' }} />
            <EditOutlined onClick={() => handleMenuAction('edit')} style={{ marginLeft: '10px' }} />
            <DeleteOutlined onClick={() => handleMenuAction('delete')} style={{ marginLeft: '10px' }} />
          </span>
        )}
        onRightClick={handleRightClick}
      />

      {contextMenuVisible && (
        <div
          ref={contextMenuRef}
          style={{
            position: 'absolute',
            top: menuPosition.y,
            left: menuPosition.x,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            padding: '10px',
          }}
        >
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {menuItems.map(item => (
              <li
                key={item.action}
                onClick={() => handleMenuAction(item.action)}
                style={{ padding: '5px 10px', cursor: 'pointer' }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Modal
        title="Edit Node"
        open={isEditing}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditing(false)}
      >
        <Input
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          placeholder="Edit node title"
        />
      </Modal>
    </div>
  );
};

export default TreeWithContextMenu;