<!--
 * @Date: 2020-04-02 10:33:23
 * @LastEditTime: 2020-04-02 10:33:54
 * @Description: 侧边栏
 -->
 <template>
  <div>
    <el-drawer title="节点配置" :visible.sync="drawerStatus" direction="rtl" class="templateDrawer" :before-close="handleClose">
      <div class="main">
        <el-tabs v-model="activeName">
          <el-tab-pane label="配置内容" name="content">
            <div class="tabBox">
              <content-form v-bind="$attrs" v-if="$attrs.value.type === 'APPROVER'"></content-form>
              <notice-form v-bind="$attrs" v-else></notice-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label=" 分支条件" name="condition" v-if="$attrs.value.withCondition">
            <div class="tabBox">
              <condition-form v-bind="$attrs"></condition-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import ContentForm from './ContentForm.vue'
import NoticeForm from './NoticeForm.vue'
import ConditionForm from './ConditionForm.vue'
export default {
    components: { ContentForm, ConditionForm, NoticeForm},
    props: { status: Boolean },
    data() {
        return {
            activeName: 'content',
            drawerStatus: false
        }
    },
    methods: {
        //做相关校验，判断是否满足流程需求
        handleClose(done) {
            let status = true,
                title = '',
                values = this.$attrs.value,
                propertyList = this.$attrs.value.properties.actionerRules[0]

            switch (propertyList.type) {
            case 'target_approval':
                if(!propertyList.approvals.length) {
                    title = '请选择审批人'
                    status = false
                }
                break
            case 'target_management':
                if(!propertyList.level) {
                    title = '请选择审批主管'
                    status = false
                }
                break
            case 'target_label':
                if(!propertyList.roleId) {
                    title = '请选择审批角色'
                    status = false
                }
                break
            case 'target_managers':
                if(!propertyList.deptDepth) {
                    title = '请选择连续审批主管级数'
                    status = false
                }
                break
            default:
                break
            }

            // 判断分支条件
            if(this.$attrs.value.withCondition) {
                let conditions = this.$attrs.value.conditions

                if(conditions && conditions.length) {
                    conditions.some(item => {
                        if(item.hasOwnProperty('in') && !item.in.length) {
                            status = false
                            title = '分支条件不能为空'
                        }
                        if(item.hasOwnProperty('notIn') && !item.notIn.length) {
                            status = false
                            title = '分支条件不能为空'
                        }
                        if(!item.hasOwnProperty('in') && !item.hasOwnProperty('notIn')) {
                            status = false
                            title = '分支条件不能为空'
                        }
                    })
                } else {
                    status = false
                    title = '分支条件不能为空'
                }
            }
            if( status) {
                values.error = false
                done()
                this.$emit('closeDrawer')
            } else {
                this.$message.warning(title)
            }
        }
    },
    watch: {
        status(newData) {
            if(newData) {
                this.activeName = 'content'
                this.drawerStatus = newData
            }
        }
    }
}
</script>

 <style lang="scss">
.templateDrawer {
  .main {
    padding: 0 20px;
  }
  .tabBox {
    max-height: calc(100vh - 150px);
    overflow: auto;
  }
}
</style>