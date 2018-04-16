<style>
    .cell{
        padding: 10px 0;
        text-align: center;
    }
    .image{
        display: block;
        margin: 0 auto;
        width:60px;
        height: 60px;
    }
    .cell .showFavorite{
        color: #2c63ad;
        cursor: pointer;
    }
    .nickname{
        margin: 10px 0;
        font-size: 16px;
    }
</style>

<template>
    <div>
        <el-row>
            <el-col :span="4">
                <el-input v-model="searchString" icon="search" placeholder="输入会员昵称搜索"
                          :on-icon-click="fetch">
                    <el-button slot="append" icon="el-icon-search" @click="fetch"></el-button>
                </el-input>

            </el-col>
        </el-row>
        <el-table :data="tableData" v-loading="tableLoading" style="margin-top: 20px">
            <el-table-column prop="registrationDate" label="最近访问" width=200></el-table-column>
            <el-table-column prop="openId" label="用户openId"></el-table-column>
            <el-table-column prop="avatarUrl" label="用户头像" width=120>
                <template slot-scope="scope">
                    <img :src="scope.row.avatarUrl" class="image">
                </template>
            </el-table-column>
            <el-table-column prop="nickName" label="用户昵称" width=180></el-table-column>
            <el-table-column label="性别" width=140>
                <template slot-scope="scope">
                    <span v-if="scope.row.gender==1">男</span>
                    <span v-else-if="scope.row.gender==2">女</span>
                    <span v-else>保密</span>
                </template>
            </el-table-column>
            <el-table-column prop="province" label="城市" width=140></el-table-column>
            <el-table-column prop="country" label="国家"></el-table-column>
            <el-table-column label="心愿清单" width=200>
                <template slot-scope="scope">
                    <span :data-openid="scope.row.openId" :data-name="scope.row.nickName" class="showFavorite" @click="dialogFavorite">查看心愿清单</span>
                </template>
            </el-table-column>
        </el-table>
        <el-row :span="16" :offset="8" style="text-align: right; margin-top: 15px">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handlePageChange"
                           style="padding: 0" :page-sizes="[10, 20, 30]"
                           :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="pageTotal"></el-pagination>
        </el-row>
        
        <!-- favorite list -->
        <el-dialog :visible.sync="showFavoriteList" class="banner-opt">
            <h6 class='nickname'>{{tempNick}}的心愿清单</h6>
            <el-table :data="favoriteData" style="margin-top: 20px">
                <el-table-column prop="category.url" label="图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.category.url" class="image">
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="添加时间"></el-table-column>
                <el-table-column prop="category.title" label="标题"></el-table-column>
                <el-table-column prop="category.subtitle" label="副标题"></el-table-column>
            </el-table>
            <!-- <template v-for="(item index) in favoriteList ">
                <div></div>
            </template> -->
        </el-dialog>
    </div>
</template>

<script>
    import config from '../../config/config'
    import axios from 'axios'
    export default {
        data() {
            return {
                tableLoading: false,
                dialogVisible: false,
                btnSaveLoading: false,
                bindOptions: {0:"未绑定",1:"已绑定"},
                isBind:'',
                btnDelLoading: {},
                tableData: [],
                dialogTitle: '',
                searchString: '',
                form: {},
                pageNumber: 0,
                pageSize: 10,
                pageTotal: 0,
                showFavoriteList: false,
                favoriteData: [],
                tempNick: ""
            }
        },
        computed: {
            query() {
                let tmp = {page: this.pageNumber, size: this.pageSize};
                if (this.searchString) tmp['search'] = this.searchString;
                if (this.isBind) tmp['is_bind'] = this.isBind;
                return tmp
            }
        },
        methods: {
            fetch() {
                var _that = this;
                this.tableLoading = true;
                axios({
                    method: 'post',
                    url: '/cms/member/findMemberEQStatusAndPage',
                    data: _that.$querystring.stringify({
                        nextPage: _that.pageNumber,
                        pageSize: _that.pageSize,
                        jsonFilter: "{search_LIKE_nickName:\""+_that.searchString+"\"}"
                    })
                })
                .then(function(res){
                }, res => {
                    _that.tableData = res.data.object.content;
                    this.pageTotal = res.data.object.totalElements;
                    _that.$layer_message(res.data.message,'success',2000);
                    _that.tableLoading = false;
                })
                .catch(function(error){});
            },
            handlePageChange(page) {
                this.pageNumber = page - 1;
                this.fetch()
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.fetch()
            },
            dialogFavorite(e){
                //console.log(e)
                // var loading = this.$loading({
                //     lock: true,
                //     text: "加载中",
                //     spinner: 'el-icon-loading',
                //     background: 'rgba(0, 0, 0, 0.7)'
                // });
                axios({
                    method: 'post',
                    url: '/cms/wishList/findWishListByOpenId',
                    data: this.$querystring.stringify({
                        openId: e.target.dataset.openid
                    })
                })
                .then(function(res){
                }, res => {

                    if(res.data.code == 1){
                        this.favoriteData = res.data.object;
                        this.tempNick = e.target.dataset.name;
                        this.showFavoriteList = true;
                    } else {
                        this.$alert("该客户暂未添加心愿清单");
                    }

                    //loading.close();
                    
                    
                })
                .catch(function(error){});
            }
        },
        created() {
            this.fetch()
            //console.log(this.bindOptions)
        }
    }
</script>