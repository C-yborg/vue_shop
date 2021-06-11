<template>
    <div>
        <bread-crumb :breadContent="['商品管理', '添加商品']" />
        <el-card>
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
            </el-alert>
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- tabs栏 -->
            <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="addFormRef"
                label-width="100px"
                label-position="top"
            >
                <el-tabs
                    v-model="activeIndex"
                    tab-position="left"
                    :before-leave="beforeLeaveTab"
                    @tab-click="tabClicked"
                >
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称：" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格：" prop="goods_price">
                            <el-input v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量：" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量：" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类：" prop="goods_cat">
                            <el-cascader
                                v-model="addForm.goods_cat"
                                :options="cateList"
                                :props="cateProps"
                                @change="handleChange"
                            ></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item
                            :label="item.attr_name"
                            v-for="item in manyTableData"
                            :key="item.attr_id"
                        >
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox
                                    :label="cb"
                                    v-for="(cb, i) in item.attr_vals"
                                    :key="i"
                                    border
                                ></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item
                            :label="item.attr_name"
                            v-for="item in onlyTableData"
                            :key="item.attr_id"
                        >
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">定时任务补偿</el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">定时任务补偿</el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import BreadCrumb from '../BreadCrumb.vue';
export default {
    components: { BreadCrumb },
    data() {
        return {
            activeIndex: 0,
            addForm: {
                goods_name: '',
                goods_price: '',
                goods_number: '',
                goods_weight: '',
                goods_cat: [],
            },
            addFormRules: {
                goods_name: [{ required: true, message: '请输入商品名称', tirrger: blur }],
                goods_price: [{ required: true, message: '请输入商品价格', tirrger: blur }],
                goods_number: [{ required: true, message: '请输入商品数量', tirrger: blur }],
                goods_weight: [{ required: true, message: '请输入商品重量', tirrger: blur }],
                goods_cat: [{ required: true, message: '请选择商品分类', tirrger: blur }],
            },
            //商品分类列表
            cateList: [],
            cateProps: {
                label: 'cat_name',
                children: 'children',
                value: 'cat_id',
                expandTrigger: 'hover',
            },
            manyTableData: [], //动态参数列表
            onlyTableData: [], //静态属性列表
        };
    },
    created() {
        this.getCateList();
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories');
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败!');
            }
            this.cateList = res.data;
            console.log(this.cateList);
        },
        handleChange() {
            console.log(this.addForm.goods_cat);
            if (this.addForm.goods_cat.length !== 3) {
                this.addForm.goods_cat = [];
                return;
            }
        },
        //tabs before-leave
        beforeLeaveTab(activeName, oldActiveName) {
            if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                this.$message.error('请选择商品分类！');
                return false;
            }
        },
        async tabClicked() {
            if (this.activeIndex === '1') {
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: { sel: 'many' },
                });
                if (res.meta.status !== 200) {
                    return this.$message.error('获取动态参数失败');
                }
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ');
                });
                this.manyTableData = res.data;
                console.log(this.manyTableData);
            } else if (this.activeIndex === '2') {
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: { sel: 'only' },
                });
                if (res.meta.status !== 200) {
                    return this.$message.error('获取静态属性失败');
                }
                // res.data.forEach(item => {
                //     item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ');
                // });
                this.onlyTableData = res.data;
                console.log(this.onlyTableData);
            }
        },
    },
    computed: {
        cateId() {
            if (this.addForm.goods_cat.length === 3) {
                return this.addForm.goods_cat[2];
            }
            return null;
        },
    },
};
</script>

<style lang="less" scoped>
.el-steps {
    margin-top: 15px;
}
.el-step__title {
    font-size: 16px;
}
.el-tabs {
    margin-top: 15px;
}
.el-checkbox {
    margin: 0 10px 0 0;
}
</style>
