<template>
  <el-sub-menu ref="subMenu" :index="routerInfo.name">
    <template #title>
      <el-icon v-if="routerInfo.icon">
        <component :is="routerInfo.icon" />
      </el-icon>
      <span>{{ routerInfo.title }}</span>
    </template>
    <slot />
  </el-sub-menu>
</template>

<script>
export default {
  name: 'AsyncSubmenu',
}
</script>

<script setup>
defineProps({
  routerInfo: {
    default: function() {
      return null
    },
    type: Object
  }
})
</script>
