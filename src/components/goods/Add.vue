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
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                            :action="uploadUrl"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                            :headers="headerObj"
                            :on-success="handleSuccess"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">
                                只能上传jpg/png文件，且不超过500kb
                            </div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor ref="myQuillEditor" v-model="addForm.goods_introduce" />
                        <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewUrl" alt="" class="preview-img" />
        </el-dialog>
    </div>
</template>

<script>
import BreadCrumb from '../BreadCrumb.vue';
import _ from 'lodash';
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
                pics: [], //商品图片数据列表
                goods_introduce: '',
                attrs: [],
            },
            addFormRules: {
                goods_name: [{ required: true, message: '请输入商品名称', tirrger: blur }],
                goods_price: [{ required: true, message: '请输入商品价格', tirrger: blur }],
                goods_number: [{ required: true, message: '请输入商品数量', tirrger: blur }],
                goods_weight: [{ required: true, message: '请输入商品重量', tirrger: blur }],
                goods_cat: [
                    { type: 'array', required: true, message: '请选择商品分类', tirrger: blur },
                ],
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
            uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
            headerObj: {
                Authorization: window.sessionStorage.getItem('token'),
            },
            previewVisible: false,
            previewUrl: '',
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
            // this.addForm.goods_cat = this.addForm.goods_cat.join(',');
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
        //点击图片预览
        handlePreview(file) {
            this.previewUrl = file.response.data.url;
            this.previewVisible = true;
        },
        //移除图片
        handleRemove(file) {
            console.log(file);
            //1.获取图片的临时路径
            const filePath = file.response.data.tmp_path;
            //2.在pic数组种 找到这个路径对应的索引
            const i = this.addForm.pics.findIndex(x => {
                x.pic === filePath;
            });
            //3.把该索引对应的值从数组中溢出
            this.addForm.pics.splice(i, 1);
            console.log(this.addForm);
        },
        //图片上传成功的操作
        handleSuccess(response) {
            console.log(response);
            const picInfo = { pic: response.data.tmp_path };
            this.addForm.pics.push(picInfo);
            console.log(this.addForm);
        },

        async add() {
            this.$refs.addFormRef.validate(valid => {
                if (!valid) {
                    return this.$message.error('请输入必要的表单数据');
                }
            });
            //深拷贝
            const form = _.cloneDeep(this.addForm);
            form.goods_cat = form.goods_cat.join(',');
            //处理动态参数
            this.manyTableData.forEach(item => {
                const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') };
                this.addForm.attrs.push(newInfo);
            });
            //处理静态属性
            this.onlyTableData.forEach(item => {
                const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals };
                this.addForm.attrs.push(newInfo);
            });
            form.attrs = this.addForm.attrs;
            console.log(form);

            //添加商品
            const { data: res } = await this.$http.post('goods', form);
            if (res.meta.status !== 201) {
                return this.$message.error('添加商品失败！');
            }
            this.$message.success('添加商品成功！');
            this.$router.push('/goods');
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
.preview-img {
    width: 100%;
}
.btnAdd {
    margin-top: 15px;
}
</style>
