import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element.js';
//引入全局样式表
import './assets/css/global.css';
import './assets/fonts/iconfont.css';
import TreeTable from 'vue-table-with-tree-grid';
// 导入面包屑组件
import BreadCrumb from './components/BreadCrumb.vue';
//全局注册面包屑组件
Vue.component('bread-crumb', BreadCrumb);
Vue.component('tree-table', TreeTable);
import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
axios.interceptors.request.use(config => {
    //除登录接口外，其他接口都需要token权限，给拦截器添加token验证
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
});
Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal);
    const y = dt.getFullYear();
    const m = (dt.getMonth() + 1 + '').padStart(2, '0');
    const d = (dt.getDate() + '').padStart(2, '0');
    const hh = (dt.getHours() + '').padStart(2, '0');
    const mm = (dt.getMinutes() + '').padStart(2, '0');
    const ss = (dt.getSeconds() + '').padStart(2, '0');

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
