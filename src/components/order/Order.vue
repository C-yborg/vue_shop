<template>
    <div>
        <bread-crumb :breadContent="['订单管理', '订单列表']" />
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col>
                    <el-table :data="orderList" border stripe>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="订单编号" prop="order_number"></el-table-column>
                        <el-table-column label="订单价格" prop="order_price"></el-table-column>
                        <el-table-column label="是否付款" prop="pay_status">
                            <template slot-scope="scope">
                                <el-tag type="success" v-if="scope.row.pay_status === '1'"
                                    >已付款</el-tag
                                >
                                <el-tag type="danger" v-else>未付款</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="是否发货" prop="is_send"></el-table-column>
                        <el-table-column label="下单时间" prop="create_time">
                            <template slot-scope="scope">{{
                                scope.row.create_time | dateFormat
                            }}</template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="primary"
                                    icon="el-icon-edit"
                                    @click="showBox"
                                ></el-button>
                                <el-button
                                    size="mini"
                                    type="success"
                                    icon="el-icon-location"
                                    @click="showProgressBox"
                                ></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryInfo.pagenum"
                        :page-sizes="[1, 5, 10, 15]"
                        :page-size="queryInfo.pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                    >
                    </el-pagination>
                </el-col>
            </el-row>
        </el-card>
        <el-dialog
            title="修改地址"
            :visible.sync="addressVisible"
            width="50%"
            @close="addressDialogClosed"
        >
            <el-form
                :model="addressForm"
                :rules="addressFormRules"
                ref="addressFormRef"
                label-width="100px"
            >
                <el-form-item label="省/市" prop="address1">
                    <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input type="text" v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button>取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import BreadCrumb from '../BreadCrumb.vue';
import cityData from './citydata';
export default {
    components: { BreadCrumb },
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10,
            },
            total: 0,
            orderList: [],
            addressVisible: false,
            addressForm: {
                address1: '',
                address2: '',
            },
            addressFormRules: {
                address1: [{ required: true, message: '请选择省市', trigger: 'blur' }],
                address2: [{ required: true, message: '请选择省市', trigger: 'blur' }],
            },
            cityData,
        };
    },
    created() {
        this.getOrderList();
    },
    methods: {
        async getOrderList() {
            const { data: res } = await this.$http.get('orders', { params: this.queryInfo });
            if (res.meta.status !== 200) {
                return this.$message.error('获取订单列表失败！');
            }
            console.log(res);
            this.total = res.data.total;
            this.orderList = res.data.goods;
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getOrderList();
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getOrderList();
        },
        showBox() {
            this.addressVisible = true;
        },
        addressDialogClosed() {
            this.$refs.addressFormRef.resetFields();
        },
    },
};
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
</style>
