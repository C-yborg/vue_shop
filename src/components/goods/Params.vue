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
                <el-tab-pane label="动态参数" name="first">动态参数</el-tab-pane>
                <el-tab-pane label="静态参数" name="second">静态参数</el-tab-pane>
            </el-tabs>
        </el-card>
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
            activeName: 'first',
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
        handleChange() {
            console.log(this.selectKeys);
        },
        handleClick() {
            console.log(this.activeName);
        },
    },
};
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;
}
</style>
