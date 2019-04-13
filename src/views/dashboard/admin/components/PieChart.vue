<template>
  <div :class="className"
       :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { getIndexpiedata } from '@/api/article.js'
import Data from '../../data.js'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data () {
    return {
      chart: null,
      DataList: {}
    }
  },
  mounted () {
    getIndexpiedata().then(res => {
      this.DataList = res.data
      console.log(this.DataList)
      this.$nextTick(() => {
        this.initChart(),
          this.__resizeHandler = debounce(() => {
            if (this.chart) {
              this.chart.resize()
            }
          })
      })
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
        },
        calculable: true,
        series: [
          {
            name: '数据',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.DataList,
            // [
            //   { value: 320, name: '行业' },
            //   { value: 240, name: '技术' },
            //   { value: 149, name: '外汇' },
            //   { value: 100, name: '黄金' },
            //   { value: 59, name: '预测' }
            // ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
