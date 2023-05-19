<template>
  <el-menu collapse-transition class="c-menu" :default-active="$route.path" router>
    <menuItem v-for="category in menuStore.categories" :key="category.id" :menu="category">
    </menuItem>
  </el-menu>
</template>

<script setup lang="ts">
import {useCategoryStore} from "@/store";
import MenuItem from './menuItem.vue'
import {onMounted} from "vue";
const menuStore=useCategoryStore()
onMounted(()=>{
  menuStore.init()
})
</script>

<style lang="scss">
  .c-menu{
    &.el-menu{
      border-right-width: 0;
    }
  }
</style>