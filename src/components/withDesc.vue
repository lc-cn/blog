<template>
  <div class="c-with-desc">
    <slot/>
    <span class="prepend" v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </span>
    <span class="desc" :style="{minWidth:addUnit(minWidth)}">
      <slot name="desc">{{desc}}</slot>
    </span>
    <div v-if="$slots.append">
      <slot name="append"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
const addUnit=(str:string|number)=>{
  if(typeof str==='number'|| /^\d+$/.test(str)) return str+'px'
  return str
}
const props=withDefaults(defineProps<{
  desc:string,
  minWidth:string|number,
}>(),{
  desc:'',
  minWidth:'200px'
})
</script>

<style lang="scss">
  .c-with-desc{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    &>.desc,&>.prepend{
      display: inline-flex;
      align-items: center;
      margin-left: 30px;
    }
    &>.desc{
      color: #9FA2B4;
    }
  }
</style>