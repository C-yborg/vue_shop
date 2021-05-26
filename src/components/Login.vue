<template>
    <div class="login-container">
        <div class="login-box">
            <div class="avatar-box">
                <img src="../assets/logo.png" alt="" />
            </div>
        </div>
    </div>
</template>

<script>
export default {};
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
</style>