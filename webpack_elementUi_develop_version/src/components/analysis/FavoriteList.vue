<style>
.el-table th.is-leaf{
    text-align: center;
}
.el-table .cell{
    padding: 10px 0;
    text-align: center;
}
.image{
    margin: 0 auto;
    width: 60px;
    height: 60px;
}
</style>
<template>
    <div>
        <!-- <el-row>
            <el-col :span="4">
                <el-input v-model="searchString" icon="search" placeholder="输入标题搜索"
                          :on-icon-click="fetch"></el-input>
            </el-col>
        </el-row> -->
        <el-table :data="tableData" v-loading="tableLoading" style="margin-top: 20px; width: 100%;">
            <el-table-column prop="categoryId" label="序号" width=100></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width=300></el-table-column>
            <!-- <el-table-column prop="openId" label="openId" width=300></el-table-column> -->
            <el-table-column prop="nickName" label="用户昵称" width=170></el-table-column>
            <el-table-column prop="avatarUrl" label="用户头像" width=110>
                <template slot-scope="scope">
                    <img v-if="scope.row.avatarUrl" :src="scope.row.avatarUrl" class="image">
                </template>
            </el-table-column>
            
            <el-table-column prop="category.title" label="标题" width=300></el-table-column>
            <el-table-column prop="category.subtitle" label="子标题" width=300></el-table-column>
            <el-table-column prop="category.url" label="图片">
                <template slot-scope="scope">
                    <img :src="scope.row.category.url" class="image">
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
                btnDelLoading: {},
                tableData: [],
                dialogTitle: '',
                searchString: '',
                form: {},
                pageNumber: 0,
                pageSize: 10,
                pageTotal: 0,
            }
        },
        methods: {
            fetch() {
                var _that = this;
                this.tableLoading = true;

                axios({
                    method: 'post',
                    url: '/api/webstart/wishList/findWishListEQStatusAndPage',
                    data: _that.$querystring.stringify({
                        nextPage: _that.pageNumber,
                        pageSize: _that.pageSize,
                        jsonFilter: "{search_LIKE_title:\""+_that.searchString+"\"}"
                    })
                })
                .then(function(res){
                }, res => {
                    _that.tableData = res.data.object.content;
                    _that.pageTotal = res.data.object.totalElements;
                    _that.$layer_message(res.data.message,'success',2000);
                    _that.tableLoading = false;
                })
                .catch(function(error){});
            },
            searchBind() {
                this.tableLoading = true;
                this.$http.get('/api/members/info/', {params: this.query}).then(res => {
                    this.tableData = res.data.object.content;
                    this.pageTotal = res.data.object.totalElements;
                }, res => this.$layer_message(res.result)).finally(() => this.tableLoading = false)
            },
            handlePageChange(page) {
                this.pageNumber = page - 1;
                this.fetch()
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.fetch()
            }
        },
        created() {
            this.fetch()
        }
    }
</script>