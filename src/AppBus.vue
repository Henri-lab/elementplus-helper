<script setup>
import $bus from './utils/bus';
$bus.on('$:Test:showTestButton', (arg) => {
  $bus.emit('Test:showTestButton', arg);
});

$bus.on('$:Table:add_row', (arg) => {
  $bus.emit('Table:add_row', arg);
});

$bus.on('$:Table:delete_row', (arg) => {
  $bus.emit('Table:delete_row', arg);
});

$bus.on('$:Table:update_row', (arg) => {
  $bus.emit('Table:update_row', arg);
});

$bus.on('$:Table:searchByTargetName', (arg) => {
  $bus.emit('Table:searchByTargetName', arg);
});
$bus.on('$:Dialog->Table:addRow', (arg) => {
  $bus.emit('Dialog->Table:addRow', arg);
});

$bus.on('$:Dialog->Tree:addNode', (arg) => {
  arg.formData.label = arg.formData.notes; //test
  $bus.emit('Dialog->Tree:addNode', arg);
});

$bus.on('$:Dialog->Tree:updateNode', (arg) => {
  $bus.emit('Dialog->Tree:updateNode', arg);
});

$bus.on('$:EditDialog:SlotForm:open', (arg) => {
  $bus.emit('EditDialog:SlotForm:open', arg);
});

$bus.on('$:EditDialog:SlotForm:close', (arg) => {
  $bus.emit('EditDialog:SlotForm:close', arg);
});
</script>
<template></template>
