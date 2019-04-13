import { IndexArr } from '@/api/article.js'
// var Contts
var People = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165, 100, 120, 161, 134, 105],
    actualData: [120, 82, 91, 154, 162, 140, 145, 100, 120, 161, 134, 105]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140, 100, 120, 161, 134, 105],
    actualData: [180, 160, 151, 106, 145, 150, 130, 100, 120, 161, 134, 105]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100, 100, 120, 161, 134, 105],
    actualData: [120, 90, 100, 138, 142, 130, 130, 100, 120, 161, 134, 105]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160, 100, 120, 161, 134, 105],
    actualData: [120, 82, 91, 154, 162, 140, 130, 130, 140, 141, 142, 145]
  },
}

var Contts
  = [
    {
      value: [5000, 7000, 12000, 11000, 15000, 14000],
      name: '技术进展'
    },
    {
      value: [4000, 9000, 15000, 15000, 13000, 11000],
      name: '销售进展'
    },
    {
      value: [5500, 11000, 12000, 15000, 12000, 12000],
      name: '销售情况'
    }
  ]

var PieData = [
  { value: 320, name: '行业' },
  { value: 240, name: '技术' },
  { value: 149, name: '外汇' },
  { value: 100, name: '黄金' },
  { value: 59, name: '预测' }
]
const animationDuration = 6000

var BarChartData =
  [{
    name: 'pageA',
    type: 'bar',
    stack: 'vistors',
    barWidth: '60%',
    data: [79, 52, 200, 334, 390, 330, 220],
    animationDuration
  }, {
    name: 'pageB',
    type: 'bar',
    stack: 'vistors',
    barWidth: '60%',
    data: [80, 52, 200, 334, 390, 330, 220],
    animationDuration
  }, {
    name: 'pageC',
    type: 'bar',
    stack: 'vistors',
    barWidth: '60%',
    data: [30, 52, 200, 334, 390, 330, 220],
    animationDuration
  }]


var defalutList = [
  { text: 'star this repository', done: false },
  { text: 'fork this repository', done: false },
  { text: 'follow author', done: false },
  { text: 'vue-element-admin', done: true },
  { text: 'vue', done: true },
  { text: 'element-ui', done: true },
  { text: 'axios', done: true },
  { text: 'webpack', done: true }
]

export default { People, Contts, PieData, BarChartData, defalutList }