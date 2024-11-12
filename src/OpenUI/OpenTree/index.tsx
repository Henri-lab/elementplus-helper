//@ts-nocheck
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  type PropType,
} from 'vue';
import { ElTree, ElInput, ElCheckbox, ElImage } from 'element-plus';
import type { TreeNode, TreeProps } from 'element-plus/es/components/tree/src/tree.type';
import connection from '@/assets/image/connection.png';
import addone from '@/assets/image/add-one.png';
import Delete from '@/assets/image/delete.png';
import $bus from '@/utils/bus';

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
      default: () => [],
    },
    menuItems: {
      type: Array as PropType<{ label: string; action: string }[]>,
      default: () => [
        { label: 'Add Child Node', action: 'add' },
        { label: 'Delete Node', action: 'delete' },
        { label: 'Edit Node', action: 'edit' },
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
            addNode(selectedNode.value.id, { id: Date.now(), label: 'New Node' });
            break;
          case 'delete':
            deleteNode(selectedNode.value.id, data.value);
            break;
          case 'edit':
            updateNode(selectedNode.value.id, { label: 'Edited Node' });
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

    const updateNode = (nodeId: number | undefined, updatedProperties: Partial<Tree>) => {
      const node = findNode(data.value, nodeId);
      if (node) {
        Object.assign(node, updatedProperties);
      } else {
        console.warn('Node not found');
      }
    };

    const findNode = (nodes: Tree[], nodeId: number | undefined): Tree | null => {
      for (const node of nodes) {
        if (node.id === nodeId) return node;
        if (node.children) {
          const found = findNode(node.children, nodeId);
          if (found) return found;
        }
      }
      return null;
    };

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
    return (
      <div>
        <ElInput v-model={this.filterText} style="width: 240px" placeholder="Filter keyword" />
        <div id={this.idOfTree}>
          <ElTree
            ref="treeRef"
            class="filter-tree"
            data={this.data}
            props={this.defaultProps}
            filter-node-method={this.filterNode}
            auto-expand-parent={true}
            default-expand-all={false}
            onNodeClick={(node: TreeNode) => this.selectedNode = node}
            onNodeContextmenu={(event: MouseEvent, node: TreeNode) => this.handleContextMenu(event, node.data)}
            v-slots={{
              default: ({ node }: { node: TreeNode }) => (
                <span class="tree-node">
                  <div class="checkbox">
                    <ElCheckbox v-model={node.data.check} />
                  </div>
                  <span class="label">{node.label}</span>
                  <div class="operations image">
                    <ElImage src={connection} style="height: 16px" fit="cover" />
                    <ElImage
                      src={addone}
                      style="height: 16px; margin: 0 5px"
                      fit="none"
                      onClick={() => this.handleMenuAction('add')}
                    />
                    <ElImage src={Delete} style="height: 16px" fit="cover" />
                  </div>
                </span>
              ),
            }}
          />
        </div>

        {this.contextMenuVisible && (
          <div
            class="context-menu"
            style={{
              top: `${this.menuPosition.y}px`,
              left: `${this.menuPosition.x}px`,
              position: 'absolute',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              padding: '5px',
              zIndex: 1000,
            }}
          >
            <ul>
              {this.menuItems.map((item) => (
                <li
                  key={item.action}
                  onClick={() => this.handleMenuAction(item.action)}
                  style={{ padding: '8px', cursor: 'pointer' }}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
});