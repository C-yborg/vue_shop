<template>
    <div>
        <bread-crumb :breadContent="['商品管理', '商品分类']" />
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加分类</el-button>
                </el-col>
            </el-row>
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
        },
    },
};
</script>

<style lang="less" scoped></style>
