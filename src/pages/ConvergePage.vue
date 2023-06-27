<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted, watch } from 'vue'

type EChartsOption = echarts.EChartsOption
let base = +new Date(2023, 6, 27, 0, 0)
// const oneDay = 24 * 3600 * 1000
// const oneHour = 3600 * 1000
const oneMinute = 60 * 1000
const data = [[base, Math.random() * 300]]
// const date = ref(new Date())

for (let i = 1; i < 24 * 60; i++) {
  const now = new Date((base += oneMinute))
  data.push([+now, Math.round(Math.random() * 200)])
}

const option: EChartsOption = {
  tooltip: {
    trigger: 'axis',
    position: function (pt) {
      return [pt[0], '10%']
    }
  },
  title: {
    left: 'center',
    text: '汇聚折线图'
  },
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'time',
    boundaryGap: false
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%']
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 20
    },
    {
      start: 0,
      end: 20
    }
  ],
  series: [
    {
      name: 'Fake Data',
      type: 'line',
      smooth: true,
      symbol: 'none',
      areaStyle: {},
      data
    }
  ]
}

onMounted(async () => {
  const chartDom = document.getElementById('main')!
  const myChart = echarts.init(chartDom)
  await myChart.setOption(option)
  option && myChart.setOption(option)
  myChart.resize({
    width: 1200,
    height: 500
  })
  // watch(date, (newVal) => {
  //   myChart.setOption({
  //     xAxis: {
  //       data: [newVal.toISOString().slice(0, 10)] // 更新横坐标数据为选定的日期
  //     }
  //   })
  // })
})
</script>

<template>
  <div class="chart-container">
    <div id="main" class="chart"></div>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 1200px;
  margin: 50px;
  padding: 0px;
}

.chart {
  height: 600px;
}
</style>
