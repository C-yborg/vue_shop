import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../components/Login';
import Home from '../components/Home.vue';

Vue.use(VueRouter);

const routes = [
    //重定向到login页面
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home },
];

const router = new VueRouter({
    routes,
});

router.beforeEach(function(to, from, next) {
    //to 将要访问的路径
    //from 从哪个路径跳转而来
    //next是一个函数 表示放行
    //next() 放行  next('/login') 强制跳转
    console.log(to);
    console.log(from);
    if (to.path === '/login') {
        return next();
    }
    const tokenStr = window.sessionStorage.getItem('token');
    //如果token不存在，强制跳转到登陆页面
    if (!tokenStr) {
        return next('/login');
    }
    next();
});

export default router;
