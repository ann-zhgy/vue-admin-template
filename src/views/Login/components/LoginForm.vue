<template>
  <el-tabs type="card" class="tabs-border" stretch>
    <el-tab-pane :label="t('views.home.login.loginWithPassword')" style="padding: 20px">
      <LoginByPasswordForm :login-post-handle="loginPostHandle" @to-register="toRegister" />
    </el-tab-pane>
    <el-tab-pane :label="t('views.home.login.loginWithCaptcha')" style="padding: 20px">
      <LoginByCaptchaForm :login-post-handle="loginPostHandle" @to-register="toRegister"
    /></el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { getSelfInfoApi } from '@/api/authorization/login'
import { RBACModelUserInfo, SimpleUserInfo } from '@/api/authorization/login/types'
import { AuthorizeModel, useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { onMounted, ref, watch } from 'vue'
import { RouteLocationNormalizedLoaded, RouteRecordRaw, useRouter } from 'vue-router'
import LoginByPasswordForm from './LoginByPasswordForm.vue'
import LoginByCaptchaForm from './LoginByCaptchaForm.vue'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()
const userStore = useUserStore()
const appStore = useAppStore()
const permissionStore = usePermissionStore()
const { currentRoute, addRoute, push } = useRouter()

onMounted(() => {
  if (userStore.token) {
    loginPostHandle(userStore.token)
  }
})

const redirect = ref<string>('')

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

const emit = defineEmits(['to-register'])
// 去注册页面
const toRegister = () => {
  emit('to-register')
}
const loginPostHandle = async (token: string) => {
  if (!token) {
    return
  }
  userStore.setToken(token)
  const userInfo = await getSelfInfoApi()
  if (!userInfo) {
    userStore.reset()
    return
  }
  userStore.setUserInfo(userInfo)

  // 是否使用动态路由
  if (!appStore.getDynamicRouter) {
    await permissionStore.generateRoutes('static').catch(() => {})
  } else {
    if (appStore.authorizeModel === AuthorizeModel.SIMPLE) {
      await permissionStore
        .generateRoutes(AuthorizeModel.SIMPLE, (userInfo as SimpleUserInfo).permission)
        .catch(() => {})
    } else if (appStore.authorizeModel === AuthorizeModel.RBAC) {
      await permissionStore
        .generateRoutes(AuthorizeModel.RBAC, (userInfo as RBACModelUserInfo).menus)
        .catch(() => {})
    } else {
      ElMessage.error('主题配置错误：请选择权限模式！')
      return
    }
  }
  permissionStore.getAddRouters.forEach((route) => {
    addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
  })
  permissionStore.setIsAddRouters(true)
  push({ path: redirect.value ?? permissionStore.getAddRouters[0].path })
}
</script>
<style lang="less" scoped>
.tabs-border {
  border-radius: 4px;
}
</style>
