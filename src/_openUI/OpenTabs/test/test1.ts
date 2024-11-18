import { markRaw } from 'vue';
import { createTabsComponent } from '../creater';
import comp1 from '@/components/Table/example/TargetAnalyse.vue';
import comp2 from '@/components/Table/example/TargetBasicInfo.vue';

const tabsConfigArr = [
  {
    label: 'A',
    name: 'first',
    component: markRaw(comp1),
  },
  {
    label: 'B',
    name: 'second',
    component: markRaw(comp2),
  },
];

const comp = createTabsComponent(tabsConfigArr);
export default comp;