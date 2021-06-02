<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="7"
                    ><el-input
                        v-model="queryInfo.query"
                        placeholder="请输入内容"
                        class="input-with-select"
                        clearable
                        @clear="getUserList"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getUserList"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addFormVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data="userList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <template v-slot="scope">
                        <el-switch
                            v-model="scope.row.mg_state"
                            @change="userStateChanged(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template v-slot="scope">
                        <el-tooltip content="编辑角色" placement="top" :enterable="false">
                            <el-button
                                type="primary"
                                icon="el-icon-edit"
                                size="mini"
                                @click="editUser(scope.row.id)"
                            ></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除角色" placement="top" :enterable="false">
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                @click="removeUserById(scope.row.id)"
                            ></el-button>
                        </el-tooltip>
                        <el-tooltip content="分配角色" placement="top" :enterable="false">
                            <el-button type="info" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>
        <!-- 添加用户弹窗 -->
        <el-dialog title="添加用户" :visible.sync="addFormVisible" @close="dialogClosed">
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
                <el-form-item label="用户名：" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机：" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑用户弹窗 -->
        <el-dialog title="编辑用户" :visible.sync="editFormVisible" @close="editDialogClosed">
            <el-form ref="editFormRef" :model="editForm" :rules="addFormRules" label-width="80px">
                <el-form-item label="用户名：" prop="username">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="手机：" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="editFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUserInfo">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        //邮箱校验规则
        const checkEmail = (rule, value, callback) => {
            const emailReg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
            if (!value) {
                return callback(new Error('邮箱不能为空'));
            }
            if (emailReg.test(value)) {
                return callback();
            }
            callback(new Error('请输入合法的邮箱'));
        };
        //手机号校验规则
        const checkMobile = (rule, value, callback) => {
            const mobileReg = /^1[3-9]\d{9}$/;
            if (!value) {
                return callback(new Error('手机号不能为空'));
            }
            if (mobileReg.test(value)) {
                return callback();
            }
            callback(new Error('请输入合法的手机号'));
        };
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 2,
            },
            userList: [],
            total: 0,
            //控制添加用户弹窗的开关
            addFormVisible: false,
            //编辑用户弹窗开关
            editFormVisible: false,
            addForm: {
                username: '',
                password: '',
                mobile: '',
                email: '',
            },
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '密码的长度在3~10个字符之间', trigger: 'blur' },
                ],
                email: [{ validator: checkEmail, trigger: 'blur' }],
                mobile: [{ validator: checkMobile, trigger: 'blur' }],
            },
            editForm: {},
        };
    },
    created() {
        this.getUserList();
    },
    methods: {
        async getUserList() {
            const { data: res } = await this.$http.get('users', { params: this.queryInfo });
            if (res.meta.status !== 200) {
                return this.$message.error('获取用户列表失败');
            }
            this.userList = res.data.users;
            this.total = res.data.total;
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getUserList();
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getUserList();
        },
        //修改用户状态
        async userStateChanged(userInfo) {
            console.log(userInfo);
            const { data: res } = await this.$http.put(
                `users/${userInfo.id}/state/${userInfo.mg_state}`
            );
            if (res.meta.status !== 200) {
                userInfo.mg_state = !userInfo.mg_state;
                return this.$message.error('更新用户状态失败！');
            }
            this.$message.success('更新用户状态成功！');
        },
        //dialog关闭时的回调
        dialogClosed() {
            this.$refs.addFormRef.resetFields();
        },
        addUser() {
            //先验证表单项是否完整
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) {
                    return;
                }
                const { data: res } = await this.$http.post('users', this.addForm);
                if (res.meta.status !== 201) {
                    return this.$message.error('添加用户失败！');
                }
                this.$message.success('添加用户成功！');
                this.addFormVisible = false;
                this.getUserList();
            });
        },
        async editUser(id) {
            const { data: res } = await this.$http.get('users/' + id);
            if (res.meta.status !== 200) {
                return this.$message.error('查询用户信息失败！');
            }
            this.editForm = res.data;
            this.editFormVisible = true;
        },
        //editDialog关闭时的回调
        editDialogClosed() {
            //清楚表单校验结果
            this.$refs.editFormRef.clearValidate();
        },
        //修改用户信息并提交
        editUserInfo() {
            this.$refs.editFormRef.validate(async valid => {
                console.log(valid);
                if (!valid) {
                    return;
                }
                const { data: res } = await this.$http.put('users/' + this.editForm.id, {
                    email: this.editForm.email,
                    mobile: this.editForm.mobile,
                });
                if (res.meta.status !== 200) {
                    return this.$message.error('修改用户信息失败！');
                }
                this.editFormVisible = false; //关闭弹窗
                this.getUserList(); //重新获取，刷新列表数据
                this.$message.success('修改用户信息成功！');
            });
        },
        //根据id删除角色
        removeUserById(id) {
            this.$confirm('是否确定删除该用户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
            })
                .then(async () => {
                    const { data: res } = await this.$http.delete('users/' + id);
                    if (res.meta.status !== 200) {
                        return this.$message.error('删除用户失败！');
                    }
                    this.$message.success('删除用户成功！');
                    this.getUserList();
                })
                .catch(err => {
                    this.$message.info('已取消删除');
                });
        },
    },
};
</script>

<style lang="less" scoped></style>
