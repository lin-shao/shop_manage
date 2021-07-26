<template>
    <div>
         <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="main" style="width: 900px;height:500px;"></div>
    </div>
</template>

<script>
//导入echarts图表5.0版本
import * as echarts from 'echarts';
import _ from "lodash"
export default {
    name:"Report",
    data(){
        return {
            option:{
            title: {
                text: '用户来源'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        }
        }
    },
    created(){},
    async mounted(){
        var myChart = echarts.init(document.getElementById('main'));
        const {data:res} = await this.$http.get('reports/type/1')
        if(res.meta.status !== 200){
            return this.$message.error("获取折线图数据失败！")
        }
        //合并两项数据
        const result = _.merge(res.data,this.option)
         myChart.setOption(result);
    }
}

</script>

<style scoped>
    
</style>