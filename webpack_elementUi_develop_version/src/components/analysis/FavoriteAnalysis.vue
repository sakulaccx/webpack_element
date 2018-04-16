<style>
.el-table th>.cell{
    text-align: center;
}
.el-table .cell{
    padding: 10px 0;
    text-align: center;
}
.image{
    width: 60px;
    height: 60px;
}
.el-progress-bar__innerText{
    font-size: 16px;
}
</style>
<template>
    <div>
        <el-row>
            <!--<el-col :span="8">
                <el-input v-model="searchString" icon="search" placeholder="输入权益名称搜索"
                          :on-icon-click="fetch"></el-input>
            </el-col>-->
            <!--<el-col :span="8" :offset="8" style="text-align: right">-->
                <!--<el-button type="primary" icon="plus" @click="initForm(); dialogVisible = true">添加礼券</el-button>-->
            <!--</el-col>-->
        </el-row>
        <el-table :data="tableData" v-loading="tableLoading" style="margin-top: 20px">
            <el-table-column prop="id" label="序号" width=100>
            </el-table-column>
            <el-table-column prop="title" label="标题" width=300></el-table-column>
            <el-table-column prop="subtitle" label="副标题" width=300></el-table-column>
            <el-table-column label="点击量">
                <template slot-scope="scope">
                    <span>{{scope.row.number}}</span>
                </template>
            </el-table-column>
            <el-table-column label="占比" width=350>
                <template slot-scope="scope">
                    <el-progress :percentage="scope.row.proportion" :text-inside="true" :stroke-width="24" :show-text='true'></el-progress>
                </template>
            </el-table-column>
            <el-table-column prop="" label="图片" width=300>
                <template slot-scope="scope">
                    <img :src="scope.row.url" class="image">
                </template>
            </el-table-column>
        </el-table>
        <!--<el-row v-if="pageTotal > pageSize">
            <el-row :span="16" :offset="8" style="text-align: right; margin-top: 15px">
                <el-pagination @size-change="handleSizeChange"
                               @current-change="handlePageChange"
                               style="padding: 0" :page-sizes="[10, 20, 30]"
                               :page-size="pageSize" layout="sizes, prev, pager, next"
                               :total="pageTotal"></el-pagination>
            </el-row>
        </el-row>-->
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
            }
        },
        methods: {
            fetch() {
                var _that = this;
                _that.tableLoading = true;

                axios({
                    method: 'post',
                    url: '/cms/wishList/countByCategory',
                    data: _that.$querystring.stringify({
                        nextPage: _that.pageNumber,
                        pageSize: _that.pageSize,
                        jsonFilter: "{search_LIKE_title:\""+_that.searchString+"\"}"
                    })
                })
                .then(function(res){
                }, res => {
                    _that.tableData = res.data.object;
                    _that.$layer_message(res.data.message,'success',2000);
                    _that.tableLoading = false;
                })
                .catch(function(error){});
            },
        },
        created() {
            this.fetch()
        }
    }
</script>