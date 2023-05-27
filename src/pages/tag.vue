<template>
  <div class="p-tag-article-info">
    <div class="tag-info">
      <div class="tag-name">
        标签<el-tag size="small" type="success">{{ tagInfo.name }}</el-tag>下的文章：
      </div>
    </div>
    <div class="article-list">
      <List :articles="tagInfo.articles"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {List} from '@/components/article'
import {computed, onMounted, ref, watchEffect} from "vue";
import {useRoute} from "vue-router";
import {useTagStore} from "@/store";
import {Tag} from "@/types";
const tagInfo=ref<Tag>({
  id:0,
  name:'',
  articles:[]
})

const id=computed(()=>route.value.params.id)
const route=computed(()=>useRoute())
const getTagWithArticles=async (id)=>{
  const {code, data} = await useTagStore().getTagWithArticles({id});
  if(code!==200) return
  if(!data) return
  tagInfo.value=data
}
watchEffect(()=>{
  getTagWithArticles(Number(id.value))
})
</script>
