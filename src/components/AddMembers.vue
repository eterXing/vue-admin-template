<!--
 * @Date: 2020-04-02 10:35:17
 * @LastEditTime: 2020-04-02 10:38:13
 * @Description: 选择员工
 -->

<template>
  <div class="add_members" v-if="formVisible">
    <el-dialog title="选择员工" v-dialogDrag :visible.sync="formVisible" append-to-body width="730px" height="600px" @close="dialogClose()">
      <div class="director_top">
        <div class="director_top_left">
          <dept-tree @treeData="getTreeData"></dept-tree>
        </div>
        <div class="director_top_right">
          <div class="search">
            <i class="el-icon-search" @click="searchMember()"></i>
            <el-input v-model="directorSearch" autocomplete="off" placeholder="请输入人员姓名"></el-input>
          </div>
          <div class="search_box">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="height:30px">全选</el-checkbox>
            <!-- <div style="margin: 15px 0;"></div> -->
            <el-checkbox-group v-model="checkedUsers" @change="handleCheckedCitiesChange">
              <!-- <el-checkbox v-for="user in users" :label="user.userName + '-' + user.jobNumber" :key="user.userId">{{user.userName + '-' + user.jobNumber}}</el-checkbox> -->
              <el-checkbox @change="handleCheckSingle(value,user)" v-for="user in users" :label="user" :key="user.deptId ? user.deptId*user.userId : user.userId">{{user.userName + '-' + user.jobNumber}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>

      </div>
      <div class="director_bottom">

        <!-- <span v-for="user in checkedUsers" :key="user.deptId ? user.deptId*user.userId : user.userId">{{user.userName + '-' + user.jobNumber}} <i class="el-icon-close director_close" @click="userDelete(user)"></i></span> -->
        <span v-for="user in newOrigin" :key="user.deptId ? user.deptId*user.userId : user.userId">{{user.userName + '-' + user.jobNumber}} <i class="el-icon-close director_close" @click="userDelete(user)"></i></span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogClose()">取消</el-button>
        <el-button size="small" type="primary" @click="createData()">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import DeptTree from './DeptTree'
// const userOptions = []

export default {
    components: { DeptTree },
    props:{
        VALUE:Array,
        show:Boolean,
        dialogTitle:String,
        originChecked:Array
    },
    data() {
        return {
            formVisible: false,
            directorSearch:'',
            // 多选
            checkAll: true,
            checkedUsers: [],
            userOptions:[],
            users: [],
            newOrigin:[],
            isIndeterminate: true,
            treeData:'',
            value: {
                deptId:0,
                pageNumber: 1,
                pageSize: 2000
            }
        }
    },
    mounted(){
        // console.log(this.userOptions)

        // this.roleForm = {
        //     name:'',
        //     des:'',
        //     role:[]
        // }
    },
    methods: {
        createData(){
            this.$emit('checkedMembers',this.newOrigin)
            this.$emit('formVisible',false)
            this.formVisible = false
            this.userOptions = []
            this.users=[]
            // this.checkedUsers=[]
            // this.newOrigin = []
        },
        dialogClose(){
            this.formVisible = false
            this.$emit('formVisible',false)
            this.userOptions = []
            this.users=[]
        },
        handleNodeClick(data) {
            this.$emit('treeNode', data.resourceName)
        },
        handleCheckAllChange(val) {
            // this.checkedUsers = val ? this.userOptions : []
            if(val){
                this.checkedUsers = this.userOptions
                let result = []

                for(let i = 0; i < this.userOptions.length; i++){
                    let obj = this.userOptions[i],
                        num = obj.userId,
                        isExist = false

                    for(let j = 0; j < this.newOrigin.length; j++){
                        let aj = this.newOrigin[j],
                            n = aj.userId

                        if(n === num){
                            isExist = true
                            break
                        }
                    }
                    if(!isExist){
                        result.push(obj)
                    }
                }
                this.newOrigin = [...this.newOrigin,...result]
                this.newOrigin = this.userOptions
            }else{
                this.checkedUsers = []
                this.newOrigin = []
            }
            this.isIndeterminate = false
        },
        handleCheckedCitiesChange(value) {
            console.log('value',value)
            // console.log('checkedUsers',this.checkedUsers)
            // console.log('newOrigin',this.newOrigin)

            let result = [],checkedCount = value.length

            for(let i = 0; i < value.length; i++){
                let obj = value[i],
                    num = obj.userId,
                    isExist = false

                for(let j = 0; j < this.newOrigin.length; j++){
                    let aj = this.newOrigin[j],
                        n = aj.userId

                    if(n === num){
                        isExist = true
                        break
                    }
                }
                if(!isExist){
                    result.push(obj)
                }
            }
            this.newOrigin = [...this.newOrigin,...result]

            this.checkAll = checkedCount === this.users.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.users.length
        },
        handleCheckSingle(value,data){
            console.log('value',value)
            console.log(data)
            // 用于反选。某一个选项在不选择的情况下，同时删除this.newOrigin渲染列表中对应的审批人
            this.newOrigin.forEach((item,index) => {
                if(item.userId === data.userId) {
                    this.newOrigin.splice(index,1)
                    return
                }
            })
        },
        getTreeData(val){
            this.treeData = val
            this.value.deptId = val.id
            this.getDeptUser(this.value)
        },
        // 根据部门id获取员工
        getDeptUser(value){
            this.$axios.getDeptUser(value).then(res => {
                if (res.status === 200 && res.data.code === 2000) {
                    this.userOptions = res.data.data.content
                    this.users = this.userOptions
                    this.checkedUsers = []
                    this.users.map(item=>{
                        this.newOrigin.map(checkedItem=>{
                            if(item.userId === checkedItem.userId){
                                this.checkedUsers.push(item)
                            }
                        })
                    })
                }
            })
        },
        userDelete(val){
            let newArr = []

            if(val.deptId){
                this.newOrigin.map(item=>{
                    if(item.userId*item.deptId !== val.userId*val.deptId){
                        newArr.push(item)
                    }
                })
            }else{
                this.newOrigin.map(item=>{
                    if(item.userId !== val.userId){
                        newArr.push(item)
                    }
                })
            }
            this.newOrigin = newArr

            // 重新勾选复选框
            this.checkedUsers = []
            this.users.map(item=>{
                this.newOrigin.map(checkedItem=>{
                    if(item.userId === checkedItem.userId){
                        this.checkedUsers.push(item)
                    }
                })
            })
        },
        // 根据名字搜索员工
        searchMember(){
            this.$axios.queryUser({userName:this.directorSearch}).then(res => {
                if (res.status === 200 && res.data.code === 2000) {
                    // console.log(res)
                    this.userOptions = res.data.data
                    this.users = this.userOptions
                    this.checkedUsers = []
                    this.users.map(item=>{
                        this.newOrigin.map(checkedItem=>{
                            if(item.userId === checkedItem.userId){
                                this.checkedUsers.push(item)
                            }
                        })
                    })
                }
            })
        }

    },
    beforeDestroy() {
        // this.formVisible = false
        // this.$emit('formVisible',false)
    },

    watch: {
        show: {
            handler(val) {
                this.formVisible = val
            },
            deep: true
        },
        originChecked:{
            handler(val) {
                // console.log('originChecked',val)
                // 保存一个已勾选的数组，用于渲染
                this.newOrigin = val
            },
            deep: true,
            immediate: true
        }
    }
}
</script>
<style scoped lang='scss'>
</style>

<style lang='scss'>
.add_members {
  .el-dialog__body {
    height: 400px;
  }
}
.director_top {
  overflow: hidden;
  clear: both;
  .director_top_left {
    width: 316px;
    border: 1px solid #cfdae5;
    overflow: auto;
    height: 330px;
    float: left;
  }
}
.director_bottom {
  border: 1px solid #cfdae5;
  height: 100px;
  width: 661px;
  margin-top: 5px;
  text-align: left;
  overflow: auto;
  span {
    margin: 4px 10px;
    display: inline-block;
    .director_close {
      cursor: pointer;
    }
    .el-icon-close:before {
      color: #000000 !important;
    }
  }
}
.director_top_right {
  float: left;
  margin-left: 5px;
  .search .el-input .el-input__inner {
    display: inline-block;
    height: 30px;
    width: 340px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    border: 1px solid #cfdae5;
    overflow: hidden;
    border-radius: 0;
  }
  .search_box {
    text-align: left;
    width: 340px;
    height: 298px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    border: 1px solid #cfdae5;
    overflow: hidden;
    padding: 5px;
    border-radius: 0;
    margin-top: 5px;
    .el-checkbox {
      display: block;
      clear: both;
      width: 100%;
      height: 22px;
    }
    .el-checkbox__input {
      float: right;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      float: left;
    }
  }
  .search {
    position: relative;
    i {
      position: absolute;
      right: 0;
      color: #999999;
      z-index: 2;
      right: 2px;
      top: 9px;
      height: 20px;
      cursor: pointer;
      width: 20px;
    }
  }
}
</style>
