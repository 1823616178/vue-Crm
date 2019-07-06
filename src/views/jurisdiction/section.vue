<template>
  <div>

    <ve-tree :data="chartData"
             :settings="chartSettings"
             :extend='extend'
             :tooltip-formatter="tooltipFormatter"
             :events="chartEvents"
    />
    <el-row type="flex"
            justify="center"
            align="middle">
      <el-col :span="8">
      </el-col>
      <transition name="el-zoom-in-center">
        <el-col :span="3"
                v-show="batch">
          <el-button class="UploadButton">点击上传</el-button>
        </el-col>
      </transition>
    </el-row>
    <transition name="el-zoom-in-center">
      <Panle v-show="batch2" :isEditSelect="isEditSelect" :SeSyncDayta="SeSyncDayta" ref="getTreeData" @getTreeList="getTreeList"/>
    </transition>
    <transition name="el-zoom-in-top">
      <SectionPan v-show="batch"/>
    </transition>
  </div>
</template>

<script>
  import SectionPan from './components/sectionPanle.vue'
  import Panle from './components/Peoplesurface.vue'
  import {GetTreeList} from '@/api/article.js'
  import {connect} from 'net';
  import {GetSectionChildren} from '@/api/role.js'

  export default {
    components: {SectionPan, Panle},
    data() {
      this.chartSettings = {
        seriesMap: {
          tree1: {
            orient: 'vertical'
          }
        }
      };
      var self = this
      this.chartEvents = {
        click: function (e) {
          self.isClickSelect(e);
        }
      }
      return {
        SeSyncDayta: {
          data:{
            name:''
          }
        },
        isEditSelect: false,
        Treeda: {},
        batch: false,
        batch2: true,
        chartData: {
          columns: ['name', 'value'],
          rows: [
            {
              name: 'tree1',
              value: [],
            }
          ]
        },
        extend: {
          textStyle: {
            color: '#DAA520',
            fontSize: 12,
            fontWeight: 'bold',
          },
          series: {
            // symbolSize: 10,
            symbol: 'roundRect',
            symbolSize: [70, 50],
            itemStyle: {
              shadowColor: "#8FBC8F",
              shadowOffsetX: 3,
              shadowOffsetY: 3,
              shadowBlur: 10,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0.5,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgb(135,206,250)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgb(	0,191,255)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              },
              borderColor: "#3CB371"
            },
            label: {
              normal: {
                show: true
              }
            }
          }
        }
      }
    },
    created() {
      this.getTreeList()
    },
    methods: {
      isClickSelect(data) {
        let i = undefined;
        this.SeSyncDayta = data
        if (data.data.TypeID==2){
          this.isEditSelect = false
        }else {
          this.isEditSelect = true
        }
        this.$refs.getTreeData.getListTwo(data.data)
        GetSectionChildren(data.data).then((res) => {
          var dataArr = this.chartData.rows[0].value[0]
          console.log(dataArr)
          for (i in dataArr.children) {
            if (dataArr.children[i].value === data.data.value) {
              dataArr.children[i]['children'] = res.data
              this.chartData.rows[0].value = [dataArr]
            }
          }
        })
      },
      getTreeList() {
        GetTreeList().then((res) => {
          this.chartData.rows[0].value = [res.data]
          console.log(this.chartData.rows[0].value)
        })
      },
      Onchange(value) {
        if (value === true) {
          this.batch2 = false
        } else {
          this.batch2 = true
        }
      },
      tooltipFormatter(v) {
        return [
          `${'单位'}: ${v.data.name}`,
        ].join('<br>')
      }
    }
  }
</script>
<style>
  .UploadButton {
    background-color: aqua;
  }
</style>
