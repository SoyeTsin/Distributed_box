<template>
    <div class="body">
        <div class="header">
            <div class="header-content">
                <div class="title">
                    <img :src="logo">
                    <div>分布式存储后管平台</div>
                </div>
                <div class="logout">
                    <div> {{userName}}</div>
                    <div>退出</div>
                    <div @click="logoutFun"><img :src="logout"></div>
                </div>
            </div>
        </div>
        <div class="main">
            <div class="main-content">
                <div class="aside">
                    <div class="aside-content">
                        <boxAside></boxAside>
                    </div>
                </div>
                <div class="content">
                    <div class="content-box">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import logo from '../assets/logo@2x.png'
    import boxAside from '../components/boxAside'
    import logout from '../assets/logout.png'

    export default {
        name: "index",
        components: {boxAside},
        data() {
            return {
                logo,
                logout,
                userName: ''
            }
        }, mounted() {
            const that = this
            this.userName = localStorage.getItem('username')
            // this.userName = this.$store.state.username
            // 定时获取token流程，10分钟无操作停止
            localStorage.setItem('refresh', '1')//0 停止 1进行 ,定时获取token流程
            let interval = setInterval(() => {
                if (localStorage.getItem('refresh') == '1') {
                    that.refresh()
                } else {
                    clearInterval(interval)
                }
            }, 1000 * 60 * 1)
        }, methods: {
            refresh() {
                const that = this
                this.$fetch(this.$api.refresh)
                    .then((response) => {
                        if (response.code != '10200') {
                            that.msg = response.message
                            return
                        }
                        localStorage.setItem('token', response.data['X-PA-ACCESSTOKEN'])
                        localStorage.setItem('refresToken', response.data['X-PA-REFRESHTOKEN'])

                    })
            },
            logoutFun() {
                const that = this
                this.$fetch(this.$api.logout)
                    .then((response) => {
                        if (response.code != '10200') {
                            that.msg = response.message
                            return
                        }
                        that.$router.push({
                            path: '/login'
                        })
                    })
            }
        }
    }
</script>

<style scoped lang="less">
    body {
        height: 100%;
        width: 100%;
        min-height: 100%;
        position: absolute;
        background: rgb(242, 244, 244);
        font-size: 12px;
        ::after {
            content: '';
            display: block;
            clear: both;
        }
    }

    @contentWidth: 1560px;


    .header {
        height: 75px;
        width: 100%;
        min-width: @contentWidth;
        background: rgb(90, 123, 254);
        margin: auto;
        position: absolute;

        .header-content {
            width: @contentWidth;
            height: 100%;
            text-align: center;
            margin: auto;
            display: flex;
            justify-content: space-between;
            line-height: 75px;
            color: #ffffff;
            box-sizing: border-box;
            padding: 0 5px;
        }

        .title {
            display: flex;
            justify-content: flex-start;

            > img {
                position: relative;
                top: 50%;
                transform: translateY(-50%);
                width: 40px;
                height: 40px;
                margin-right: 20px;
            }

            > div {
                font-family: PingFangSC-Regular;
                font-size: 24px;
                color: #FFFFFF;
                letter-spacing: 0;
            }
        }

        .logout {
            display: flex;
            justify-content: flex-end;

            img {
                width: 34px;
                height: 34px;
                cursor: pointer;
            }

            > div {
                height: 34px;
                margin-left: 15px;
                font-family: PingFangSC-Semibold;
                font-size: 16px;
                color: #FFFFFF;
                letter-spacing: 0;
            }
        }
    }

    .main {
        height: 100%;
        width: @contentWidth;
        box-sizing: border-box;
        margin: auto;
        padding: 75px 0 0 0;
        background: rgb(242, 244, 244);

        .main-content {
            width: @contentWidth;
            height: 100%;
            text-align: center;
            margin: auto;
            display: flex;
            justify-content: space-between;

            .aside {
                width: 224px;
                box-sizing: border-box;
                padding-top: 56px;
                display: flex;
                justify-content: flex-end;

                .aside-content {
                    width: 220px;
                    /*background: #FFFFFF;*/
                    /*box-shadow: 0 3px 3px 1px rgba(190, 190, 190, 0.43);*/
                    /*border-radius: 5px;*/
                }
            }

            /deep/ .el-menu-vertical-demo {
                box-shadow: 0 3px 3px 1px rgba(190, 190, 190, 0.43);
                border-radius: 5px;
                overflow: hidden;
            }

            .content {
                width: calc(~"100% - 224px");
                box-sizing: border-box;
                padding: 56px 10px 0 80px;
                display: flex;
                justify-content: flex-end;

                .content-box {
                    width: 100%;
                }
            }
        }
    }

    @media (max-width: 1440px) {
        .main {
            width: @contentWidth;

            .main-content {
                width: @contentWidth;
            }
        }
    }

    @media (min-width: 1280px)  and (max-width: 1560px) {
        @contentWidth: 1280px;
        .main {
            width: @contentWidth;

            .main-content {
                width: @contentWidth;
            }
        }

        .header {
            min-width: @contentWidth;

            .header-content {
                width: @contentWidth;
            }
        }
    }

    @media (min-width: 1125px) and (max-width: 1280px) {
        @contentWidth: 1125px;
        .main {
            width: @contentWidth;

            .main-content {
                width: @contentWidth;
            }
        }

        .header {
            min-width: @contentWidth;

            .header-content {
                width: @contentWidth;
            }
        }
    }

    @media (max-width: 1125px) {
        @contentWidth: 1050px;
        .main {
            width: @contentWidth;

            .main-content {
                width: @contentWidth;
            }
        }

        .header {
            min-width: @contentWidth;

            .header-content {
                width: @contentWidth;
            }
        }
    }


</style>
