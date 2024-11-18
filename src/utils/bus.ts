import mitt from 'mitt';
const $bus = mitt();
export default $bus;

export const openFormDialog = (arg: any) => {
  $bus.emit('$:EditDialog:SlotForm:open', arg);
};
