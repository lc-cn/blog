<template>
  <div class="p-category-article-info">
    <div class="category-info">
      <div class="category-name">
        分类<el-tag size="small" type="success">{{ categoryInfo.name }}</el-tag>下的文章：
      </div>
    </div>
    <div class="article-list">
      <List :articles="categoryInfo.articles"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {List} from '@/components/article'
import {computed, onMounted, ref, watch, watchEffect} from "vue";
import {useRoute} from "vue-router";
import {useCategoryStore} from "@/store";
import {Tag} from "@/types";
import router from "@/router";
const categoryInfo=ref<Tag>({
  id:0,
  name:'',
  articles:[]
})
const route=computed(()=>useRoute())
const id=computed(()=>route.value.params.id)
const getCategoryWithArticles=async (id)=>{
  const {code, data} = await useCategoryStore().getCategoryWithArticles({id});
  if(code!==200) return
  if(!data) return
  categoryInfo.value=data
}
watchEffect(()=>{
  getCategoryWithArticles(Number(id.value))
})
</script>
