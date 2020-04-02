<!--
 * @Date: 2020-03-27 13:54:16
 * @LastEditTime: 2020-04-02 10:37:21
 * @Description: 分支条件
 -->
<template>
  <div class="conditionForm">
    <div class="box managements">
      <p>条件之间的关系</p>
      <div class="radioBox">
        <el-radio v-model="values.conditionType" :label="0">或的关系（当审批单满足以下其中一个条件时进入此流程）</el-radio>
      </div>
      <div class="radioBox">
        <el-radio v-model="values.conditionType" :label="1">且的关系（当审批单同时满足以下条件时进入此流程）</el-radio>
      </div>
    </div>
    <div class="box">
      <p>设置条件</p>
      <div class="content">
        <div v-for="(itm,index) in conditions" :key="index">
          <p class="red" v-show="index">{{ values.conditionType ? '且' : '或' }}</p>
          <el-row>
            <el-col :span="11">
              <el-select v-model="itm.code" size='mini' placeholder="请选择" @change="changeCondition($event,index)">
                <el-option v-for="item in conditionList" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="11">
              <el-select v-model="itm.status" size='mini' placeholder="请选择" @change="changeStatus($event,index)">
                <el-option label='包含' value='in'></el-option>
                <el-option label='不包含' value='notIn'></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row v-if="itm.status" class="lastSelect">
            <el-col :span='22'>
              <el-select v-model="itm[itm.status]" size='mini' placeholder="请选择" multiple>
                <el-option v-for="item in allCondition[conditionList[0].list]" :key="item.companyId" :label="item.name" :value="item.companyId">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-button type="text" @click="delConditions(index)" v-show="conditions.length > 1">删除</el-button>
        </div>
      </div>
      <el-button @click="addConditions" size="mini">添加条件</el-button>
    </div>
  </div>
</template>

<script>
export default {
    props: {value: Object},
    data() {
        return {
            values: {},
            conditions: [],
            conditionList: [
                {name: '申请人所属公司', value: 'radio-y7f9k9rkknp' ,list: 'companyList'}
            ],
            allCondition: {
                // 使用公司列表
                companyList: []
            }
        }
    },
    methods: {
        changeCondition(event, val) {
            this.conditions[val].type = 'radio'
            this.conditionList.some(item => {
                if(item.value === event) {
                    this.conditions[val].label = item.name
                    return true
                }
            })
        },
        // 改变状态
        changeStatus(val,idx) {
            ['in', 'notIn'].some(item => {
                if(item !== val) {
                    delete this.conditions[idx][item]
                    return
                }
            })
        },
        // 获取公司列表
        loadCompanyByPage() {
            this.$axios.loadCompanyByPage({pageNumber: 1, pageSize: 1000}).then(res => {
                if(res.status === 200 && res.data.code === 2000) {
                    this.allCondition.companyList = res.data.data.content
                }
            })
        },
        addConditions() {
            this.conditions.push({})
        },
        delConditions(val) {
            this.conditions.splice(val, 1)
        }
    },
    mounted() {
        this.loadCompanyByPage()
    },
    watch: {
        value: {
            handler(newData) {
                this.values = newData
                this.conditions = newData.conditions
            },
            immediate: true,
            deep: true
        }
    }
}
</script>

<style scoped lang="scss">
.conditionForm {
  font-size: 14px;
  .box {
    width: 100%;
    padding: 20px 0;
    border-bottom: 1px dashed #ccc;
  }
  .content {
    > div {
      padding: 10px 0 10px 20px;
      > div {
        margin: 5px 0;
      }
      .el-select {
        width: 100%;
      }
    }
  }
  .red {
    color: red;
  }
  .managements {
    p {
      margin-bottom: 5px;
      font-size: 14px;
    }
    .radioBox {
      padding: 5px 0 5px 20px;
    }
  }
}
</style>
