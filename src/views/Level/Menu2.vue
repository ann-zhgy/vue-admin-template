<script setup lang="ts">
import { ElInput } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { ref } from 'vue'

defineOptions({
  name: 'Menu2'
})

const text = ref('')
</script>

<template>
  <ContentWrap title="menu2">
    <div class="flex items-center"> Menu2: <ElInput v-model="text" class="pl-20px" /> </div>
  </ContentWrap>
</template>
