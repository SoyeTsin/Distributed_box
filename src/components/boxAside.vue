<template>
    <el-menu
            :default-active="path"
            class="el-menu-vertical-demo"
            :default-openeds='["1","2"]'
    >
        <el-submenu index="1">
            <template slot="title">
                <img src="../assets/menu-1.png" class="icon-1"/>
                <span>盒子端管理</span>
            </template>
            <el-menu-item-group>
                <el-menu-item index="/userList" @click="into('/userList')">用户列表</el-menu-item>
                <el-menu-item index="/boxList" @click="into('/boxList')">盒子列表</el-menu-item>
                <el-menu-item index="/integralList" @click="into('/integralList')">积分对账</el-menu-item>
                <!--<el-menu-item index="1-4" @click="into('/userList')">盒子热更新</el-menu-item>-->
            </el-menu-item-group>
        </el-submenu>
        <div class="aside-line"></div>
        <el-submenu index="2">
            <template slot="title">
                <img src="../assets/menu-2.png" class="icon-2"/>
                <span>盒子热更新</span>
            </template>
            <el-menu-item-group>
                <el-menu-item index="/appRegister" @click="into('/appRegister')">程序注册</el-menu-item>
                <el-menu-item index="/appHistory" @click="into('/appHistory')">历史注册</el-menu-item>
                <el-menu-item index="/appReport" @click="into('/appReport')">上报状态</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <div class="aside-line"></div>
        <el-submenu index="2">
            <template slot="title">
                <img src="../assets/menu-2.png" class="icon-2"/>
                <span>数据统计</span>
            </template>
            <el-menu-item-group>
                <el-menu-item index="/userStatistics" @click="into('/userStatistics')">盒子用户统计</el-menu-item>
                <el-menu-item index="/boxStatistics" @click="into('/boxStatistics')">盒子节点统计</el-menu-item>
            </el-menu-item-group>
        </el-submenu>

    </el-menu>
</template>

<script>
    export default {
        name: "boxAside",
        data() {
            return {
                path: ''
            }
        },
        mounted() {
            this.path = this.$route.path
        },
        methods: {
            into(e) {
                this.$router.push({
                    path: e
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .el-menu-vertical-demo {
        .icon-1 {
            width: 28px;
            height: 28px;
        }

        .icon-2 {
            width: 22px;
            height: 22px;
            margin-right: 6px;
        }

        .aside-line {
            border-top: 1px solid rgba(151, 151, 151, 0.21);
            display: block;
            width: 194px;
            height: 1px;
            text-align: center;
            margin: auto;
        }

        /deep/ .el-menu-item.is-active {
            background: #577FFE;
            box-shadow: 0 2px 2px 1px rgba(85, 85, 85, 0.12);
            border-radius: 2px;
            color: #ffffff;
        }
    }
</style>
