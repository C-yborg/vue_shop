import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element.js';
//引入全局样式表
import './assets/css/global.css';
import './assets/fonts/iconfont.css';
import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
axios.interceptors.request.use(config => {
    //出登录接口外，其他接口都需要token权限，给拦截器添加token验证
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
});
Vue.prototype.$http = axios;
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
