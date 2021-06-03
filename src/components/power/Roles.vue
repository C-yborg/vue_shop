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
                        <el-row
                            :class="['bdbottom', i1 == 0 ? 'bdtop' : '', 'vcenter']"
                            v-for="(item1, i1) in scope.row.children"
                            :key="item1.id"
                        >
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable>{{ item1.authName }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>

                            <!-- 渲染二级权限 -->
                            <el-col :span="19">
                                <el-row
                                    :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                                    v-for="(item2, i2) in item1.children"
                                    :key="item2.id"
                                >
                                    <!-- 二级权限 -->
                                    <el-col :span="6">
                                        <el-tag type="success" closable>{{
                                            item2.authName
                                        }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级权限 -->
                                    <el-col :span="18">
                                        <el-tag
                                            v-for="item3 in item2.children"
                                            :key="item3.id"
                                            type="warning"
                                            closable
                                            >{{ item3.authName }}</el-tag
                                        >
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
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

<style lang="less" scoped>
.el-tag {
    margin: 7px;
}
.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>
