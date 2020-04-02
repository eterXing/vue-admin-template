<!--
 * @Date: 2020-04-02 10:31:14
 * @LastEditTime: 2020-04-02 11:00:01
 * @Description: 节点树
 -->
<template>
  <div class="approvalTemplate">
    <el-row type="type" justify="space-between">
      <el-col :span="12">
        <el-button size="small" @click="sumbit">保存</el-button>
      </el-col>
      <el-col :span="12">
        <div class="zoom">
          <el-input-number size="small" :step="10" v-model="nowVal" @change="zoomSize" :min="50" :max="100" label="描述文字"></el-input-number>
        </div>
      </el-col>
    </el-row>
    <div class="wrapper" :style="'transform: scale('+nowVal/100+'); transform-origin: 50% 0px 0px;'">
      <step :testList='testList' :allList='testList' @delNode='delNode'></step>
      <div class="endNode">
        <div class="endCircle"></div>
        流程结束
      </div>
    </div>
  </div>
</template>

<script>
import Step from './Step.vue'
import qs from 'qs'
export default {
    provide () {
        return {
            prevValue: this
        }
    },
    components: { Step },
    data() {
        return {
            testList: {
                name: '开始',
                title: '发起人',
                type: 'START',
                nodeCode: 'id-start',
                prevNodeCode: '',
                conditionNodes: [],
                childNode: ''
            },
            nowVal: 100
        }
    },
    methods: {
        delNode(val){
            this.testList = val
        },
        sumbit() {
            // 做分支条件判断
            if(document.querySelectorAll('.error').length) {
                this.$message.warning('分支条件不能为空')
                return
            }
            console.log(this.testList)
            let value = qs.stringify({templateType:1, nodeConfig: JSON.stringify(this.testList)})

            this.$axios.saveWorkFlowTemplate(value).then(res => {
                if(res.status === 200 && res.data.code === 2000) {
                    console.log(res.data.data)
                    this.$message.success('创建成功')
                }
            })
        },
        zoomSize(val) {
            this.nowVal = val
        }
    }
}
</script>

<style lang="scss">
.approvalTemplate {
  padding: 20px 0;
  .zoom .zoom-in,
  .zoom .zoom-out {
    width: 30px;
    height: 30px;
    background: #fff;
    color: #c1c1cd;
    cursor: pointer;
    background-size: 100%;
    background-repeat: no-repeat;
  }
  .wrapper {
    position: relative;
    display: inline-flex;
    flex-wrap: wrap;
    margin: 0 auto;
    .lineWrap {
      padding: 20px;
    }
    .itemBox {
      box-sizing: border-box;
      position: relative;
      left: 50%;
      z-index: 1;
      transform: translateX(-50%);
      user-select: none;
      width: 200px;
      background-color: #fff;
      font-size: 14rem;
      border-radius: 2px;
      border: 1px solid #fff;
      box-shadow: 2px 3px 4px 0 rgba(0, 0, 0, 0.05);
      .title {
        padding-left: 5px;
        height: 25px;
        line-height: 25px;
        text-align: left;
        color: #fff;
        background-color: rgb(51, 203, 204);
      }
      .approverTitle {
        background-color: rgb(255, 148, 74) !important;
      }
      .notifierTitle {
        background-color: rgb(33, 149, 246) !important;
      }
      .content {
        cursor: pointer;
        height: 50px;
        line-height: 50px;
      }
    }
    .itemBox:hover {
      border: 1px solid $color;
    }
    .addBox {
      position: relative;
      z-index: 10;
      margin-top: 30px;
    }
  }
  .lineWrap::before {
    content: "";
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 2px;
    height: calc(100% - 40px);
    z-index: -1;
    background-color: #cacaca;
  }
}
</style>
<style lang='scss' scoped>
.approvalTemplate .wrapper .itemBox .title {
  background-color: $color;
}
.approvalTemplate .wrapper .start {
  padding-top: 0;
}
.endNode {
  flex: 1;
  background-color: #fff;
  font-size: 14rem;
  .endCircle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #dbdcdc;
    margin: auto auto 8px;
  }
}
</style>
