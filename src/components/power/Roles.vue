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
                                <el-tag @close="removeRightById(scope.row, item1.id)" closable>{{
                                    item1.authName
                                }}</el-tag>
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
                                        <el-tag
                                            type="success"
                                            @close="removeRightById(scope.row, item2.id)"
                                            closable
                                            >{{ item2.authName }}</el-tag
                                        >
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级权限 -->
                                    <el-col :span="18">
                                        <el-tag
                                            v-for="item3 in item2.children"
                                            :key="item3.id"
                                            type="warning"
                                            closable
                                            @close="removeRightById(scope.row, item3.id)"
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
                        <el-button
                            type="warning"
                            icon="el-icon-setting"
                            size="mini"
                            @click="showSetRightDialog(scope.row)"
                            >分配权限</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%"
            @close="rightDialogClosed"
        >
            <el-tree
                ref="treeRef"
                :data="rightList"
                :props="treeProps"
                node-key="id"
                show-checkbox
                default-expand-all
                :default-checked-keys="defKeys"
            ></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            roleList: [],
            roleId: '',
            rightList: [],
            //控制分配权限弹框的显示与隐藏
            setRightDialogVisible: false,
            //树形控件属性绑定对象
            treeProps: {
                label: 'authName',
                children: 'children',
            },
            //存放权限id，树形被选中的权限
            defKeys: [],
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
        // 删除权限
        async removeRightById(role, rightId) {
            const confirmData = await this.$confirm('是否确定删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).catch(err => err);
            if (confirmData === 'cancel') {
                return this.$message.error('取消了删除');
            }
            const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
            if (res.meta.status !== 200) {
                return this.$message.error('删除权限失败！');
            }
            //防止权限列表合起来  假如调用getRoleList会刷新页面，列表会合起来
            role.children = res.data;
        },
        //分配权限弹框
        async showSetRightDialog(role) {
            const { data: res } = await this.$http.get('rights/tree');
            console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('获取分配权限列表失败！');
            }
            this.rightList = res.data;
            this.getLeafKeys(role, this.defKeys);
            //id赋值，以供权限授权使用
            this.roleId = role.id;
            this.setRightDialogVisible = true;
        },

        //通过递归的方式，获取每个角色下所有三级权限的id，并保存在defKeys数组中
        getLeafKeys(node, arr) {
            //如果当前node不包含children属性，则该node是三级节点
            if (!node.children) {
                return arr.push(node.id);
            }

            node.children.forEach(item => {
                this.getLeafKeys(item, arr);
            });
        },
        // 分配权限弹框关闭时的回调
        rightDialogClosed() {
            this.defKeys = [];
        },

        //点击为角色分配权限
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),
            ];
            console.log(keys);
            const ridStr = keys.join(',');
            const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
                rids: ridStr,
            });
            if (res.meta.status !== 200) {
                return this.$message.error('角色授权失败！');
            }

            this.$message.success('分配权限成功！');
            //重新获取最新数据
            this.getRoleList();
            this.setRightDialogVisible = false;
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
