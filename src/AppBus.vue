<script set>
import $bus from './utils/bus';
$bus.on('$:Dialog:addSysToTree:open', (arg) => {
  $bus.emit('Dialog:addSysToTree:open', arg);
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

$bus.on('$:Test:showTestButton', (arg) => {
  $bus.emit('Test:showTestButton', arg);
});
</script>
