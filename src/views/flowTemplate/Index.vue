<!--
 * @Date: 2020-04-02 10:30:13
 * @LastEditTime: 2020-04-02 10:58:55
 * @Description: 流程模板
 -->

<template>
  <div class="flowTemplate">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="left">
          <h3>
            <span>审批列表</span>
          </h3>
          <ul class="clearfix">
            <li v-for="(item,index) in leftData" :class="activeList === index ? 'active' : ''" :key="index" @click="changeList(index)">
              <span>{{item.name}}</span>
              <span>{{item.type}}</span>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="left">
          <h3>
            <span>处置申请</span>
          </h3>
          <div class="right">
            <approval-template></approval-template>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ApprovalTemplate from './components/ApprovalTemplate.vue'
export default {
    components: { ApprovalTemplate },
    data() {
        return {
            leftData: [
                { name: '领用申请', type: '关闭' },
                { name: '领用申请', type: '关闭' },
                { name: '领用申请', type: '关闭' },
                { name: '领用申请', type: '关闭' }
            ],
            activeList: 0
        }
    },
    methods: {
        changeList(index) {
            this.activeList = index
        }
    },
    mounted() {}
}
</script>

<style scoped lang="scss">
.flowTemplate {
  height: 100vh;
  overflow: hidden;
  font-size: 14px;
  text-align: center;
  .left {
    text-align: left;
    padding: 20px;
    h3 {
      border-bottom: 1px solid #ccc;
      span {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        border-bottom: 2px solid $color;
      }
    }
    ul {
      li {
        cursor: pointer;
        padding: 5px;
        height: 20px;
        line-height: 20px;
        span:first-child {
          float: left;
        }
        span:last-child {
          float: right;
        }
      }
      li:hover {
        background-color: rgb(236, 250, 250);
      }
      .active {
        color: $color;
        height: 19px;
        border-bottom: 1px solid #e1f7f7;
      }
    }
  }
  .right {
    text-align: center;
    height: calc(100vh - 100px);
    overflow: auto;
  }
}
</style>
