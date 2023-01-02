<template>
  <div class="default-layout">
    <el-container>
      <el-header>
        <c-header/>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <category/>
        </el-aside>
        <el-container>
          <el-main>
            <RouterView/>
          </el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import {onMounted} from "vue";
import {useSystemStore} from "@/store";
import CHeader from '@/components/header/index.vue'
import Category from '@/components/category/index.vue'

const systemStore=useSystemStore()
onMounted(async ()=>{
  await systemStore.init()
})
</script>
<style lang="scss">
.default-layout{
  height: 100%;
  &>.el-container{
    height: 100%;
  }
}
</style>