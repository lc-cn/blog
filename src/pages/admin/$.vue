<template>
  <div class="admin-layout">
    <el-container>
      <el-header>
        <c-header/>
      </el-header>
      <el-container>
        <el-aside width="120px">
          <c-menu/>
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import CMenu from '@/components/menus/index.vue'
import CHeader from '@/components/header/index.vue'
import {useMenuStore} from "@/store";
import {onMounted} from "vue";
const menuStore=useMenuStore()
onMounted(()=>{
  menuStore.init()
})
</script>
<style lang="scss">
.admin-layout{
  height: 100%;
  .el-container{
    height: 100%;
    .el-aside{
      border-right: 1px solid var(--el-menu-border-color);
    }
  }
}
</style>