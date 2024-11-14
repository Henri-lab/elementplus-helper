//@ts-nocheck
import {
  defineComponent,
  ref,
  h,
  onMounted,
  onBeforeUnmount,
  watch,
  type PropType,
} from 'vue';
import { ElTree, ElInput, ElCheckbox, ElImage } from 'element-plus';
import type {
  TreeNode,
  TreeProps,
} from 'element-plus';
import connection from '@/assets/image/connection.png';
import addone from '@/assets/image/add-one.png';
import Delete from '@/assets/image/delete.png';
import $bus from '@/utils/bus';
import treeMockData from '@/mock/tree_node';

interface Tree {
  id?: number;
  label: string;
  children?: Tree[];
  check?: boolean;
}

export default defineComponent({
  name: 'TreeWithContextMenu',
  props: {
    idOfTree: {
      type: String,
      default: 'idOfTree',
    },
    test: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array as PropType<Tree[]>,
      default: () => treeMockData(),
    },
    menuItems: {
      type: Array as PropType<{ label: string; action: string }[]>,
      default: () => [
        { label: 'Add Child openUI-Node', action: 'add' },
        { label: 'Delete openUI-Node', action: 'delete' },
        { label: 'Edit openUI-Node', action: 'edit' },
      ],
    },
  },
  setup(props) {
    const filterText = ref('');
    const treeRef = ref<InstanceType<typeof ElTree>>();
    const contextMenuVisible = ref(false);
    const menuPosition = ref({ x: 0, y: 0 });
    const selectedNode = ref<Tree | null>(null);

    const contextMenuStyle = ref({
      top: '0px',
      left: '0px',
    });

    const defaultProps: TreeProps = {
      children: 'children',
      label: 'label',
    };

    const data = ref<Tree[]>(props.data);

    watch(filterText, (val) => {
      treeRef.value?.filter(val);
    });

    const filterNode = (value: string, data: Tree) => {
      if (!value) return true;
      return data.label.includes(value);
    };

    const handleContextMenu = (event: MouseEvent, node: Tree) => {
      event.preventDefault();
      selectedNode.value = node;
      menuPosition.value = { x: event.clientX, y: event.clientY };
      contextMenuStyle.value = {
        top: `${event.clientY}px`,
        left: `${event.clientX}px`,
      };
      contextMenuVisible.value = true;

      const closeContextMenu = () => {
        contextMenuVisible.value = false;
        document.removeEventListener('click', closeContextMenu);
      };
      document.addEventListener('click', closeContextMenu);
    };

    const handleMenuAction = (action: string) => {
      if (selectedNode.value) {
        switch (action) {
          case 'add':
            addNode(selectedNode.value.id, {
              id: Date.now(),
              label: 'New openUI-Node',
            });
            break;
          case 'delete':
            deleteNode(selectedNode.value.id, data.value);
            break;
          case 'edit':
            updateNode(selectedNode.value.id, { label: 'Edited openUI-Node' });
            break;
          default:
            console.warn('Action not recognized');
        }
        contextMenuVisible.value = false;
      }
    };

    const addNode = (parentNodeId: number | undefined, newNode: Tree) => {
      $bus.emit('$:Dialog:addSysToTree:open');
    };

    const deleteNode = (nodeId: number | undefined, nodes: Tree[]) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === nodeId) {
          nodes.splice(i, 1);
          return true;
        } else if (nodes[i].children) {
          const deleted = deleteNode(nodeId, nodes[i].children!);
          if (deleted) return true;
        }
      }
      return false;
    };

    const updateNode = (
      nodeId: number | undefined,
      updatedProperties: Partial<Tree>
    ) => {
      const node = findNode(data.value, nodeId);
      if (node) {
        Object.assign(node, updatedProperties);
      } else {
        console.warn('openUI-Node not found');
      }
    };

    const findNode = (
      nodes: Tree[],
      nodeId: number | undefined
    ): Tree | null => {
      for (const node of nodes) {
        if (node.id === nodeId) return node;
        if (node.children) {
          const found = findNode(node.children, nodeId);
          if (found) return found;
        }
      }
      return null;
    };
    onMounted(()=>{
      console.log('openUI-OpenTree',this);
      
    })
    return {
      filterText,
      treeRef,
      contextMenuVisible,
      menuPosition,
      selectedNode,
      contextMenuStyle,
      defaultProps,
      handleContextMenu,
      handleMenuAction,
      data,
    };
  },
  render() {
    return h('div', {}, [
      //child 0
      h(ElInput, {
        modelValue: this.filterText,
        'onUpdate:modelValue': (value: string) => (this.filterText = value),
        style: { width: '240px' },
        placeholder: 'openui/opentree/index.ts',
      }),
      //child 1
      h('div', { id: this.idOfTree }, [
        h(ElTree, {
          ref: 'treeRef',
          class: 'filter-tree',
          data: this.data,
          props: this.defaultProps,
          filterNodeMethod: this.filterNode,
          autoExpandParent: true,
          defaultExpandAll: false,
          onNodeClick: (node: TreeNode) => (this.selectedNode = node),
          onNodeContextmenu: (event: MouseEvent, node: TreeNode) =>
            this.handleContextMenu(event, node.data),
          scopedSlots: {
            default: ({ node }: { node: TreeNode }) =>
              h('span', { class: 'tree-node' }, [
                h('div', { class: 'checkbox' }, [
                  h(ElCheckbox, {
                    modelValue: node.data.check,
                    'onUpdate:modelValue': (value: boolean) =>
                      (node.data.check = value),
                  }),
                ]),
                h('span', { class: 'label' }, node.label),
                h('div', { class: 'operations image' }, [
                  h(ElImage, {
                    src: connection,
                    style: { height: '16px' },
                    fit: 'cover',
                  }),
                  h(ElImage, {
                    src: addone,
                    style: { height: '16px', margin: '0 5px' },
                    fit: 'none',
                    onClick: () => this.handleMenuAction('add'),
                  }),
                  h(ElImage, {
                    src: Delete,
                    style: { height: '16px' },
                    fit: 'cover',
                  }),
                ]),
              ]),
          },
        }),
      ]),
      //child 3 (v-if)
      this.contextMenuVisible
        ? h(
            'div',
            {
              class: 'context-menu',
              style: {
                top: `${this.menuPosition.y}px`,
                left: `${this.menuPosition.x}px`,
                position: 'absolute',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                padding: '5px',
                zIndex: 1000,
              },
            },
            [
              h(
                'ul',
                {},
                this.menuItems.map((item) =>
                  h(
                    'li',
                    {
                      key: item.action,
                      onClick: () => this.handleMenuAction(item.action),
                      style: { padding: '8px', cursor: 'pointer' },
                    },
                    item.label
                  )
                )
              ),
            ]
          )
        : null,
    ]);
  },
});

// <el-input
//     v-model="filterText"
//     style="width: 240px"
//     placeholder="Filter keyword"
//   />
//   <div :id="idOfTree" v-bind="$attrs">
//     <el-tree
//       ref="treeRef"
//       auto-expand-parent
//       class="filter-tree"
//       :data="data"
//       :props="defaultProps"
//       :default-expand-all="false"
//       :filter-node-method="filterNode"
//       @node-click="getClickedNodeInfo"
//       @node-contextmenu="handleContextMenu"
//     >
//       <template #default="{ node }">
//         <span class="tree-node">
//           <div class="checkbox">
//             <el-checkbox v-model="node.data.check" :checked="node.data.check" />
//           </div>
//           <span class="label">{{ node.label }}</span>
//           <div class="operations image">
//             <el-image :src="connection" style="height: 16px" fit="cover" />
//             <el-image
//               :src="addone"
//               style="height: 16px; margin: 0 5px"
//               fit="none"
//               @click="handleAddOne(node)"
//             />
//             <el-image :src="Delete" style="height: 16px" fit="cover" />
//           </div>
//         </span>
//       </template>
//     </el-tree>
//   </div>

//   <!-- 自定义右键菜单 -->
//   <div
//     v-if="contextMenuVisible"
//     class="context-menu"
//     :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }"
//   >
//     <ul>
//       <li @click="handleMenuAction('add')">添加子节点</li>
//       <li @click="handleMenuAction('delete')">删除节点</li>
//       <li @click="handleMenuAction('edit')">编辑节点</li>
//     </ul>
//   </div>

//   <div class="test" v-if="props.test">
//     {{ data }}
//   </div>
