<template>
    <div class="login-container">
        <div class="login-box">
            <!-- 头像区域 -->
            <div class="avatar-box">
                <img src="../assets/logo.png" alt="" />
            </div>
            <!-- 登录表单区域 -->
            <el-form
                ref="loginFormRef"
                :model="loginForm"
                :rules="loginFormRules"
                class="login-form"
            >
                <el-form-item prop="username">
                    <el-input
                        v-model="loginForm.username"
                        prefix-icon="iconfont icon-user"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        v-model="loginForm.password"
                        type="password"
                        prefix-icon="iconfont icon-3702mima"
                    ></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm"
                        >重置</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loginForm: {
                username: "admin",
                password: "123456",
            },
            //登录表单校验规则
            loginFormRules: {
                username: [
                    {
                        required: true,
                        message: "请输入登录名称",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 6,
                        message: "长度在 3 到 6 个字符",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "请输入登录密码",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 10,
                        message: "长度在 3 到 10 个字符",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        login() {
            this.$refs.loginFormRef.validate(async (valid) => {
                console.log(valid);
                if (!valid) {
                    return;
                }
                let { data: res } = await this.$http.post(
                    "login",
                    this.loginForm
                );
                if (res.meta.status !== 200) {
                    this.$message.error("登录失败！");
                }
                this.$message.success("登录成功！");
                //1.将登录成功之后的token保存到客户端的sessionStorage中
                //  1.项目中除了登录之外的其他API接口，必须在登录之后才能访问
                //  1.2 token只应在当前网络打开期间生效，所以将token保存在sessionStorage中
                window.sessionStorage.setItem("token", res.data.token);
                this.$router.push("/home");
            });
        },
        //重置登录表单数据
        resetLoginForm() {
            console.log(this);
            this.$refs.loginFormRef.resetFields();
        },
    },
};
</script>

<style lang="less" scoped>
.login-container {
    height: 100%;
    background-color: #2b4b6b;
}
.login-box {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    .avatar-box {
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 130px;
        height: 130px;
        padding: 10px;
        border: 1px solid #eee;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0 0 10px #ddd;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}
.login-form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}
.btns {
    text-align: center;
}
</style>
