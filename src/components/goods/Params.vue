<template>
    <div>
        <bread-crumb :breadContent="['商品管理', '分类参数']" />
        <el-card>
            <el-alert show-icon title="警告提示的文案" type="warning" :closable="false" />
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <el-cascader
                        v-model="selectKeys"
                        :options="cateList"
                        :props="cascaderProps"
                        @change="handleChange"
                    ></el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button
                        type="primary"
                        :disabled="isBtnDisabled"
                        @click="addDialogVisible = true"
                        >添加参数</el-button
                    >
                    <el-table :data="manyTableData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag
                                    v-for="(item, i) in scope.row.attr_vals"
                                    :key="i"
                                    closable
                                    @close="handleClose(i, scope.row)"
                                    >{{ item }}</el-tag
                                >
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(scope.row)"
                                    >+ New Tag</el-button
                                >
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    icon="el-icon-edit"
                                    @click="showEditDialog(scope.row)"
                                    >编辑</el-button
                                >
                                <el-button
                                    type="danger"
                                    size="mini"
                                    icon="el-icon-delete"
                                    @click="deleteParams(scope.row.attr_id)"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button
                        type="primary"
                        :disabled="isBtnDisabled"
                        @click="addDialogVisible = true"
                        >添加属性</el-button
                    >
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行效果 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag
                                    v-for="(item, i) in scope.row.attr_vals"
                                    :key="i"
                                    closable
                                    @close="handleClose(i, scope.row)"
                                    >{{ item }}</el-tag
                                >
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(scope.row)"
                                    >+ New Tag</el-button
                                >
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    icon="el-icon-edit"
                                    @click="showEditDialog(scope.row)"
                                    >编辑</el-button
                                >
                                <el-button
                                    type="danger"
                                    size="mini"
                                    icon="el-icon-delete"
                                    @click="deleteParams(scope.row.attr_id)"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数弹框 -->
        <el-dialog
            :title="'添加' + titleText"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed"
        >
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑参数弹框 -->
        <el-dialog
            :title="'编辑' + titleText"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed"
        >
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectKeys: [],
            cateList: [],
            cascaderProps: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
            },
            activeName: 'many',
            //动态参数数据
            manyTableData: [],
            //静态属性数据
            onlyTableData: [],
            //控制添加弹框显示与隐藏
            addDialogVisible: false,
            addForm: {
                attr_name: '',
            },
            addFormRules: {
                attr_name: [
                    {
                        required: true,
                        message: '请输入参数名称',
                        trigger: 'blur',
                    },
                ],
            },
            editDialogVisible: false,
            editForm: {
                attr_id: 0,
                attr_name: '',
            },
            editFormRules: {
                attr_name: [
                    {
                        required: true,
                        message: '请输入参数名称',
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    created() {
        this.getCateList();
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories');
            if (res.meta.status !== 200) {
                return this.$message.error('获取分类列表失败！');
            }
            this.cateList = res.data;
            console.log(res.data);
        },
        async handleChange() {
            this.getParamsData();
        },
        handleClick() {
            this.getParamsData();
        },
        async getParamsData() {
            //证明选中的不是三级分类  并且清空表格数据
            if (this.selectKeys.length !== 3) {
                this.selectKeys = [];
                this.manyTableData = [];
                this.onlyTableData = [];
                return;
            }
            //根据当前所选分类id，和当前所处的面板，获得对应的参数
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                params: { sel: this.activeName },
            });
            if (res.meta.status !== 200) {
                return this.$message.error('获取参数列表失败！');
            }
            console.log(res.data);
            res.data.forEach(item => {
                //判断attr_vals是否为空字符串
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
                //控制new tag 输入框的显示与隐藏
                item.inputVisible = false;
                //new tag 输入框的值
                item.inputValue = '';
            });
            if (this.activeName === 'many') {
                this.manyTableData = res.data;
            } else {
                this.onlyTableData = res.data;
            }
        },
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
        },
        //添加参数确定按钮
        addParams() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) {
                    return;
                }
                const { data: res } = await this.$http.post(
                    `categories/${this.cateId}/attributes`,
                    { attr_name: this.addForm.attr_name, attr_sel: this.activeName }
                );
                if (res.meta.status !== 201) {
                    return this.$message.error('添加参数失败！');
                }
                this.$message.success('添加参数成功！');
                this.getParamsData();
                this.addDialogVisible = false;
            });
        },
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },
        //打开编辑弹框
        showEditDialog(paramsInfo) {
            this.editForm.attr_id = paramsInfo.attr_id;
            this.editForm.attr_name = paramsInfo.attr_name;
            this.editDialogVisible = true;
        },
        editParams() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) {
                    return;
                }
                const {
                    data: res,
                } = await this.$http.put(
                    `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                    { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
                );
                if (res.meta.status !== 200) {
                    return this.$message.error('编辑参数失败！');
                }
                this.$message.success('编辑参数成功！');
                this.getParamsData();
                this.editDialogVisible = false;
            });
        },
        async deleteParams(attr_id) {
            const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).catch(err => err);
            if (confirmResult === 'cancel') {
                return this.$message.info('已取消删除！');
            }
            const { data: res } = await this.$http.delete(
                `categories/${this.cateId}/attributes/${attr_id}`
            );
            if (res.meta.status !== 200) {
                return this.$message.error('删除参数失败！');
            }
            this.$message.success('删除参数成功！');
            this.getParamsData();
        },
        //新标签的输入框事件
        handleInputConfirm(row) {
            if (row.inputValue.trim().length === 0) {
                //如果输入了无效空格，则清空
                row.inputValue = '';
                row.inputVisible = false;
                return;
            }
            //将合法值添加到数组 在页面显示
            row.attr_vals.push(row.inputValue.trim());
            row.inputValue = '';
            row.inputVisible = false;
            this.saveAttrVals(row);
        },
        //new tag 点击
        showInput(row) {
            row.inputVisible = true;
            //让文本输入框点击自动获得焦点
            //$nextTick作用：当页面元素重新选渲染后，才执行回调函数种的代码
            // 每当页面重新渲染  都会调用$nextTick
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        //删除el tag 标签项
        handleClose(i, row) {
            //根据索引删除该项
            row.attr_vals.splice(i, 1);
            this.saveAttrVals(row);
        },
        //将对attr_vals的操作  保存到数据库
        async saveAttrVals(row) {
            const { data: res } = await this.$http.put(
                `categories/${this.cateId}/attributes/${row.attr_id}`,
                {
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    attr_vals: row.attr_vals.join(' '),
                }
            );
            if (res.meta.status !== 200) {
                return this.$message.error('更新参数失败！');
            }
            this.$message.success('更新参数成功！');
        },
    },
    computed: {
        isBtnDisabled() {
            //如果按钮要禁用，返回true,否则返回false
            // 级联选择器为3级按钮才可用
            if (this.selectKeys.length !== 3) {
                return true;
            }
            return false;
        },
        //当前选中的三级分类的id
        cateId() {
            if (this.selectKeys.length === 3) {
                return this.selectKeys[2];
            }
            return null;
        },
        titleText() {
            if (this.activeName === 'many') {
                return '动态参数';
            } else {
                return '静态属性';
            }
        },
    },
};
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;
}
.el-tag {
    margin: 10px;
}

.input-new-tag {
    width: 120px;
}
</style>
