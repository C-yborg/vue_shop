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
                <el-tabs v-model="activeIndex" tab-position="left">
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
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">配置管理</el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">角色管理</el-tab-pane>
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
            },
            addFormRules: {
                goods_name: [{ required: true, message: '请输入商品名称', tirrger: blur }],
                goods_price: [{ required: true, message: '请输入商品价格', tirrger: blur }],
                goods_number: [{ required: true, message: '请输入商品数量', tirrger: blur }],
                goods_weight: [{ required: true, message: '请输入商品重量', tirrger: blur }],
            },
        };
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
</style>
