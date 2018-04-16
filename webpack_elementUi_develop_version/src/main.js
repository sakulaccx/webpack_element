import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import GlobalTools from './plugins/globalTools'
import routes from './router'

const router = new VueRouter({
    mode: 'history',
    routes
});

Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(GlobalTools, router);

new Vue({
    router,
    el: '#app',
    render: h => h(App),
});
