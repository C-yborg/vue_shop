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
                    <el-button type="primary" :disabled="isBtnDisabled">添加参数</el-button>
                    <el-table :data="manyTableData" border stripe>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit"
                                    >编辑</el-button
                                >
                                <el-button type="danger" size="mini" icon="el-icon-delete"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" :disabled="isBtnDisabled">添加属性</el-button>
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行效果 -->
                        <el-table-column type="expand" label="#"></el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit"
                                    >编辑</el-button
                                >
                                <el-button type="danger" size="mini" icon="el-icon-delete"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
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
            activeName: 'many',
            //动态参数数据
            manyTableData: [],
            //静态属性数据
            onlyTableData: [],
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
            console.log(this.activeName);
        },
        async getParamsData() {
            //证明选中的不是三级分类
            if (this.selectKeys.length !== 3) {
                this.selectKeys = [];
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
            if (this.activeName === 'many') {
                this.manyTableData = res.data;
            } else {
                this.onlyTableData = res.data;
            }
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
    },
};
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;
}
</style>
