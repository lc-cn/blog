<template>
  <div class="p-article">
    文章详情
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted} from "vue";
import {useRoute} from "vue-router";
import {useArticleStore} from "@/store";

const id=computed(()=>Number(useRoute().params.id))
onMounted(async ()=>{
  const {code,data}=await useArticleStore().getArticleInfo({id:id.value})
  if(code!==200) return
  if(!data) return
  console.log(data)
})
</script>

<style scoped>

</style>