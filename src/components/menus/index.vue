<template>
  <el-menu class="c-menu" :default-active="$route.path" router>
    <el-menu-item index="/">返回首页</el-menu-item>
    <el-menu-item v-for="menu in menuStore.menus" :key="menu.id" :index="menu.path">
      {{menu.name}}
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import {useMenuStore} from "@/store";
const menuStore=useMenuStore()
</script>

<style lang="scss">
  .c-menu{
    &.el-menu{
      border-right-width: 0;
    }
  }
</style>