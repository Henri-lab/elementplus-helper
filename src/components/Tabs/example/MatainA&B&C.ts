import { markRaw } from 'vue';
//@ts-ignore
import { createTabsComponent } from '@openUI/OpenTabs/creater';
import C1 from '@/components/Tabs/example/BInfo&Image.ts';
import C2 from '@/components//Tabs/example/SubBInfo&Image.ts';
import C3 from '@/components/Other/ModelMatain.vue';

const tabsConfigArr = [
  {
    label: '目标维护',
    name: 'first',
    component: markRaw(C1),
  },
  {
    label: '子目标维护',
    name: 'second',
    component: markRaw(C2),
  },
  {
    label: '模型维护',
    name:'third',
    component: markRaw(C3),
  },
];

const comp = createTabsComponent(tabsConfigArr);
export default comp;
