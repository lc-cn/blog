<template>
  <el-menu collapse-transition class="c-menu" :default-active="$route.path" router>
    <el-menu-item index="/">返回首页</el-menu-item>
    <menuItem v-for="menu in menuStore.menus" :key="menu.id" :menu="menu">
    </menuItem>
  </el-menu>
</template>

<script setup lang="ts">
import {useMenuStore} from "@/store";
import MenuItem from './menuItem.vue'
const menuStore=useMenuStore()
</script>

<style lang="scss">
  .c-menu{
    &.el-menu{
      border-right-width: 0;
    }
  }
</style>