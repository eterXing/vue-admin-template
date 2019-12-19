<template>
  <div class="resourceDialog">
    <el-dialog :title="title + '资源'" v-dialogDrag :visible.sync="dialogFormVisible" width="550px" :close-on-click-modal='false'>
      <el-form :model="formData" ref="ruleForm" label-width='75px' label-position='right'>
        <el-form-item label="资源名称:" prop="resourceName">
          <el-input v-model="formData.resourceName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源顺序:" prop="sortNo">
          <el-input v-model="formData.sortNo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源路由:" prop="route">
          <el-input v-model="formData.route" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标:" prop="icon">
          <el-input v-model="formData.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源类型:" prop="type">
          <el-select v-model="formData.type" placeholder="请选择类型">
            <el-option label="菜单" :value='0'></el-option>
            <el-option label="功能" :value='1'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='接口url' prop="url" v-if="formData.type===1">
          <el-input autocomplete="off" v-model="formData.url"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input type="textarea" v-model="formData.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeResourceForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    props: { dialogData: Object },
    data() {
        return {
            title: '增加',
            dialogFormVisible: false,
            formData: {
                icon: '',
                parentId: '',
                resourceName: '',
                url: '',
                remark: '',
                sortNo: '',
                type: '',
                route: ''
            }
        }
    },
    methods: {
        changeResourceForm() {
            this.$axios[this.title==='新增' ? 'addResource' : 'editResource'](this.formData).then(res => {
                if (res.status === 200 && res.data.code === 2000) {
                    this.$message.success(res.data.data)
                    this.dialogFormVisible = false
                    this.$emit('changeResource')
                }
            })
        }
    },
    watch: {
        dialogData: {
            handler(newData) {
                if (newData.status) {
                    this.dialogFormVisible = true
                    this.title = newData.title
                    Object.assign(this.formData, newData.value)
                }
            },
            deep: true
        },
        dialogFormVisible(newData) {
            if (!newData) {
                Object.keys(this.formData).forEach(key => {
                    this.formData[key] = ''
                })
            }
        }
    }
}
</script>

<style scoped lang="scss">
</style>
