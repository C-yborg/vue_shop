<template>
    <div>
        <bread-crumb :breadContent="['商品管理', '商品分类']" />
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加分类</el-button>
                </el-col>
            </el-row>
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
            </tree-table>
        </el-card>
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
            ],
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
        },
    },
};
</script>

<style lang="less" scoped></style>
