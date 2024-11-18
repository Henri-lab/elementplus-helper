import mitt from 'mitt';
import type { IDescriptionItem } from '@/components/Form/interface';
const $bus = mitt();
export default $bus;

export const openFormDialog = (arg?: {
  formData?: any[];
  formType?: string;
  formName?: string;
  description?: IDescriptionItem[];
}) => {
  $bus.emit('$:EditDialog:SlotForm:open', arg);
};

export const getFormDialogRes = (arg?: any) => {
  $bus.emit('$:EditDialog:SlotForm:open', arg);
};

export const tellTree = (arg?: any) => {
  $bus.emit('$:Dialog->Tree:addNode', arg);
};

export const tellTable = (arg?: any) => {
  $bus.emit('$:Dialog->Tree', arg);
};
