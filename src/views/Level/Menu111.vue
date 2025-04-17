<script setup lang="ts">
import { ref } from 'vue'
import { random } from 'lodash-es'
import { EditableTable, EditableTableColumn } from '@/components/EditableTable'
import { ElMessage } from 'element-plus'
import { CaptchaType, VerifyComponent } from '@/components/Verifition/src/types'

defineOptions({
  name: 'Menu111'
})

const text = ref('')

let tableData = ref([
  { title: 'title1', content: 'content1' },
  { title: 'title2', content: 'content2' },
  { title: 'title3', content: 'content3' }
])

const addRow = () => {
  tableData.value.push({ title: 'title' + random(), content: 'content' + random() })
}
const changeTable = () => {
  tableData.value = [
    { title: 'fasd', content: '3' },
    { title: 'gdfg', content: '4' },
    { title: 'wew', content: '5454' }
  ]
}

const verifyRef = ref<VerifyComponent | null>(null)
const initVerify = () => {
  verifyRef.value?.init()
}
</script>

<template>
  <content-wrap title="menu111">
    <div class="flex items-center"> Menu111: <ElInput v-model="text" class="pl-20px" /> </div>
  </content-wrap>
  <div style="margin-top: 24px">
    <el-button @click="initVerify">校验器</el-button>
    <verify
      ref="verifyRef"
      :captcha-type="CaptchaType.WORD_IMAGE_CLICK"
      @next="ElMessage.info('success')"
    />
  </div>
  <div style="margin-top: 24px">
    <el-row>
      <el-table border v-model:data="tableData">
        <el-table-column prop="title" label="标题" />
      </el-table>
    </el-row>
    <el-row>
      <el-button @click="addRow">添加元素</el-button>
      <el-button @click="changeTable">更新表</el-button>
    </el-row>
    <el-row>
      <el-col :span="12">
        <editable-table border :data="tableData">
          <editable-table-column prop="title" label="title" :rules="[{ min: 5, required: true }]">
            <template #edit="scope">
              <el-input v-model="scope.row.title" placeholder="ip:port" style="width: 100%" />
            </template>
          </editable-table-column>
          <editable-table-column prop="content" label="content">
            <template #edit="scope">
              <el-input v-model="scope.row.content" placeholder="ip:port" style="width: 100%" />
            </template>
          </editable-table-column>
          <editable-table-column label="操作">
            <template #default="scope">
              <el-button @click="console.log(scope.row)">详情</el-button>
            </template>
          </editable-table-column>
        </editable-table>
      </el-col>
      <el-col :span="12">
        <el-card>{{ tableData }}</el-card>
      </el-col>
    </el-row>
  </div>
</template>
