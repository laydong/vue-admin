<template>
  <div>
    <div class="clearflex">
      <el-button class="fl-right" size="small" type="primary" @click="authApiEnter">确 定</el-button>
    </div>
    <el-tree
      ref="apiTree"
      :data="apiTreeData"
      :default-checked-keys="apiTreeIds"
      :props="apiDefaultProps"
      default-expand-all
      highlight-current
      node-key="id"
      show-checkbox
      @check="nodeChange"
    />
  </div>
</template>
<script>
export default {
  name: 'Apis',
}
</script>

<script setup>
import { getAllApis } from '@/api/api'
import { UpdateCasbin, getAuthorityId } from '@/api/casbin'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
// eslint-disable-next-line no-undef
const props = defineProps({
  row: {
    default: function() {
      return {}
    },
    type: Object
  }
})

const apiDefaultProps = ref({
  children: 'children',
  label: function(data) {
    return data.title
  }
})

const apiTreeData = ref([])
const apiTreeIds = ref([])
// const activeUserId = ref('')
const init = async() => {
  const res2 = await getAllApis()
  apiTreeData.value = res2.data
  const res = await getAuthorityId(props.row.id)
  apiTreeIds.value = res.data
}

init()

const needConfirm = ref(false)
const nodeChange = () => {
  needConfirm.value = true
}
// 暴露给外层使用的切换拦截统一方法
// const enterAndNext = () => {
//   authApiEnter()
// }
// 关联关系确定
const apiTree = ref(null)
const authApiEnter = async() => {
  const checkArr = apiTree.value.getCheckedNodes(true)
  const arr = []
  checkArr.forEach(item => {
    arr.push(Number(item.id))
  })
  const res = await UpdateCasbin({
    role_id: props.row.id,
    ids: arr
  })
  if (res.code === 200) {
    ElMessage({ type: 'success', message: 'api设置成功' })
  }
}

// defineExpose({
//   needConfirm,
//   enterAndNext
// })

</script>
