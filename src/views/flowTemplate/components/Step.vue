<!--
 * @Date: 2020-04-02 10:32:10
 * @LastEditTime: 2020-04-02 11:32:37
 * @Description: 节点
 -->
<template>
  <div class="step" v-if="list">
    <!-- 条件分支 -->
    <div class="stepLists" v-if="list.type === 'route'">
      <div class="route">
        <div class="borders" :class="{'leftTop':index===0 , 'rightTop': index===lastListLength, 'clearfix': true}" v-for="(item,index) in conditionLists" :key="index">
          <div v-if="lineEdge.includes(index)">
            <div class="top coverLine"></div>
            <div class="bottom coverLine"></div>
          </div>
          <!-- 分支信息框 -->
          <step :testList='item' :allList='allList'></step>
        </div>
      </div>
      <div class="addBox">
        <el-popover placement="top" width="300" v-model="visibleStatus">
          <div class="box">
            <div class="left" @click="addApproval(1)">
              <i class="el-icon-video-camera"></i>
              <p>审批人</p>
            </div>
            <div class="center" @click="addApproval(2)">
              <i class="el-icon-s-promotion"></i>
              <p>抄送人</p>
            </div>
            <div class="right" @click="addApproval(3)">
              <i class="el-icon-s-operation"></i>
              <p>条件分支</p>
            </div>
          </div>
          <el-button slot="reference" size="small" type="primary" icon="el-icon-plus" circle></el-button>
        </el-popover>
      </div>
    </div>

    <!-- 子分支 -->
    <div class="stepList" v-else>
      <div class="lineWrap">
        <div :class="{'isShowTitle':list.prevNodeCode, 'itemBox':true , 'error':list.error}">
          <div :class="{'title': true, 'approverTitle': list.type === 'APPROVER', 'notifierTitle': list.type==='NOTIFIER'}">
            <span>{{list.title}}</span>
            <i v-if="list.prevNodeCode" @click.stop="removeThisNode(list)" class="el-icon-close"></i>
          </div>
          <div class="content" @click="showDetail(list)">{{list.name}}</div>
        </div>
        <!-- 添加弹框 -->
        <div class="addBox">
          <el-popover placement="top" width="300" v-model="visibleStatus">
            <div class="box">
              <div class="left" @click="addApproval(1)">
                <i class="el-icon-video-camera"></i>
                <p>审批人</p>
              </div>
              <div class="center" @click="addApproval(2)">
                <i class="el-icon-s-promotion"></i>
                <p>抄送人</p>
              </div>
              <div class="right" @click="addApproval(3)">
                <i class="el-icon-s-operation"></i>
                <p>条件分支</p>
              </div>
            </div>
            <el-button slot="reference" size="small" type="primary" icon="el-icon-plus" circle></el-button>
          </el-popover>
        </div>
      </div>
    </div>
    <step v-if="list.childNode" :testList='list.childNode' :allList='allList'></step>
    <drawer :status='drawerStatus' v-model="drawerValue" @closeDrawer='closeDrawer'></drawer>
  </div>
</template>

<script>
import Drawer from './Drawer.vue'
export default {
    inject: ['prevValue'],
    components: { Drawer },
    props: { testList: Object, allList:Object },
    name: 'Step',
    data() {
        return {
            list: {}, // 当前节点对象
            childrenList: {}, // 子分支
            conditionLists: [], // 条件分支
            lineEdge: [], // 条件分支最大最小节点
            lastListLength: 0, // 条件分支最后节点
            drawerValue: {},
            visibleStatus: false,
            drawerStatus: false
        }
    },
    methods: {
        // 删除子节点(利用对象特性)
        removeThisNode(val) {
            let allList = JSON.parse(JSON.stringify(this.allList))

            this.getPrevData([allList], val.prevNodeCode, val.nodeCode)

            // 修改父组件的值
            this.prevValue.testList = allList
        },
        // 生成唯一id
        guid() {
            return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36)
        },
        // 添加节点
        addApproval(type) {
            let childList = JSON.parse(JSON.stringify(this.list.childNode)),
                nodeCode = this.guid()
            // 添加审批人

            if(type === 1) {
                this.list.childNode = {
                    title: '审批人',
                    name: '发起人直接主管',
                    type: 'APPROVER',
                    prevNodeCode: this.list.nodeCode,
                    nodeCode: nodeCode,
                    childNode: childList ? Object.assign(childList,{prevNodeCode:nodeCode}) : childList,
                    properties: {
                        activateType: 'AND',
                        actionerRules: [{ type: 'target_management', level: 1, autoUp: true }]
                    }
                }
            // 添加条件分支
            } else if(type === 2) {
                this.list.childNode = {
                    title: '抄送人',
                    name: '抄送人',
                    type: 'NOTIFIER',
                    prevNodeCode: this.list.nodeCode,
                    nodeCode: nodeCode,
                    childNode: childList ? Object.assign(childList,{prevNodeCode:nodeCode}) : childList,
                    properties: {
                        activateType: 'AND',
                        actionerRules: [{ type: 'target_management', level: 1, autoUp: true }]
                    }
                }
            } else if(type === 3) {
            // 已经是条件分支
                if(this.list.childNode.type === 'route') {
                    this.list.childNode.conditionNodes.push({
                        title: '审批人',
                        name: '发起人直接主管',
                        type: 'APPROVER',
                        prevNodeCode: this.list.childNode.nodeCode,
                        nodeCode: this.guid(),
                        childNode: '',
                        conditionNodes: [],
                        withCondition: true,
                        error: true,
                        conditionType: 0,
                        conditions: [{}],
                        properties: {
                            activateType: 'AND',
                            actionerRules: [{ type: 'target_management', level: 1, autoUp: true }]
                        }
                    })
                } else {
                    // 获取两个id
                    let firstCode = this.guid(),
                        lastCode = this.guid()
                    // 子节点变条件分支

                    this.list.childNode = {
                        name: 'route',
                        type: 'route',
                        prevNodeCode: this.list.nodeCode,
                        nodeCode: nodeCode,
                        childNode: '',
                        conditionNodes: [
                            // 原来的子分支，如果为空，也新增条件分支
                            childList ? Object.assign(childList, {
                                prevNodeCode:nodeCode,
                                withCondition: true,
                                error: true,
                                conditionType: 0,
                                conditions: [{}]
                            }) : {
                                title: '审批人',
                                name: '发起人直接主管',
                                type: 'APPROVER',
                                prevNodeCode: nodeCode,
                                nodeCode: firstCode,
                                conditionNodes: [],
                                childNode: '',
                                withCondition: true,
                                error: true,
                                conditionType: 0,
                                conditions: [{}],
                                properties: {
                                    activateType: 'AND',
                                    actionerRules: [{ type: 'target_management', level: 1, autoUp: true }]
                                }
                            },
                            // 新增的条件分支
                            {
                                title: '审批人',
                                name: '发起人直接主管',
                                type: 'APPROVER',
                                prevNodeCode: nodeCode,
                                nodeCode: lastCode,
                                conditionNodes: [],
                                childNode: '',
                                withCondition: true,
                                error: true,
                                conditionType: 0,
                                conditions: [{}],
                                properties: {
                                    activateType: 'AND',
                                    actionerRules: [{ type: 'target_management', level: 1, autoUp: true }]
                                }
                            }
                        ]
                    }
                }
            }
            this.visibleStatus = false
        },
        // 递归添加子节点
        appendListChild (target,data) {
            if(!data) {
                return
            }
            if(target.childNode) {
                return this.appendListChild(target.childNode, data)
            }
            data.prevNodeCode = target.nodeCode
            target.childNode = data
            return target

        },
        // 递归获取nodeCode父节点
        getPrevData(val, prevId, id) {
            let target = {},
                arr = []

            val.forEach(item => {
                if(item.nodeCode === prevId) {
                    target = item
                } else {
                    if (item.childNode) {
                        arr.push(item.childNode)
                    }
                    if (item.conditionNodes && item.conditionNodes.length) {
                        arr.push(...item.conditionNodes)
                    }
                }
            })

            if(Object.keys(target).length) {
                let childList

                // 删除
                if (target.childNode && target.childNode.nodeCode === id) {
                    childList = target.childNode.childNode

                    target.childNode = childList ? Object.assign(childList,{prevNodeCode:target.nodeCode}) : ''
                } else {

                    // 判断条件分支length是否为2
                    // eslint-disable-next-line no-lonely-if
                    if(target.conditionNodes.length === 2) {
                        let firstChild = target.conditionNodes.filter(item => {
                            return item.nodeCode !== id
                        })

                        childList = JSON.parse(JSON.stringify(target.childNode))
                        target.title = firstChild[0].title
                        target.name = firstChild[0].name
                        target.type = firstChild[0].type
                        target.nodeCode = firstChild[0].nodeCode
                        target.properties = firstChild[0].properties
                        target.conditionNodes = firstChild[0].conditionNodes
                        delete target.withCondition
                        delete target.error
                        delete target.conditionType
                        delete target.conditions
                        // route节点有无子节点
                        // 递归添加到最后的children上
                        this.appendListChild(Object.assign(target,{childNode: firstChild[0].childNode}),childList)
                    } else {
                        target.conditionNodes.some((item,index) => {
                            if(item.nodeCode === id) {
                                target.conditionNodes.splice(index,1)
                                return
                            }
                        })
                    }
                }
            } else {
                this.getPrevData(arr, prevId, id)
            }
        },
        // 查看详情
        showDetail(val) {
            if(val.type !== 'START') {
                this.drawerValue = val
                this.drawerStatus = true
            }
        },
        closeDrawer() {
            this.drawerStatus = false
        }
    },
    watch: {
        testList: {
            handler(newData) {
                if(newData) {
                    this.list = newData
                    this.childrenList = newData.childNode
                    this.conditionLists = newData.conditionNodes
                    if (this.conditionLists && this.conditionLists.length) {
                        this.lineEdge = [0, this.conditionLists.length - 1]
                        this.lastListLength = this.conditionLists.length - 1
                    }
                }
            },
            deep: true,
            immediate: true
        }
    }
}
</script>

<style scoped lang="scss">
.step {
  min-width: 100%;
  display: inline-flex;
  position: relative;
  flex-wrap: wrap;
  .isShowTitle::before {
    content: "";
    position: absolute;
    z-index: 100;
    top: -13px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-color: #cacaca transparent transparent transparent;
    border-style: solid;
    border-width: 8px 6px 4px 6px;
    background-color: #fff;
  }
  .itemBox {
    .title {
      i {
        position: absolute;
        top: 5px;
        right: 5px;
      }
    }
  }
}
.el-popover {
  .box {
    display: flex;
    justify-content: space-between;
    > div {
      user-select: none;
      cursor: pointer;
      flex: 1;
      text-align: center;
      p {
        text-align: center;
      }
    }
  }
}

.stepList {
  flex: 1;
}

// 多子项处理
.stepLists {
  flex: 1;
  padding: 20px;
}
.route {
  position: relative;
  display: inline-flex;
  justify-content: space-between;
  background-color: #fff;
  .borders {
    position: relative;
    flex: 1;
    border-top: 2px solid #cacaca;
    border-bottom: 2px solid #cacaca;
    .lineWrap {
      padding: 40px 20px 20px 20px;
    }
    // 隐藏侧边
    .coverLine {
      position: absolute;
      z-index: 100;
      width: calc(50% - 1px);
      height: 8px;
      background-color: #fff;
    }
  }
  .rightTop > div > .top {
    right: 0px;
    top: -5px;
  }
  .rightTop > div > .bottom {
    right: 0px;
    bottom: -5px;
  }
  .leftTop > div > .top {
    left: 0px;
    top: -5px;
  }
  .leftTop > div > .bottom {
    left: 0px;
    bottom: -5px;
  }
  .borders::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 2px;
    height: 100%;
    z-index: 0;
    background-color: #cacaca;
  }
  .error {
    border: 1px solid red !important;
  }
}
</style>
