<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>
            <el-table :data="roleList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for="item1 in scope.row.children" :key="item1.id">
                            <el-col :span="5">
                                <el-tag>{{ item1.authName }}</el-tag>
                            </el-col>
                            <el-col :span="19">45456</el-col>
                        </el-row>
                        <pre>{{ scope.row }}</pre>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini"
                            >分配权限</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            roleList: [],
        };
    },
    created() {
        this.getRoleList();
    },
    methods: {
        async getRoleList() {
            const { data: res } = await this.$http.get('roles');
            console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败！');
            }
            this.roleList = res.data;
        },
    },
};
</script>

<style lang="less" scoped></style>
