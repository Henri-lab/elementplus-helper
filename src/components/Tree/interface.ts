import type { Ref } from 'vue';

export interface ITreeNode {
  id?: number|string;
  label: string;
  children?: ITreeNode[];
  check?: boolean;
  parentId?: number|string;
  isRoot?: boolean;
}

export interface IOperationParams {
  nodesRef: Ref<ITreeNode[]>;
  nodeId?: number|string;
  parentNodeId?: number|string;
  newNode?: ITreeNode;
  updatedProperties?: Partial<ITreeNode>;
  //undo params need
  historyStack?: Ref<IHistoryStackItem[]>;
  //single updated fields
  newLabel?: string;
}

export interface IHistoryStackItem {
  action: string;
  payload: {
    id?: number|string;
    newLabel?: string;
    previousLabel?: string;
    parentId?: number|string;
    nodeData?: ITreeNode;
  };
}
