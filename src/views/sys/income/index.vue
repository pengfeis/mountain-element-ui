<template>
  <div>
    <h1 class="d2-mt-0">收支明细</h1>
    <el-row class="d2-mb">
      <el-form :inline="true">
        <el-form-item label="店铺名称">
          <el-input v-model.trim="searchText" type="text" placeholder="账号" />
        </el-form-item>
        <el-form-item label="收支">
          <el-select
            v-model="selectType"
            style="width:100%;"
            filterable
            multiple
            allow-create
            default-first-option
            placeholder="请选择收支类型"
          >
            <el-option
              v-for="item in typeList"
              :key="item.ioType"
              :label="item.desc"
              :value="item.ioType"
            />
          </el-select>

        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="startDate" type="date" placeholder="选择开始日期" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="endDate" type="date" placeholder="选择结束日期" size="medium" />
        </el-form-item>
        <el-form-item>
          <el-button @click="search">查询</el-button>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-dialog :title="添加记录" :visible.sync="addDialogVisible" :close-on-click-modal="false">
      <el-form ref="userRef" label-width="80px" size="mini" :rules="rules" :model="ioRecord">
        <el-form-item label="日期" prop="bizDate">
          <el-date-picker v-model="ioRecord.bizDate" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="科目" prop="categoryName">
          <el-input v-model="ioRecord.categoryName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="店铺" prop="storeId">
          <el-input v-model="ioRecord.storeId" auto-complete="off" />
        </el-form-item>
        <el-form-item label="金额" prop="amt">
          <el-input v-model="ioRecord.amt" auto-complete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="commitEvent('userRef')">立即提交</el-button>
          <el-button @click="addDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <div>
      <el-table :data="ioItems" style="width: 100%">
        <el-table-column prop="id" label="Id" />
        <el-table-column prop="bizDate" label="日期" />
        <el-table-column prop="storeName" label="店铺名称" />
        <el-table-column prop="type" label="收支" :formatter="typeFormatter" />
        <el-table-column prop="amount" label="金额" />
        <el-table-column prop="categoryName" label="类目" />
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div align="center">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>

import { getIncomeAndExpendList, getTypeList } from '@/api/income'

// import qs from 'qs'
export default {
  name: 'User',
  data() {
    return {

      addDialogVisible: false,

      dialogTitle: '新增',
      ioRecord: {
        'bizDate': '',
        'amt': '',
        'categoryId': '',
        'categoryName': '',
        'storeId': '',
        'stroeNmae': ''

      },
      ioItems: [],
      typeList: [],
      searchText: '',
      startDate: '',
      endDate: '',
      selectType: '',
      // 默认每页数据量
      pagesize: 10,
      // 当前页码
      currentPage: 1,
      // 查询的页码
      start: 1,
      // 默认数据总数
      totalCount: 1000,
      deptTreeData: [],
      deptTreeDialog: false,
      defaultExpandedKeys: ['-1'],
      defaultCheckedKeys: ['-1'],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: function(data, node) {
          if (node.childNodes.length > 0) {
            return true
          } else {
            return false
          }
        }
      }
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    // 搜索
    search: function() {
      this.getIoList(this.currentPage, this.pagesize)
    },

    handleAdd() {
      this.dialogTitle = '添加收支记录'
      this.showPassWordInput = 'block'
      this.passwordType = 'password'
      this.addDialogVisible = true
      this.user = { userId: 0, username: '', nickname: '', password: '', email: '', mobile: '', status: 1, deptId: '' }
      this.rolesSelect = []
    },

    getIoList: function(event) {
      var that = this
      getIncomeAndExpendList({}).then(response => {
        that.ioItems = response.data
      })

      this.getTypeList()
    },

    getTypeList: function(event) {
      var that = this
      getTypeList({}).then(response => {
        that.typeList = response.data
      })
    },

    typeFormatter(row, column) {
      if (row.type === 1) {
        return '支出'
      } else {
        return '收入'
      }
    },

    formatRoles(row, column) {
      var result = ''
      // 获取单元格数据
      const val = row[column.property]
      var temp = null
      for (var i = 0; i < val.length; i++) {
        temp = val[i]
        result = result + temp.roleName + '|'
      }
      return result
    },

    // 每页显示数据量变更
    handleSizeChange: function(val) {
      this.pagesize = val
      this.search()
    },

    // 页码变更
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.search()
    },
    saveParent: function() {
      this.currentNode = this.$refs.tree.getCheckedNodes()[0]
      this.deptTreeDialog = false
      this.user.deptId = this.currentNode.deptId
      this.user.deptName = this.currentNode.name
    }

  }
}
</script>

<style lang="scss" scoped>
$dark_gray:#889aa4;
.show-pwd {
  position: absolute;
  right: 10px;
  top: 0px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
</style>

