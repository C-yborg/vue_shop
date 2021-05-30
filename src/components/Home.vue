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
            <el-aside width="200px">Aside</el-aside>
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {
        logout() {
            //清除token
            window.sessionStorage.clear();
            this.$router.push('/login');
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
}
.el-main {
    background-color: #eaedf1;
}
</style>
