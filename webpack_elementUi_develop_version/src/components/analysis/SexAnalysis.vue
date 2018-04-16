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
              beginDate: Date.today().addDays(-1).toString("yyyy-MM-dd"),
              endDate: Date.today().addDays(-1).toString("yyyy-MM-dd"),
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
            }
        },
        components: {
            XChart
        },
        methods: {
            changeDateRange (){
              //Date.today().is().sunday()
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
              this.beginDate = Date.today().addDays(-1).toString("yyyy-MM-dd");
              this.endDate = Date.today().addDays(-1).toString("yyyy-MM-dd");
            },
            getDaysRangeByWeek(){
              this.beginDate = Date.today().addDays(-7).toString("yyyy-MM-dd");
              this.endDate = Date.today().addDays(-1).toString("yyyy-MM-dd");
            },
            getDaysRangeByMonth(){
              this.beginDate = Date.today().addDays(-30).toString("yyyy-MM-dd");
              this.endDate = Date.today().addDays(-1).toString("yyyy-MM-dd");
            },
            getChartData (){
                var sex_zh_cn = ["","男","女"];
                var color_arr = ["","#2f32a3","#f385cb"];
                var __url = "/user/datacube/getAnalysisData?postUrl="+"https://api.weixin.qq.com/datacube/getweanalysisappiduserportrait"+"&beginDate="+this.beginDate+"&endDate="+this.endDate
                axios({
                    method: 'post',
                    url: __url,
                }).then(function(res){}, res => {
                    var sedata = [];
                    res.data.object.visit_uv.genders.forEach(function(item){
                        sedata.push({
                            name: item.name,
                            y: item.value,
                            color: color_arr[item.id]
                        });
                    });
                    this.option = {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: '性别占比'
                        },
                        tooltip: {
                            headerFormat: '{series.name}<br>',
                            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: 'black'
                                    }
                                }
                            }
                        },
                        series: [{
                            type: 'pie',
                            name: '性别占比',
                            data: sedata
                        }],
                        credits: {
                            enabled:false
                        },
                    }

                    HighCharts.chart(this.id,this.option);
                    this.chartLoading = false;

                })
                .catch(function(error){});
            }
        },
        mounted() {
            this.$nextTick(function () {
              this.getDaysRangeByWeek();
              this.getChartData() 
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