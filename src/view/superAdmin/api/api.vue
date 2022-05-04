<template>
  <div>
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button size="small" type="primary" icon="plus" @click="addApi(0)">新增API</el-button>
      </div>

      <!-- 由于此处菜单跟左侧列表一一对应所以不需要分页 pageSize默认999 -->
      <el-table :data="tableData" row-key="id">
        <el-table-column align="left" label="ID" min-width="100" prop="id" />
        <el-table-column align="left" label="API名称" show-overflow-tooltip min-width="160" prop="title" />
        <el-table-column align="left" label="API路由" show-overflow-tooltip min-width="160" prop="url" />
        <el-table-column align="left" label="api类型" min-width="100" prop="hidden">
          <template #default="scope">
            <span>{{ scope.row.type==1?"菜单API":"功能API" }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="父节点" min-width="90" prop="pid" />
        <el-table-column align="left" label="请求方式" min-width="100" prop="method">
          <template #default="scope">
            <span>{{ scope.row.method === 1?"GET":"POST" }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="状态" min-width="100" prop="status">
          <template #default="scope">
            <span>{{ scope.row.status?"正常":"禁用" }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="图标" min-width="140" prop="icon">
          <template #default="scope">
            <div v-if="scope.row.icon" class="icon-column">
              <el-icon>
                <component :is="scope.row.icon" />
              </el-icon>
              <span>{{ scope.row.icon }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="排序" min-width="70" prop="sort" />
        <el-table-column align="left" label="更新时间" min-width="180">
          <template #default="scope">{{ formatDate(scope.row.updated_at) }}</template>
        </el-table-column>
        <el-table-column align="left" fixed="right" label="操作" width="300">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              icon="plus"
              @click="addApi(scope.row.id)"
            >添加子菜单</el-button>
            <el-button
              size="small"
              type="text"
              icon="edit"
              @click="editApiFunc(scope.row)"
            >编辑</el-button>
            <el-button
              size="small"
              type="text"
              icon="delete"
              @click="deleteMenu(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogFormVisible" :title="dialogTitle">
      <el-form ref="authorityForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级API" prop="parent_id">
          <el-select v-model="form.pid" placeholder="请选择" style="width:100%">
            <el-option
                v-for="item in APIOption"
                :key="item.id"
                :label="`${item.title}`"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="play" label="ID" prop="id">
          <el-input v-model="form.id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="API名称" prop="title" required>
          <el-input v-model="form.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="API路由" prop="url">
          <el-input v-model="form.url" autocomplete="off" />
        </el-form-item>
        <el-form-item label="API类型" prop="type" style="width:30%" required>
          <el-radio-group v-model="form.type">
            <el-radio :label="1">菜单API</el-radio>
            <el-radio :label="2">功能API</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="API类型" prop="method" style="width:30%" required>
          <el-radio-group v-model="form.method">
            <el-radio :label="1">GET</el-radio>
            <el-radio :label="2">POST</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" prop="status" style="width:30%" required>
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="closeDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="enterDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  getApiList,
  updateApi,
  createApi,
  deleteApi
} from '@/api/api'
import { reactive, ref } from 'vue'
import { formatDate } from '@/utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'

const rules = reactive({
  // path: [{ required: true, message: '请输入菜单name', trigger: 'blur' }],
  // component: [
  //   { required: true, message: '请输入文件路径', trigger: 'blur' }
  // ],
  // 'title': [
  //   { required: true, message: '请输入菜单展示名称', trigger: 'blur' }
  // ]
})

const page = ref(1)
const total = ref(0)
const pageSize = ref(999)
const tableData = ref([])
// 查询
const getTableData = async() => {
  const table = await getApiList()
  if (table.code === 200) {
    var data = []
    table.data.forEach(item => {
      if (item.method === 'POST') {
        item.method = 2
      } else {
        item.method = 1
      }
      data.push(item)
    })
    tableData.value = data
    total.value = 0
    page.value = 1
    pageSize.value = 1
  }
}
getTableData()

const form = ref({
  id: 0,
  pid: 0,
  type: 1,
  title: '',
  url: '',
  method: 1,
  icon: '',
  sort: 99,
  status: 2,
  remark: '',
})
// 删除菜单
const deleteMenu = (id) => {
  ElMessageBox.confirm('此操作将永久删除所有角色下该菜单, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async() => {
      const res = await deleteApi({ 'id': id })
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: '删除成功!'
        })
        if (tableData.value.length === 1 && page.value > 1) {
          page.value--
        }
        getTableData()
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      })
    })
}
const checkFlag = ref(false)
const initForm = () => {
  checkFlag.value = false
  // menuForm.value.resetFields()
  form.value = {
    id: 0,
    pid: 0,
    type: 1,
    title: '',
    url: '',
    method: 1,
    icon: '',
    sort: 99,
    status: 2,
    remark: '',
  }
}

const dialogFormVisible = ref(false)
// 关闭弹窗
const closeDialog = () => {
  initForm()
  dialogFormVisible.value = false
}
// 添加api菜单
const enterDialog = async() => {
  if (form.value.method === 1) {
    form.value.method = 'GET'
  } else {
    form.value.method = 'POST'
  }
  let res
  if (isEdit.value) {
    res = await updateApi(form.value)
  } else {
    res = await createApi(form.value)
  }
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: isEdit.value ? '编辑成功' : '添加成功!'
    })
    getTableData()
  }
  initForm()
  dialogFormVisible.value = false
}

const APIOption = ref([
  {
    id: 0,
    title: '顶级API'
  }
])
const setOptions = () => {
  APIOption.value = [
    {
      id: 0,
      title: '顶级API'
    }
  ]
  setMenuOptions(tableData.value, APIOption.value, false)
}
const setMenuOptions = (menuData, optionsData, disabled) => {
  menuData &&
        menuData.forEach(item => {
          const option = {
            title: item.title,
            id: item.id,
            disabled: disabled || item.id === form.value.id
          }
          optionsData.push(option)
        })
}

// 添加菜单方法，id为 0则为添加根菜单
const isEdit = ref(false)
const dialogTitle = ref('新增菜单')
const addApi = (id) => {
  dialogTitle.value = '新增菜单'
  initForm()
  form.value.pid = id
  isEdit.value = false
  setOptions()
  dialogFormVisible.value = true
}
// 修改API方法
const editApiFunc = async(row) => {
  setOptions()
  form.value = row
  isEdit.value = true
  dialogTitle.value = '编辑菜单'
  dialogFormVisible.value = true
}

</script>

<style scoped lang="scss">
.warning {
  color: #dc143c;
}
.icon-column{
  display: flex;
  align-items: center;
  .el-icon{
    margin-right: 8px;
  }
}
</style>
