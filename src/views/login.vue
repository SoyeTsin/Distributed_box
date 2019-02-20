<template>
    <el-container>
        <el-main>
            <div>
                <div class="account-content">
                    <el-input></el-input>
                    <el-input></el-input>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "login"
    }
</script>

<style scoped lang="less">
    .el-container {
        background: #72b8f9;
        position: absolute;
        width: 100%;
        height: 100%;

    }

    .el-main {
        display: flex;
        justify-content: center;
        align-items: center;

        > div {
            width: 1440px;
            height: 850px;
            background: #ffffff;
            position: relative;
        }

        .account-content {
            width: 475px;
            height: 600px;
            position: absolute;
            right: 100px;
            top: 100px;
            border: solid 1px #e5e5e5;
        }
    }
</style>
