<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ breadContent[0] }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ breadContent[1] }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    props: {
        breadContent: {
            type: Array,
        },
    },
};
</script>
