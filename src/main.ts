import './assets/main.css';
import './assets/scss/index.scss';

import './assets/ktStyle.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import vue3TreeOrg from 'vue3-tree-org';
import 'vue3-tree-org/lib/vue3-tree-org.css';

//@ts-ignore
import directive from './directive';

const app = createApp(App);

directive(app);

app.use(createPinia()).use(router).use(ElementPlus).use(vue3TreeOrg);

app.mount('#app');
