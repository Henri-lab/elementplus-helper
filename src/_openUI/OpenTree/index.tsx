//@ts-nocheck
import {
  defineComponent,
  ref,
  reactive,
  watch,
  type PropType,
} from 'vue';
import { ElTree, ElInput, ElCheckbox, ElImage, ElMessageBox, ElMessage } from 'element-plus';
import connection from '@/assets/image/connection.png';
import addone from '@/assets/image/add-one.png';
import Delete from '@/assets/image/delete.png';

interface TreeNode {
  id?: number;
  label: string;
  children?: TreeNode[];
  check?: boolean;
}

export default defineComponent({
  name: 'TreeWithContextMenu',
  props: {
    idOfTree: {
      type: String,
      default: 'idOfTree',
    },
    data: {
      type: Array as PropType<TreeNode[]>,
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
    const treeRef = ref(null);
    const contextMenuVisible = ref(false);
    const menuPosition = reactive({ x: 0, y: 0 });
    const selectedNode = ref<TreeNode | null>(null);
    const data = ref<TreeNode[]>(props.data);

    const filterNode = (value: string, data: TreeNode) => {
      if (!value) return true;
      return data.label.includes(value);
    };

    const handleContextMenu = (event: MouseEvent, node: TreeNode) => {
      event.preventDefault();
      selectedNode.value = node;
      menuPosition.x = event.clientX;
      menuPosition.y = event.clientY;
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
            // Logic for adding a child node
            break;
          case 'delete':
            // Logic for deleting the node
            break;
          case 'edit':
            // Logic for editing the node
            break;
        }
        contextMenuVisible.value = false;
      }
    };

    return () => (
      <div>
        <ElInput v-model={filterText.value} style="width: 240px" placeholder="Filter keyword" />
        <ElTree
          ref={treeRef}
          data={data.value}
          props={{ children: 'children', label: 'label' }}
          filter-node-method={filterNode}
          onNodeContextmenu={(event: MouseEvent, node) => handleContextMenu(event, node)}
        >
          {{
            default: ({ node }: { node: TreeNode }) => (
              <span class="tree-node">
                <div class="checkbox">
                  <ElCheckbox v-model={node.check} />
                </div>
                <span class="label">{node.label}</span>
                <div class="operations image">
                  <ElImage src={connection} style="height: 16px" fit="cover" />
                  <ElImage
                    src={addone}
                    style="height: 16px; margin: 0 5px"
                    fit="none"
                    onClick={() => handleMenuAction('add')}
                  />
                  <ElImage src={Delete} style="height: 16px" fit="cover" onClick={() => handleMenuAction('delete')} />
                </div>
              </span>
            ),
          }}
        </ElTree>

        {contextMenuVisible.value && (
          <div
            style={{
              position: 'absolute',
              top: `${menuPosition.y}px`,
              left: `${menuPosition.x}px`,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              padding: '5px',
              zIndex: 1000,
            }}
          >
            <ul>
              {props.menuItems.map((item) => (
                <li key={item.action} onClick={() => handleMenuAction(item.action)} style={{ padding: '8px', cursor: 'pointer' }}>
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