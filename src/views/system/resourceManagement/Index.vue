<template>
  <div class="resourceManagement">
    <el-table :data="treeList" border row-key="resourceId">
      <el-table-column prop="resourceName" label="资源名称">
      </el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="120">
        <template slot-scope="scope">
          <i :class="'iconfont '+ scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="资源类型" align="center" width="80">
        <template slot-scope="scope">
          {{scope.row.type === 0 ? '菜单' : '功能'}}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center">
      </el-table-column>
      <el-table-column prop="route" label="路由" align="center">
      </el-table-column>
      <el-table-column prop="url" label="接口地址" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.type === 0" type="primary" size="mini" @click="append(scope.row.resourceId)">增加</el-button>
          <el-button type="primary" size="mini" @click="exit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="remove(scope.row.resourceId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button size="small" type="text" @click='append(1)'>增加</el-button>
    <resource-dialog :dialogData='dialogData' @changeResource='getResourceTree'></resource-dialog>
  </div>
</template>

<script>
import ResourceDialog from './components/ResourceDialog.vue'
export default {
    components: { ResourceDialog },
    data() {
        return {
            treeList: [],
            dialogData: {
                title: '',
                value: {},
                status: false
            }
        }
    },
    methods: {
        // 获取资源树
        getResourceTree() {
            this.$axios.getResourceTree().then(res => {
                if (res.status === 200 && res.data.code === 2000) {
                    this.treeList = res.data.data.children
                }
            })
        },
        // 添加窗口
        append(val) {
            this.dialogData = {
                title: '新增',
                status: true,
                value: { parentId: val }
            }
        },
        // 编辑窗口
        exit(val) {
            this.dialogData = {
                title: '编辑',
                status: true,
                value: val
            }
        },
        // 删除
        remove(val) {
            this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$axios.deleteResource({ resourceId: val }).then(res => {
                        if (res.status === 200 && res.data.code === 2000) {
                            this.$message.success(res.data.data)
                            this.getResourceTree()
                        }
                    })
                })
                .catch(() => {})
        }
    },
    mounted() {
        this.getResourceTree()
    }
}
</script>

<style scoped lang="scss">
.resourceManagement {
  text-align: left;
  .el-button {
      margin: 5px 2px;
  }
}
</style>
