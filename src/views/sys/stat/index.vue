<template>
  <div>
    <div id="ioStat" style="width: 1000px;height: 400px;" />
  </div>
</template>

<script>

import echarts from 'echarts'
import { getDailyPl } from '@/api/income'

export default {
  name: '',
  data() {
    return {
      charts: '',
      score: '100',
      dimensions: ['bizDate', 'income', 'expense'],
      source: []
    }
  },

  watch: {
    // 监听chartData数据
    chartData: {
      handler: function() {
        this.initChart()
      },
      deep: true
    },
    // 监听isCollapse 因为头部水平扩展是一个动画需要时间，所以这里延迟300毫秒
    isCollapse() {
      setTimeout(() => {
        this.resizeChart()
      }, 300)
    }
  },

  mounted() {
    this.$nextTick(function() {
      this.getStatData({})
    })
  },

  methods: {
    draw(id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        title: {
          text: '按日统计收支',
          subtext: '数据实时'
        },
        legend: { },
        tooltip: {},
        dataset: {
        // 连接数据
          source: this.source
        },
        xAxis: { type: 'category' },

        yAxis: {
        // 这个地方如果需要在Y轴定义最大值就放开,如果需要根据数据自适应的话,就注释掉
        // max: this.score,
          // maxInterval: this.score * 0.2,
          // minInterval: 1,
          // splitNumber: 4
        },
        grid: { bottom: 30 },
        series: [
          { type: 'bar',
            barCategoryGap: '40%',
            itemStyle: { color: '#42B983' }
          },
          { type: 'bar',
            barCategoryGap: '40%',
            itemStyle: { color: '#CC0033' }},
          { type: 'bar',
            barCategoryGap: '40%',
            itemStyle: { color: '#003399' }}
        ]
      })
    },
    getStatData(params) {
      var that = this
      getDailyPl(params).then(response => {
        that.source = response.data
        that.draw('ioStat')
      })
    }
  }
}

</script>
