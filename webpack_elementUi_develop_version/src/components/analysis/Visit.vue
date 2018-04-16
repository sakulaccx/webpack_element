<template>
  <div id="chartapp">
    <el-select v-model="typeValue" placeholder="请选择" @change="changeType">
      <el-option
        v-for="item in types"
        :key="item.value"
        :label="item.label"
        :value="item.value" >
      </el-option>
    </el-select>
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
            beginDate: Date.today().addDays(-1).toString("yyyyMMdd"),
            endDate: Date.today().addDays(-1).toString("yyyyMMdd"),
            options: [{
              value: 'day',
              label: '日'
            }, {
              value: 'week',
              label: '周'
            }, {
              value: 'month',
              label: '月'
            }],
            dateValue: "week",
            visit_pv: [],
            visit_uv: [],
            stay_time_uv: [],
            dateCtr: [],
            types: [
              {
                value: 'pv',
                label: '访问次数'
              }, {
                value: 'uv',
                label: '访问人数'
              }, {
                value: 'stay',
                label: '人均停留时长'
              }
            ],
            typeValue: 'pv',
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
                  url: '/user/visitTrend/getVisitTrend?beginDate='+_that.beginDate+'&endDate='+_that.endDate
              }).then(function(res){}, res => {

                  if(res.data.object.length > 0){
                    _that.visit_pv = [];
                    _that.visit_uv = [];
                    _that.stay_time_uv = [];
                    _that.dateCtr = [];
                    res.data.object.forEach(function(item,i){
                      var date_str = _that.cutDate(item.refDate);
                      _that.dateCtr.push(date_str);
                      _that.visit_pv.push({
                        name: date_str,
                        y: item.visitPv
                      });
                      _that.visit_uv.push({
                        name: date_str,
                        y: item.visitUv
                      });
                      _that.stay_time_uv.push({
                        name: date_str,
                        y: item.stayTimeUv
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
            var name = "";
            var sedata = [];
            var unit = "";
            if(_that.typeValue == "pv"){
              name = "访问次数";
              sedata = _that.visit_pv;
              unit = "次";
            } else if(_that.typeValue == "uv"){
              name = "访问人数";
              sedata = _that.visit_uv;
              unit = "人";
            } else {
              name = "人均停留时长";
              sedata = _that.stay_time_uv;
              unit = "秒";
            }

            if(_that.chartObj){
              _that.chartObj.series[0].remove(false);
              _that.chartObj.addSeries({
                name: name,
                data: sedata
              });
              _that.chartObj.xAxis[0].setCategories(_that.dateCtr);
              _that.chartObj.redraw();
              _that.chartObj.update({
                tooltip: {
                  headerFormat: '',
                  pointFormat: '{series.name}: <b>{point.y}'+unit+'</b>'
                },
                yAxis: {
                  title: {
                    enabled: false
                  },
                  labels: {
                    format: "{value}"+unit
                  }
                }
              });
            } else {
              _that.option = {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'line'
                },
                title: {
                    text: ''
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '{series.name}: <b>{point.y}次</b>'
                },
                series: [{
                    name: name,
                    data: sedata
                }],
                credits: {
                    enabled:false
                },
                xAxis: {
                  categories: _that.dateCtr
                },
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