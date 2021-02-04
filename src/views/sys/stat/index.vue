<template>
  <div>

    <el-row class="d2-mb">
      <el-form :inline="true">
        <el-form-item label="店铺名称">
          <el-select
            v-model="queryParams.storeId"
            clearable
            style="width:100%;"
            filterable
            allow-create
            default-first-option
            placeholder="选择店铺"
          >
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.storeName"
              :value="item.id"
            />
          </el-select>

        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="queryParams.bizDateStart" type="date" value-format="yyyy-MM-dd" placeholder="选择开始日期" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="queryParams.bizDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="选择结束日期" size="medium" />
        </el-form-item>
        <el-form-item>
          <el-button @click="queryStat">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table
      :data="plList"
      style="width: 100%"
    >
      <el-table-column
        prop="income"
        label="收入"
      />
      <el-table-column
        prop="expense"
        label="支出"
      />
      <el-table-column
        prop="pl"
        label="利润"
      />
    </el-table>

    <div />

    <div id="ioStat" style="width: 1000px;height: 400px;" />
  </div>
</template>

<script>

import echarts from 'echarts'

import { getDailyPl, getPlByBizDate } from '@/api/income'
import { findStoreList } from '@/api/store'

export default {
  name: '',
  data() {
    return {
      queryParams: {
        'storeId': null,
        'bizDateStart': null,
        'bizDateEnd': null
      },

      plList: [],
      storeList: [],

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
    this.getPlList(this.queryParams)
    this.getStores()
  },

  created() {
    this.setTime()
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

    queryStat() {
      var that = this
      this.getPlList(that.queryParams)
      this.getStatData(that.queryParams)
    },
    // 默认时间设置 7天后
    setTime() {
      const nowD = new Date()
      nowD.setTime(nowD.getTime() - (7 * 3600 * 1000 * 24))
      this.queryParams.bizDateStart = nowD
      console.log(this.queryParams)
    },

    getStatData(params) {
      var that = this
      getDailyPl(params).then(response => {
        that.source = response.data
        that.draw('ioStat')
      })
    },
    getPlList(params) {
      var that = this
      getPlByBizDate(params).then(response => {
        that.plList = response.data
      })
    },
    getStores: function(event) {
      var that = this
      findStoreList({}).then(response => {
        that.storeList = response.data
      })
    }
  }
}

</script>
