<!--
 * @Date: 2019-09-26 18:37:09
 * @LastEditTime: 2020-04-02 10:38:49
 * @Description: 部门树形组件
 -->
<template>
  <div class="content" id="content">
    <el-tree v-loading="loading" accordion :default-expanded-keys='defaultExpanded' element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="#fff" ref="tree" :data="treeList" node-key="id" :expand-on-click-node="false" @node-click="handleNodeClick">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span style="float:left;">
          {{ data.name  + '(' + data.userCount + ')' }}
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>

export default {
    data() {
        return {
            treeList: [],
            // 默认展开的数组key
            defaultExpanded: [],
            loading:false
        }
    },
    mounted(){
        this.getTreeList()
    },
    methods: {
        getTreeList () {
            this.loading =true
            this.$axios.getDeptTree().then(res => {
                if (res.status === 200 && res.data.code === 2000 ) {
                    console.log(res.data.data)
                    this.loading = false
                    this.treeList = res.data.data
                    this.defaultExpanded = [res.data.data[0].id]
                    this.$emit('treeList',this.treeList)
                }
            })
        },
        handleNodeClick(data) {
            this.$emit('treeData', data)
        }

    },
    watch: {
    }
}
</script>
<style scoped lang='scss'>
.content {
  .custom-tree-node {
    width: 100%;
  }
  .el-tree {
    font-size: 12px;
  }
  .el-dialog__header {
    text-align: left;
  }
}
</style>
