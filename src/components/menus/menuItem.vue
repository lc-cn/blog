<template>
  <el-sub-menu v-if="menu.type===1" :index="menu.path">
    <template #title>{{menu.name}}</template>
    <menu-item v-for="subMenu in menu.children" :menu="subMenu" :key="subMenu.id"/>
  </el-sub-menu>
  <el-menu-item v-else-if="menu.type===2" :index="menu.path">{{menu.name}}</el-menu-item>
</template>

<script setup lang="ts">
import {defineProps} from "vue";
import {WithChild,Menu} from "@/types";
const name='menuItem';
const props=defineProps<{menu:WithChild<Menu>}>()
</script>
