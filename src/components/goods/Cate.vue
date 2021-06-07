<template>
    <div>
        <!-- 面包屑 -->
        <bread-crumb :breadContent="['商品管理', '商品分类']" />
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateForm">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格区域 -->
            <tree-table
                :data="cateList"
                :columns="columns"
                :selection-type="false"
                :expand-type="false"
                show-index
                index-text="#"
                border
            >
                <template slot="isok" slot-scope="scope">
                    <i
                        v-if="scope.row.cat_deleted === false"
                        class="el-icon-success"
                        style="color:lightgreen;"
                    ></i>
                    <i v-else class="el-icon-error" style="color:red;"></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1"
                        >二级</el-tag
                    >
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <template slot="opt" slot-scope="scope">
                    <el-button
                        class="el-icon-edit"
                        type="primary"
                        size="mini"
                        @click="editCate(scope.row)"
                        >编辑</el-button
                    >
                    <el-button
                        class="el-icon-delete"
                        type="danger"
                        size="mini"
                        @click="deleteCate(scope.row)"
                        >删除</el-button
                    >
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>

        <!-- 添加分类对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addFormVisible"
            width="50%"
            @close="addCateDialogClosed"
        >
            <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules">
                <el-form-item label="分类名称：" prop="cat_name" label-width="100px">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：" label-width="100px">
                    <el-cascader
                        v-model="selectKeys"
                        :options="parentCateList"
                        :props="cascaderProps"
                        clearable
                        change-on-select
                        @change="parentCateChanged"
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹窗 -->
        <el-dialog
            title="编辑分类"
            :visible.sync="editFormVisible"
            width="50%"
            @close="editDialogClosed"
        >
            <el-form ref="editCateFormRef" :model="editCateForm" :rules="editCateFormRules">
                <el-form-item label="分类名称：" prop="cat_name" label-width="100px">
                    <el-input v-model="editCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCateSave">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import BreadCrumb from '../BreadCrumb.vue';
export default {
    components: { BreadCrumb },
    data() {
        return {
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5,
            },
            total: null,
            cateList: [], //商品分类列表
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name',
                },
                {
                    label: '是否有效',
                    type: 'template',
                    template: 'isok',
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'order',
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'opt',
                },
            ],
            addFormVisible: false, //控制添加分类的显示与隐藏
            editFormVisible: false, //控制编辑分类的显示与隐藏
            editCateForm: {
                cat_name: '',
                cat_id: 0,
            },
            addCateForm: {
                cat_name: '', //添加分类的名称
                cat_pid: '', //分类父id
                cat_level: 0, //分类层级
            },
            //添加分类表单验证规则
            addCateFormRules: {
                cat_name: [
                    {
                        required: true,
                        message: '请输入分类名称',
                        trigger: 'blur',
                    },
                ],
            },
            editCateFormRules: {
                cat_name: [
                    {
                        required: true,
                        message: '请输入分类名称',
                        trigger: 'blur',
                    },
                ],
            },
            parentCateList: [], //添加分类弹框种   父级分类数据列表
            cascaderProps: {
                expandTrigger: 'hover',
                label: 'cat_name',
                value: 'cat_id',
                children: 'children',
            },
            selectKeys: [],
        };
    },
    created() {
        this.getCateList();
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories', { params: this.queryInfo });
            console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('获取分类列表失败！');
            }
            this.cateList = res.data.result;
            this.total = res.data.total;
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getCateList();
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getCateList();
        },
        //打开添加分类弹窗
        showAddCateForm() {
            this.getParentCate();
            this.addFormVisible = true;
        },
        async getParentCate() {
            const { data: res } = await this.$http.get('categories', { params: { type: 2 } });
            if (res.meta.status !== 200) {
                return this.$message.error('获取父级分类失败');
            }
            this.parentCateList = res.data;
            console.log(this.parentCateList);
        },
        //级联选择器值发生改变时的回调
        parentCateChanged() {
            console.log(this.selectKeys);
            //如果selectKeys的数组长度 > 0, 证明选中的父级分类
            //反之 就说明没有选中父级分类
            if (this.selectKeys.length > 0) {
                //父级分类的id
                this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
                //为当前等级赋值
                this.addCateForm.cat_level = this.selectKeys.length;
            } else {
                this.addCateForm.cat_pid = 0;
                this.addCateForm.cat_level = 0;
            }
        },
        //弹框确定事件
        addCate() {
            // console.log(this.addCateForm);
            this.$refs.addCateFormRef.validate(async valid => {
                if (!valid) {
                    return;
                }
                const { data: res } = await this.$http.post('categories', this.addCateForm);
                if (res.meta.status !== 201) {
                    return this.$message.error('添加分类失败！');
                }
                this.$message.success('添加分类成功！');
                this.getCateList();
                this.addFormVisible = false;
            });
        },
        //弹框关闭时的回调
        addCateDialogClosed() {
            this.$refs.addCateFormRef.resetFields();
            this.selectKeys = [];
            this.addCateForm.cat_name = '';
            this.addCateForm.cat_pid = 0;
            this.addCateForm.cat_level = 0;
        },
        //删除分类
        deleteCate(cateInfo) {
            this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(async () => {
                    const { data: res } = await this.$http.delete(`categories/${cateInfo.cat_id}`);
                    if (res.meta.status !== 200) {
                        return this.$message.error('删除分类失败！');
                    }
                    this.$message({
                        type: 'success',
                        message: '删除分类成功!',
                    });
                    this.getCateList();
                })
                .catch(() => {
                    this.$message({
                        type: 'error',
                        message: '已取消删除',
                    });
                });
        },
        //编辑分类
        editCate(cateInfo) {
            console.log(cateInfo);
            this.editCateForm.cat_name = cateInfo.cat_name;
            this.editCateForm.cat_id = cateInfo.cat_id;
            this.editFormVisible = true;
        },
        //编辑分类弹框关闭时的回调
        editDialogClosed() {
            this.$refs.editCateFormRef.resetFields();
        },
        //提交编辑
        editCateSave() {
            this.$refs.editCateFormRef.validate(async valid => {
                if (!valid) {
                    return;
                }
                const { data: res } = await this.$http.put(
                    `categories/${this.editCateForm.cat_id}`,
                    { cat_name: this.editCateForm.cat_name }
                );
                if (res.meta.status !== 200) {
                    return this.$message.error('编辑分类失败！');
                }
                this.$message.success('编辑分类成功！');
                this.getCateList();
                this.editFormVisible = false;
            });
        },
    },
};
</script>

<style lang="less" scoped>
// 树形表格上外边距
.zk-table {
    margin-top: 15px;
}

.el-cascader {
    width: 100%;
}
</style>
