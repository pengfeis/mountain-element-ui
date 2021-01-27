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

    <el-dialog :title="dialogTitle" :visible.sync="addDialogVisible" :close-on-click-modal="false">
      <el-form ref="incomeRef" label-width="80px" size="mini" :rules="rules" :model="ioRecord">
        <el-form-item label="日期" prop="bizDate">
          <el-date-picker v-model="ioRecord.bizDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="科目" prop="categoryName">
          <el-select
            v-model="selectCategory"
            placeholder="请选择收支类型"
            popper-class="optionsContent"
            value-key="id"
            @change="selectCategoryChange($event)"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item"
            >
              <span style="float: left">{{ item.ioDesc }}</span>
              <span style="float: left">{{ item.name }}</span>
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="店铺" prop="storeId">
          <el-select
            v-model="selectStore"
            placeholder="请选择店铺"
            popper-class="optionsContent"
            value-key="id"
            @change="selectStoreChange($event)"
          >
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.storeName"
              :value="item"
            >
              <span style="float: left">{{ item.storeName }}</span>
              <span style="float: left">{{ item.storeManagerName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amt">
          <el-input v-model="ioRecord.amt" auto-complete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="commitEvent('incomeRef')">立即提交</el-button>
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

import { getIncomeAndExpendList, getTypeList, getCategoryList, addIncomeAndExpend } from '@/api/income'
import { findStoreList } from '@/api/store'

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
        'storeId': ''
      },
      ioItems: [],
      categoryList: [],
      storeList: [],
      typeList: [],
      searchText: '',
      startDate: '',
      endDate: '',
      selectType: '',
      selectCategory: [],
      selectStore: [],
      // 默认每页数据量
      pagesize: 10,
      // 当前页码
      currentPage: 1,
      // 查询的页码
      start: 1,
      // 默认数据总数
      totalCount: 1000,

      rules: {
        bizDate: [
          { required: true, message: '请输日期', trigger: 'blur' }
        ],
        categoryName: [
          { required: true, message: '请输昵称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在1 到 10 个字符', trigger: ['blur', 'change'] }
        ],
        storeId: [
          { required: true, message: '请选择店铺', trigger: ['blur', 'change'] }
        ],
        amt: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: ['blur', 'change'] }
        ]
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
      this.getStores()
    },

    handleAdd() {
      this.dialogTitle = '添加收支记录'
      this.showPassWordInput = 'block'
      this.passwordType = 'password'
      this.addDialogVisible = true
    },

    getIoList: function(event) {
      var that = this
      getIncomeAndExpendList({}).then(response => {
        that.ioItems = response.data
      })

      this.getTypeList()
      this.getCategoryList()
    },

    getTypeList: function(event) {
      var that = this
      getTypeList({}).then(response => {
        that.typeList = response.data
      })
    },
    getCategoryList: function(event) {
      var that = this
      getCategoryList({}).then(response => {
        that.categoryList = response.data
      })
    },
    getStores: function(event) {
      var that = this
      findStoreList({}).then(response => {
        that.storeList = response.data
      })
    },

    typeFormatter(row, column) {
      if (row.type === 1) {
        return '支出'
      } else {
        return '收入'
      }
    },

    commitEvent: function(incomeRef) {
      var that = this
      this.$refs[incomeRef].validate((valid) => {
        if (valid) {
          addIncomeAndExpend(that.ioRecord).then(response => {
            that.addDialogVisible = false
            that.getIoList()
            that.ioRecord = {
              'bizDate': '',
              'amt': '',
              'categoryId': '',
              'categoryName': '',
              'storeId': ''
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    selectStoreChange: function(e) {
      console.log('val...', e)
      this.ioRecord.storeId = e.id
    },

    selectCategoryChange: function(e) {
      console.log('val...', e)
      this.ioRecord.type = e.ioType
      this.ioRecord.categoryId = e.id
      this.ioRecord.categoryName = e.name
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

  .el-select-dropdown__item span{
    width:100px;
    text-align:left;
  }
</style>

