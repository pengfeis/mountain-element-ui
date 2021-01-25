<template>
  <div>
    <h1 class="d2-mt-0">店铺管理</h1>
    <el-row class="d2-mb" :gutter="10">
      <el-col :span="6">
        <el-input v-model="searchText" type="text" placeholder="部门名称" :disabled="true" />
      </el-col>
      <el-col :span="18">
        <el-button @click="getStores">查询</el-button>
        <el-button type="primary" @click="handleAdd()">新增</el-button>
      </el-col>
    </el-row>

    <!-- el-table -->
    <el-table :data="storeList" row-key="deptId" border :tree-props="{children: 'children'}">
      <el-table-column prop="id" label="店铺ID" />
      <el-table-column prop="storeName" label="店铺名称" />
      <el-table-column prop="storeManagerId" label="运营id" />
      <el-table-column prop="storeManagerName" label="运营姓名" />
      <el-table-column prop="memo" label="说明" />
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="addDialogVisible" :close-on-click-modal="false">
      <el-form label-width="80px" size="mini">
        <el-form-item label="店铺名称">
          <el-input v-model="store.storeName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="运营用户" prop="users">
          <el-select
            v-model="rolesSelect"
            style="width:100%;"
            filterable
            allow-create
            default-first-option
            placeholder="请选择用户"
            @change="rolesSelectChange"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.username"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="commitEvent">立即提交</el-button>
          <el-button @click="addDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import util from '@/libs/util.js'
import { findStoreList, addStore, deleteStore } from '@/api/store'

export default {
  name: 'Dept',
  data() {
    return {
      dialogTitle: '新增',
      searchText: '',
      addDialogVisible: false,
      store: {
        storeName: '',
        managerId: 0,
        managerName: '',
        memo: ''
      },
      userParam: {
        userId: 0,
        username: '',
        nickname: '',
        password: '',
        deptName: '',
        email: '',
        mobile: '',
        status: '1',
        deptId: '',
        roleList: [],
        menuList: [],
        roles: [],
        pageNum: 1,
        pageSize: 10
      },
      users: [],
      storeList: [],
      rolesSelect: []
    }
  },
  mounted() {
    this.getStores()
    this.getUsers(1, 10)
  },
  methods: {
    getUsers: function(pageNum, pageSize) {
      const that = this
      this.userParam.pageNum = pageNum
      this.userParam.pageSize = pageSize

      this.$store
        .dispatch('user/list', that.userParam)
        .then(datas => {
          that.users = datas.list
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleAdd() {
      this.addDialogVisible = true
      this.dept = {
        deptId: 0,
        parentId: -1,
        parentName: '一级部门',
        name: '',
        orderNum: 0,
        delFlag: 0
      }
    },
    handleEdit: function(index, row) {
      var that = this
      that.dialogTitle = '编辑'
      that.addDialogVisible = true
      that.dept = row
    },
    getStores: function(event) {
      var that = this
      findStoreList({}).then(response => {
        that.storeList = response.data
      })
    },
    toggleExpanded: function(trIndex) {
      console.log(trIndex)
      const record = this.storeList[trIndex]
      record._expanded = !record._expanded
      console.log(this.storeList)
    },
    rolesSelectChange: function(val) {
      console.log('rolesSelectChange...', val)
      this.rolesSelect = val
      console.log('user.roles...', this.user.roles)
    },
    addStore: function(event) {
      var that = this
      this.dialogTitle = '新增'
      addStore(that.store).then(response => {
        that.getStores()
        that.addDialogVisible = false
      })
    },

    commitEvent: function() {
      this.addStore()
    },
    handleDelete: function(index, row) {
      var that = this

      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteStore({ deptId: row.storeId }).then(response => {
          if (response) {
            that.$message({
              type: 'success',
              message: '删除成功!'
            })
            that.getStores()
          }
        })
      })
        .catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
