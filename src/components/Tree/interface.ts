import type { Ref } from 'vue';

export interface ITreeNode {
  id?: number;
  label: string;
  children?: ITreeNode[];
  check?: boolean;
}

export interface IOperationParams {
  nodesRef: Ref<ITreeNode[]>;
  nodeId?: number|undefined;
  parentNodeId?: number;
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
    id?: number;
    newLabel?: string;
    previousLabel?: string;
    parentId?: number
    nodeData?: ITreeNode;
  };
}
