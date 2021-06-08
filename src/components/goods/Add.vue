<template>
    <div>
        <bread-crumb :breadContent="['商品管理', '添加商品']" />
        <el-card>
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
            </el-alert>
            <el-steps :space="200" :active="1" finish-status="success">
                <el-step title="已完成"></el-step>
                <el-step title="进行中"></el-step>
                <el-step title="步骤 3"></el-step>
            </el-steps>
        </el-card>
    </div>
</template>

<script>
import BreadCrumb from '../BreadCrumb.vue';
export default {
    components: { BreadCrumb },
};
</script>

<style lang="less" scoped></style>
