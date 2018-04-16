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
.total-wrap{
    height: 80px;
    line-height: 80px;
}
.total-txt{
    text-align: center;
}
.total-num{
    text-align: center;
}
</style>
<template>
    <div>
        <!-- <el-row>
            <el-col :span="8">
                <el-input v-model="searchString" icon="search" placeholder="输入权益名称搜索"
                          :on-icon-click="fetch"></el-input>
            </el-col>
            <el-col :span="8" :offset="8" style="text-align: right">
                <el-button type="primary" icon="plus" @click="initForm(); dialogVisible = true">添加礼券</el-button>
            </el-col>
        </el-row> -->
        <el-table :data="tableData" v-loading="tableLoading" style="margin-top: 20px">
            <el-table-column prop="id" label="序号" ></el-table-column>
            <el-table-column prop="pageName" label="关联页面" ></el-table-column>
            <el-table-column prop="buttonName" label="按钮" ></el-table-column>
            <el-table-column label="点击量">
                <template slot-scope="scope">
                    <span>{{scope.row.number}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class='total-wrap'>
            <el-row :gutter="0">
                <el-col :span="6">&nbsp;</el-col>
                <el-col :span="6" class='total-space'>&nbsp;</el-col>
                <el-col :span="6">&nbsp;</el-col>
                <el-col :span="2" class="total-txt">总计:</el-col>
                <el-col :span="2" class='total-num'>{{total}}</el-col>
            </el-row>
        </div>
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
                total: 0,
                pageZhCn: [
                    "首页",
                    "一张机票玩",
                    "经典旅行攻略",
                    "美食",
                    "安全",
                    "奥克兰",
                    "基督城",
                    "皇后镇",
                    "惠灵顿",
                    "内皮尔",
                    "霍比屯",
                    "太平洋岛屿",
                ]
            }
        },
        methods: {
            fetch() {
                var _that = this;
                _that.tableLoading = true;

                axios({
                    method: 'post',
                    url: '/cms/buttonClick/countByType',//api/webstart/clickRate/countByCategory
                    // data: _that.$querystring.stringify({
                    //     jsonFilter: "{}"
                    // })
                })
                .then(function(res){}, 
                res => {
                    var tmpData = [];
                    res.data.object.forEach(function(item,i){
                        _that.total += item.number;
                        tmpData.push({
                            id: (i+1),
                            buttonName: item.buttonName,
                            number: item.number,
                            pageName: _that.pageZhCn[item.type]
                        });
                    });

                    _that.tableData = tmpData;
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