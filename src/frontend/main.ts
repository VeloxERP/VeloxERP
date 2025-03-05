import { createApp } from 'vue';
import App from './App.vue';
import { loadFrontendPlugins } from '../plugins/plugin-loader';

const app = createApp(App);

loadFrontendPlugins().then(router => {
    app.use(router);
    app.mount('#app');
});
