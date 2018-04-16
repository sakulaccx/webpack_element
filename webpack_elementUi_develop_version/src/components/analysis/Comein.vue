<template>
  <div id="chartapp">
    <el-select v-model="dateValue" placeholder="请选择" @change="changeDateRange">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value" >
      </el-option>
    </el-select>
    <div :id="id" :loading="chartLoading"></div>
  </div>
</template>
<script>
    import config from '../../config/config'
    import axios from 'axios'
    // 导入chart组件
    import XChart from '../chart/chart.vue'
    // 导入chart组件模拟数据
    import options from '../chart/option'
    import HighCharts from 'highcharts'
    export default {
        name: 'chartapp',
        data() {
          let option = options.bar
          return {
            id: 'chart',
            option: option,
            chartLoading: true,
            beginDate: Date.today().addDays(-6).toString("yyyyMMdd"),
            endDate: Date.today().addDays(-1).toString("yyyyMMdd"),
            options: [{
              value: 'day',
              label: '日'
            },{
              value: 'week',
              label: '周'
            }, {
              value: 'month',
              label: '月'
            }],
            dateValue: "week",
            keys: [
              "",
              "小程序历史列表",
              "搜索",
              "会话",
              "二维码",
              "公众号主页",
              "聊天顶部",
              "系统桌面",
              "小程序主页",
              "附近的小程序",
              "其他",
              "模板消息",
              "客服消息",
              "公众号菜单",
              "APP分享",
              "支付完成页",
              "长按识别二维码",
              "相册选取二维码",
              "公众号文章",
              "钱包",
              "卡包",
              "小程序内卡券",
              "其他小程序",
              "其他小程序返回",
              "卡券适用门店列表",
              "搜索框快捷入口",
              "小程序客服消息",
              "公众号下发",
              "会话左下角菜单",
              "小程序任务栏",
              "长按小程序菜单圆点",
              "连wifi成功页",
              "城市服务",
            ],
            chartCtr: [],
            chartData: [],
            chartObj: null,
          }
        },
        components: {
          XChart
        },
        methods: {
          changeDateRange (){
            if(this.dateValue == "day"){
              this.getDaysRangeByDay();
            } else if(this.dateValue == "week") {
              this.getDaysRangeByWeek();
            } else {
              this.getDaysRangeByMonth();
            }

            this.getChartData();
          },
          getDaysRangeByDay(){
            this.beginDate = Date.today().addDays(-1).toString("yyyyMMdd");
            this.endDate = Date.today().addDays(-1).toString("yyyyMMdd");
          },
          getDaysRangeByWeek(){
            this.beginDate = Date.today().addDays(-6).toString("yyyyMMdd");
            this.endDate = Date.today().addDays(-1).toString("yyyyMMdd");
          },
          getDaysRangeByMonth(){
            this.beginDate = Date.today().addDays(-30).toString("yyyyMMdd");
            this.endDate = Date.today().addDays(-1).toString("yyyyMMdd");
          },
          getChartData (){
              var _that = this;
              axios({
                  method: 'post',
                  url: '/user/visitDistribution/getVisitDistribution?beginDate='+_that.beginDate+'&endDate='+_that.endDate+"&type=access_source_session_cnt"
              }).then(function(res){}, res => {

                  if(res.data.object.length > 0){
                    _that.chartCtr = [];
                    _that.chartData = [];
                    res.data.object.forEach(function(item,i){
                      _that.chartCtr.push(_that.keys[item.key]);
                      _that.chartData.push({
                        name: _that.keys[item.key],
                        y: item.value
                      });
                    });

                    _that.renderChart();
                  }
              })
              .catch(function(error){});
          },
          changeType(){
            this.renderChart();
          },
          cutDate (str){
            return str.substring(0,4)+"-"+str.substring(4,6)+"-"+str.substring(6,str.length);
          },
          renderChart(){
            var _that = this;

            if(_that.chartObj){
              _that.chartObj.series[0].remove(false);
              _that.chartObj.addSeries({
                name: "来源分析",
                data: _that.chartData
              });
              _that.chartObj.xAxis[0].setCategories(_that.chartCtr)
              _that.chartObj.redraw();
            } else {
              _that.option = {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'column'
                },
                title: {
                    text: ''
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '{point.name}: <b>{point.y}次</b>'
                },
                series: [{
                    name: "来源分析",
                    data: _that.chartData
                }],
                credits: {
                    enabled:false
                },
                xAxis: [{
                  categories: _that.chartCtr
                }],
                yAxis: {
                  title: {
                    enabled: false
                  },
                  labels: {
                    format: "{value}次"
                  }
                },
                legend: {
                  enabled: false
                }
              }

              _that.chartObj = new HighCharts.Chart(_that.id,_that.option);
            }
            _that.chartLoading = false;
          }
        },
        mounted() {
          this.$nextTick(function () {
            this.getDaysRangeByWeek();
            this.getChartData();
          })
        },
        created() {}
    }
</script>

<style>
#chart{
    margin: 100px auto 0 auto;
}
</style>