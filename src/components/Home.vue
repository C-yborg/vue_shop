<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="" />
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#409EFF"
                    unique-opened
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    router
                    :default-active="activePath"
                >
                    <el-submenu
                        :index="subItem.id + ''"
                        v-for="subItem in menuList"
                        :key="subItem.id"
                    >
                        <template slot="title">
                            <i :class="iconObj[subItem.id]"></i>
                            <span>{{ subItem.authName }}</span>
                        </template>
                        <el-menu-item
                            :index="'/' + item.path"
                            v-for="item in subItem.children"
                            :key="item.id"
                            @click="saveNavState('/' + item.path)"
                        >
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{ item.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            menuList: [], //左侧菜单数据
            iconObj: {
                125: 'iconfont icon-user',
                103: 'iconfont icon-tijikongjian',
                101: 'iconfont icon-shangpin',
                102: 'iconfont icon-danju',
                145: 'iconfont icon-baobiao',
            },
            isCollapse: false, //控制左侧菜单折叠
            activePath: '', //左侧菜单默认激活选项
        };
    },
    created() {
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem('activePath');
    },
    methods: {
        logout() {
            //清除token
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
        async getMenuList() {
            const { data: res } = await this.$http.get('menus');
            console.log(res);
            this.menuList = res.data;
        },
        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
        //保存链接的激活状态
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath);
            this.activePath = activePath;
        },
    },
};
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}
.el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #373d41;
    > div {
        display: flex;
        align-items: center;
        color: #fff;
        span {
            margin-left: 15px;
        }
    }
    img {
        width: 50px;
    }
}
.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf1;
}
.iconfont {
    margin-right: 10px;
}
.toggle-button {
    line-height: 24px;
    text-align: center;
    color: #fff;
    background-color: #4a5064;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
