<style scoped>
    @import '../assets/styles/common.css';
</style>
<template>
    <div class="layout-wrapper">
        <div class="layout-side" :class="{'layout-side-extend': !isCollapse}">
            <div class="layout-logo"></div>
            <el-menu :collapse="isCollapse" unique-opened router>
                <el-submenu :index="item.key" v-for="item in menus" :key="item.key">
                    <template slot="title">
                        <i :class="item.icon" :style="{fontSize: item.size}"></i>
                        <span slot="title">{{ item.desc }}</span>
                    </template>
                    <el-menu-item :index="sub.key" v-for="sub in item.subs" :key="sub.key">{{ sub.desc }}</el-menu-item>
                </el-submenu>
            </el-menu>
        </div>
        <div class="layout-main">
            <div class="layout-header">
                <div class="i-button">
                    <i class="fa fa-sign-out" @click="logout"></i>
                </div>
                <div class="i-button">
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="fa fa-user"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>昵称：{{nickname}}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div style="flex-grow: 1"></div>
                <div class="i-button">
                    <i class="fa fa-bars" @click="isCollapse = !isCollapse"></i>
                </div>
            </div>
            <div class="layout-body">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    require('../plugins/date-core.js')
    require('../plugins/date-zh-CN.js')
    export default {
        data() {
            return {
                nickname: sessionStorage.getItem('nickname'),
                isCollapse: false,
                menus: [
                    {
                       key: '1', desc: '页面管理', icon: 'fa fa-home', size: '18px', subs: [
                           {key: '/pages/home', desc: '首页管理'},
                           {key: '/pages/price', desc: '特价管理'},
                       ]
                    }, 
                    {
                        key: '2', desc: '会员管理', icon: 'fa fa-id-card', size: '14px', subs: [
                            {key: '/member/info', desc: '会员信息管理'},
                        ]
                    },
                    {
                        key: '3', desc: '数据统计', icon: 'fa fa-area-chart', size: '14px', subs: [
                            //{key: '/analysis/favoritelist', desc: '心愿清单'},
                            {key: '/analysis/favoriteanalysis', desc: '心愿清单分析'},
                            {key: '/analysis/clickRate', desc: '点击量分析'},
                            {key: '/analysis/clickcta', desc: 'CTA click'},
                            {key: '/analysis/visit', desc: '访问分析'},
                            {key: '/analysis/comein', desc: '来源分析'},
                            {key: '/analysis/device', desc: '设备分布'},
                            {key: '/analysis/gender', desc: '性别分布'},
                            {key: '/analysis/region', desc: '地区分布'}
                        ]
                    },
                    {
                        key: '4', desc: '账户管理', icon: 'fa fa-user', size: '18px', subs: [
                            {key: '/account/password', desc: '密码重置'}
                        ]
                    }
                ]
            }
        },
        methods: {
            logout() {
                this.$http.get('/api/webstart/user/logout/').finally(() => {
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('userId');
                    this.$router.push({name: 'login'})
                })
            }
        },
        created() {

            let token = sessionStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = "Bearer "+token;
            if (!token || token.length < 10) {
                this.$router.push({name: 'login'})
            }

            //记录accesstoken
            // axios({
            //     method: 'post',
            //     url: '/user/datacube/findAccessToken'
            // })
            // .then(function(res){}, res => {
            //     sessionStorage.setItem("accessToken",res.data.object.accessToken);
            // })
            // .catch(function(error){});

            // if (sessionStorage.getItem("is_supper") === "true") {
            //     this.menus[1].subs.push({key: '/member/bind', desc: '绑定管理'});
            //     this.menus[1].subs.push({key: '/member/applycard', desc: '我要办卡管理'});
            //     this.menus[2].subs.push({key: '/account/manage', desc: '用户管理'})
            // }
        }
    }
</script>