<!--
 * @Date: 2020-04-02 10:34:14
 * @LastEditTime: 2020-04-02 10:36:37
 * @Description: 审批人配置信息
 -->

<template>
  <div class="contentForm">
    <div class="box fix-input">
      <span>节点名称</span>
      <el-input placeholder="请输入内容" v-model="values.title" size="mini" clearable>
      </el-input>
    </div>
    <div class="box">
      <el-radio-group v-model="actionerRule.type" @change="changeType">
        <el-radio label="target_approval">指定成员</el-radio>
        <el-radio label="target_management">主管</el-radio>
        <el-radio label="target_label">角色</el-radio>
        <el-radio label="target_managers">连续多级主管</el-radio>
        <el-radio label="target_self">发起人自己</el-radio>
      </el-radio-group>
    </div>
    <!-- 指定成员 -->
    <div class="box" v-if="actionerRule.type === 'target_approval'">
      <el-button @click="dialogMembersFormVisible = true" size="mini">添加成员</el-button>
      <p class="members" v-if="actionerRule.approvals && actionerRule.approvals.length">
        <span v-for="item in actionerRule.approvals" :key="item.userId">{{item.userName + '-' + item.jobNumber}} <i class="el-icon-close director_close" @click="userDelete(item)"></i> &nbsp;&nbsp;</span>
      </p>
      <add-members :show="dialogMembersFormVisible" @formVisible="getFormVisible" @checkedMembers="getCheckedMembers" :originChecked="actionerRule.approvals"></add-members>
    </div>
    <!-- 主管 -->
    <div class="box fix-select" v-show="actionerRule.type === 'target_management'">
      <span>发起人的</span>
      <el-select v-model="actionerRule.level" size='mini' placeholder="请选择">
        <el-option v-for="item in managementList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <!-- 角色 -->
    <div class="box fix-select" v-show="actionerRule.type === 'target_label'">
      <span>选择角色</span>
      <el-select v-model="actionerRule.roleId" size='mini' placeholder="请选择" @change="changeRole">
        <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId">
        </el-option>
      </el-select>
    </div>
    <!-- 连续多级主管 -->
    <div class="box managements" v-show="actionerRule.type === 'target_managers'">
      <p>审批终点</p>
      <div class="radioBox">
        <el-radio v-model="actionerRule.levels" label="upDown">
          <div class="fix-select">
            <span>不超过发起人由上往下数的</span>
            <el-select v-model="actionerRule.deptDepth" size='mini' placeholder="请选择">
              <el-option v-for="item in managementList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-radio>
      </div>
      <div class="radioBox">
        <el-radio v-model="actionerRule.levels" label="downUp">
          <div class="fix-select">
            <span>不超过发起人由下往上数的</span>
            <el-select v-model="actionerRule.deptDepth" size='mini' placeholder="请选择">
              <el-option v-for="item in managementList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-radio>
      </div>
    </div>
    <!-- 会签或签 -->
    <div class="box managements" v-show="['target_approval','target_management', 'target_label'].includes(actionerRule.type)">
      <p>多人审批时采用的审批方式</p>
      <div class="radioBox">
        <el-radio v-model="propertiey.activateType" label="AND">会签(须所有审批人同意)</el-radio>
      </div>
      <div class="radioBox">
        <el-radio v-model="propertiey.activateType" label="OR">或签(一个审批人同意或拒绝即可)</el-radio>
      </div>
    </div>
    <!-- 审批人为空是自动通过 -->
    <div class="box managements">
      <p>审批人为空时</p>
      <div class="radioBox">
        <el-radio v-model="actionerRule.autoUp" :label="true">自动通过</el-radio>
      </div>
    </div>
  </div>
</template>

<script>
import AddMembers from '@/components/AddMembers.vue'
export default {
    components: { AddMembers },
    props: {value: Object},
    data() {
        return {
            dialogMembersFormVisible: false,
            values: {},
            propertiey: {},
            actionerRule: {},
            managementList: [
                {label: '第1级主管', value: 1},
                {label: '第2级主管', value: 2},
                {label: '第3级主管', value: 3},
                {label: '第4级主管', value: 4},
                {label: '第5级主管', value: 5},
                {label: '第6级主管', value: 6},
                {label: '第7级主管', value: 7},
                {label: '第8级主管', value: 8},
                {label: '第9级主管', value: 9},
                {label: '第10级主管', value: 10},
                {label: '第11级主管', value: 11},
                {label: '第12级主管', value: 12},
                {label: '第13级主管', value: 13},
                {label: '第14级主管', value: 14},
                {label: '第15级主管', value: 15},
                {label: '第16级主管', value: 16},
                {label: '第17级主管', value: 17},
                {label: '第18级主管', value: 18},
                {label: '第19级主管', value: 19},
                {label: '第20级主管', value: 20}
            ],
            // 角色列表
            roleList: []
        }
    },
    methods: {
        //修改类型设置默认字段
        changeType(val) {
            let propertyList = ['approvals', 'level', 'roleId', 'roleName', 'levels', 'deptDepth'],
                nowTypeProperyList = []

            // 重置为会签
            this.propertiey.activateType = 'AND'
            switch (val) {
            case 'target_approval':
                this.actionerRule.approvals = []
                nowTypeProperyList= ['approvals']
                break
            case 'target_management':
                nowTypeProperyList = ['level']
                break
            case 'target_label':
                nowTypeProperyList = ['roleId', 'roleName']
                break
            case 'target_managers':
                this.propertiey.activateType = 'ONE_BY_ONE'
                this.actionerRule.levels = 'upDown'
                nowTypeProperyList = ['levels', 'deptDepth']
                break
            default:
                nowTypeProperyList = []
                break
            }
            // 遍历删除
            propertyList.forEach(item => {
                if(!nowTypeProperyList.includes(item)) {
                    delete this.actionerRule[item]
                }
            })
        },
        // 关闭弹框
        getFormVisible (val) {
            this.dialogMembersFormVisible = val
        },
        // 修改名字
        changeName(val) {
            if(!val || !val.length) {
                this.values.name = '审批人'
                return
            }
            let nowName = val.map(item => {
                return item.userName
            })

            nowName = nowName.join(',')
            if(nowName.length > 12) {
                nowName = nowName.substring(0,12) + '...'
            }
            this.values.name = nowName
        },
        // 获取指定人
        getCheckedMembers(val) {
            this.actionerRule.approvals = val
            this.changeName(val)
        },
        // 删除指定人
        userDelete(val) {
            let index

            if(val.deptId) {
                this.actionerRule.approvals.some((item,idx) => {
                    if(item.deptId * item.userId === val.deptId * val.userId) {
                        index = idx
                    }
                })
            } else {
                this.actionerRule.approvals.some((item,idx) => {
                    if( item.userId === val.userId) {
                        index = idx
                    }
                })
            }
            this.actionerRule.approvals.splice(index, 1)
            this.changeName(this.actionerRule.approvals)
            this.$forceUpdate()
        },
        // 获取角色
        getRolePage() {
            this.$axios.getRolePage({pageSize:1000,pageNumber:1}).then(res => {
                if(res.status === 200 && res.data.code === 2000) {
                    this.roleList = res.data.data.content
                }
            })
        },
        //修改角色获取name
        changeRole(val) {
            this.roleList.some(item => {
                if(item.roleId === val) {
                    this.actionerRule.roleName = item.roleName
                    return true
                }
            })
        }
    },
    mounted () {
        this.getRolePage()
    },
    watch: {
        value: {
            handler(newData) {
                this.values = newData
                this.propertiey = newData.properties
                this.actionerRule = newData.properties.actionerRules[0]
            },
            immediate: true,
            deep: true
        },
        // 监听获取名字
        actionerRule: {
            handler(newData) {
                let name = '审批人'

                switch (newData.type) {
                case 'target_management':
                    if(newData.level) {
                        name = '第' + newData.level + '级主管审批'
                    }
                    break
                case 'target_label':
                    if(newData.roleName) {
                        name = newData.roleName + '审批'
                    }
                    break
                case 'target_managers':
                    name = '连续多级主管审批'
                    break
                case 'target_self':
                    name = '发起人自己审批'
                    break
                default:
                    break
                }
                this.values.name = name
            },
            deep: true
        }
    }
}
</script>

<style scoped lang="scss">
.contentForm {
  .box {
    width: 100%;
    padding: 20px 0;
    border-bottom: 1px dashed #ccc;
  }
  .members {
    margin-top: 10px;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
    > span {
      display: inline-block;
      padding: 5px 0;
    }
  }
  .managements {
    p {
      margin-bottom: 5px;
      font-size: 14px;
    }
    .radioBox {
      padding: 5px 0;
    }
  }
}
</style>
