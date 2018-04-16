<template>
  <div id="chartapp">
    <!-- <x-chart :id="id" :option="option"></x-chart> -->
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
    import HighCharts from 'highcharts/highcharts'
    import HighchartsDrilldown from 'highcharts/modules/drilldown'
    import _ from 'lodash'

    

    export default {
        name: 'chartapp',
        data() {
            let option = options.bar
            return {
              id: 'chart',
              option: option,
              chartLoading: true
            }
        },
        components: {
            XChart
        },
        methods: {
            getChartData (){
                axios({
                    method: 'post',
                    url: '/cms/member/countByRegion',
                }).then(function(res){}, res => {
                    var arr_data = res.data.object;
                    var _country = [];
                    var _drilldown = {
                        series: []
                    };

                    if(arr_data.length > 0){
                        _.each(arr_data,function(v,i){
                            var level1_name = (v.name == null ? ("未知"+i) : v.name);
                            var level1 = {
                                name: level1_name,
                                y: v.value,
                            }

                            //drilldown level 2
                            if(v.memberVoList.length > 0){

                                level1.drilldown = level1_name;

                                var level2 = {
                                    name: level1_name,
                                    id: level1_name,
                                    data: []
                                };

                                _.each(v.memberVoList, function(v1,i1){
                                    var level2_name = (v1.name == null ? ("未知"+i1) : v1.name);
                                    var level2_data = {
                                        name: level2_name,
                                        y: v1.value
                                    };

                                    if(v1.memberVoList.length > 0){
                                        level2_data.drilldown = level2_name;
                                        
                                        var level3 = {
                                            name: (v1.name == null ? "" : v1.name),
                                            id: (v1.name == null ? "" : v1.name),
                                            data: []
                                        };

                                        _.each(v1.memberVoList, function(v2,i2){
                                            var level3_data = {
                                                name: v2.name,
                                                y: v2.value
                                            };

                                            level3.data.push(level3_data);
                                        });

                                        _drilldown.series.push(level3);
                                    }

                                    level2.data.push(level2_data);
                                });

                                _drilldown.series.push(level2);
                            }
                            _country.push(level1);
                        });
                    }

                    this.option = {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'column'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        yAxis: {
                            title: {
                                text: ""
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        title: {
                            text: '地区分布'
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
                        },
                        plotOptions: {
                            series: {
                                borderWidth: 0,
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y}'
                                }
                            }
                        },
                        series: [{
                            name: 'Country',
                            colorByPoint: true,
                            data: _country
                        }],
                        drilldown: _drilldown,
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
                this.getChartData() 
            });

            if (!HighCharts.Chart.prototype.addSeriesAsDrilldown) {
                HighchartsDrilldown(HighCharts);
            }
        },
        created() {}
    }
</script>

<style>
#chart{
    margin: 100px auto 0 auto;
}
</style>