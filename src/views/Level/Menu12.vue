<template>
  <ContentWrap title="menu12" style="height: 1000px">
    <ElUpload ref="upload" action="alert" :auto-upload="false" @change="loadFromFile">
      <el-button>选取文件</el-button>
    </ElUpload>
    <mol-3d-viewer
      :div-props="{ backgroundColor: 'antiquewhite', height: '800px', width: '100%' }"
      :file="uploadFile?.raw"
      :file-type="fileType"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { ref } from 'vue'
import { ElUpload, UploadUserFile } from 'element-plus'
import { SupportedType } from '@/components/Mol3dViewer/src/types'

defineOptions({
  name: 'Menu12'
})

const upload = ref(null)
const uploadFile = ref<UploadUserFile>()
const fileType = ref<SupportedType>()

function loadFromFile(file) {
  const fileSplit: string[] = file.name.split('.')
  console.log(file)
  console.log(fileSplit)
  fileType.value = fileSplit[fileSplit.length - 1] as SupportedType
  uploadFile.value = file
}
</script>
