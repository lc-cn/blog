<template>
  <el-sub-menu v-if="menu.children?.length" :index="getMenuPath(menu)">
    <template #title>
      <el-menu-item :index="getMenuPath(menu)">{{menu.name}}</el-menu-item>
    </template>
    <menu-item v-for="subMenu in menu.children" :menu="subMenu" :key="subMenu.id"/>
  </el-sub-menu>
  <el-menu-item v-else :index="getMenuPath(menu)">{{menu.name}}</el-menu-item>
</template>

<script setup lang="ts">
import {defineProps} from "vue";
import {WithChild,Category} from "@/types";
const name='menuItem';
const props=defineProps<{menu:WithChild<Category>}>()
const getMenuPath=(menu:WithChild<Category>)=>{
  return `/category/${menu.id}`
}
</script>
