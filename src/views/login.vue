<template>
    <el-container class="container">
        <img :src="bg" class="bg">
        <el-main v-show="showPage">
            <div>
                <img :src="contentBg" class="content-bg" @load="loadImage">
                <img :src="contentDecorate" class="content-decorate">
                <div class="title">分布式后管平台</div>
                <div class="account-content">
                    <div class="account-title">分布式后管平台</div>
                    <div class="account-item">
                        <img :src="account_username">
                        <div>用户名：</div>
                        <el-input class="account-input" v-model="login_name" maxlength="25"></el-input>
                    </div>
                    <div class="account-item">
                        <img :src="account_password">
                        <div>密&nbsp;&nbsp;码：</div>
                        <el-input class="account-input" :type="passwordType?'password':'text'"
                                  v-model="password" maxlength="25"></el-input>
                        <img :src="eye" class="eye" @click="passwordType=!passwordType">
                    </div>
                    <div class="msg" v-show="msg">
                        {{msg}}
                    </div>
                    <div>
                        <div class="login-button" @click="login">登录</div>
                    </div>
                    <div class="account-des">
                        需要账号密码请提前联系管理员LEIQIONG989
                    </div>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import bg from '../assets/login_bg.png'
    import contentBg from '../assets/login_content_bg.png'
    import contentDecorate from '../assets/decorate.png'
    import userImg from '../assets/decorate.png'
    import account_username from '../assets/account-user-name.png'
    import account_password from '../assets/account-password.png'
    import eye from '../assets/eye.png'

    export default {
        name: "login",
        data() {
            return {
                bg, contentBg, contentDecorate, userImg, account_username, account_password, eye,
                login_name: 'frontend',
                password: 'password',
                passwordType: true,
                msg: '',
                showPage: false
            }
        }, mounted() {
        }, methods: {
            login() {
                const that = this
                let parameter = {login_name: this.login_name, password: this.password}
                if (!this.login_name || !this.password) {
                    this.msg = '账号和密码均不能为空'
                    return
                }
                this.$post(this.$api.login, parameter)
                    .then((response) => {
                        if (response.code != '10200') {
                            that.msg = response.message
                            return
                        }
                        // that.$store.commit("SET_USERNAME", {username: that.login_name});
                        localStorage.setItem('username', that.login_name)
                        localStorage.setItem('token', response.data['X-PA-ACCESSTOKEN'])
                        localStorage.setItem('refresToken', response.data['X-PA-REFRESHTOKEN'])
                        that.$router.push({
                            path: '/userList'
                        })
                    })
            },
            loadImage() {
                this.showPage = true
            },
        }
    }
</script>

<style scoped lang="less">
    .el-container {
        background: #72b8f9;
        position: absolute;
        width: 100%;
        height: 100%;
        min-height: 960px;
        background-size: 100%;
        background-repeat: no-repeat;

        .bg {
            width: 100%;
            height: 100%;
            position: absolute;
            z-index: 1;
        }
    }

    .el-main {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 2;

        .title {
            font-family: PingFangSC-Semibold;
            z-index: 5;
            font-size: 30px;
            color: #22AFE5;
            letter-spacing: 0;
            line-height: 20px;
            position: absolute;
            top: 50px;
            left: 74px;
        }

        > div {
            width: 1440px;
            height: 850px;
            position: relative;

            .content-bg {
                height: 100%;
                position: relative;
                left: -50px;
                z-index: 2;
            }

            .content-decorate {
                height: 534px;
                position: absolute;
                z-index: 3;
                top: 154px;
                left: 106px;
            }
        }

        .account-content {
            width: 475px;
            height: 600px;
            position: absolute;
            right: 100px;
            top: 100px;
            z-index: 4;

            .msg {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #DC0C22;
                position: relative;
                top: -20px;
                height: 30px;
                content: '';
            }

            .account-title {
                font-family: PingFangSC-Regular;
                font-size: 20px;
                color: #2C6797;
                text-align: center;
                margin-top: 75px;
                margin-bottom: 68px;
            }

            .account-item {
                display: flex;
                justify-content: flex-start;
                width: 473px;
                height: 40px;
                border-bottom: solid #e6e6e6 2px;
                overflow: hidden;
                margin-bottom: 40px;

                /deep/ .el-input__inner {
                    border: none;
                }

                .account-input {
                    width: 350px
                }

                > div {
                    width: 65px;
                    line-height: 40px;
                }

                > input {
                    width: 150px
                }

                img {
                    width: 25px;
                    height: 25px;
                    position: relative;
                    top: 6px;
                    margin-right: 10px;
                }

                .eye {
                    width: 22px;
                    height: 11px;
                    top: 14px;
                    cursor: pointer;
                }
            }

            .login-button {
                width: 180px;
                height: 40px;
                text-align: center;
                margin: 68px auto 45px auto;
                line-height: 40px;
                color: #ffffff;
                background-image: linear-gradient(-90deg, #77C9F2 0%, #48B2E4 78%);
                box-shadow: 0 2px 4px 2px rgba(186, 184, 184, 0.50);
                border-radius: 21px;
                cursor: pointer;
            }

            .account-des {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #2C375B;
                text-align: center;
                margin: auto;
            }
        }
    }
</style>
