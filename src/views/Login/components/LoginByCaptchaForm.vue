<script setup lang="tsx">
import { PropType, reactive, ref, unref } from 'vue'
import { Form, FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElInput, ElLink } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { loginByCapthaApi, sendCaptchaApi } from '@/api/authorization/login'
import { LoginCaptchaRequest } from '@/api/authorization/login/types'
import { useValidator } from '@/hooks/web/useValidator'
import { Icon } from '@/components/Icon'
import { BaseButton } from '@/components/Button'
import { VerifyComponent } from '@/components/Verifition/src/types'

const { required, email, phone, emailOrPhone } = useValidator()

const props = defineProps({
  loginPostHandle: {
    type: Function as PropType<(token: string) => void>,
    required: true
  }
})

const emit = defineEmits(['to-register'])

const { t } = useI18n()

const rules = {
  username: [required(), emailOrPhone()],
  captcha: [required()]
}

const getCodeTime = ref(60)
const getCodeLoading = ref(false)
const getCode = async () => {
  const formRef = await getElFormExpose()
  formRef?.validateField(['captcha'], async (isValid) => {
    if (!isValid) {
      return
    }
    const formData = await getFormData<LoginCaptchaRequest>()
    if (email(formData.username!)) {
      await sendCaptchaApi({ email: formData.username })
    } else if (phone(formData.username!)) {
      await sendCaptchaApi({ phone: formData.username })
    } else {
      throw new Error('')
    }
    getCodeLoading.value = true
    const timer = setInterval(() => {
      getCodeTime.value--
      if (getCodeTime.value <= 0) {
        clearInterval(timer)
        getCodeTime.value = 60
        getCodeLoading.value = false
      }
    }, 1000)
  })
}

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => (
          <h2 class="text-2xl font-bold text-center w-[100%]">{t('views.home.login.title')}</h2>
        )
      }
    }
  },
  {
    field: 'username',
    label: t('views.home.login.byCaptcha.username'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('views.home.login.byCaptcha.usernamePlaceholder')
    }
  },
  {
    field: 'captcha',
    label: t('views.home.login.byCaptcha.captcha'),
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: (formData) => {
          return (
            <div class="w-[100%] flex">
              <ElInput
                v-model={formData.code}
                placeholder={t('views.home.login.byCaptcha.captchaPlaceholder')}
              />
              <BaseButton
                type="primary"
                disabled={unref(getCodeLoading)}
                class="ml-10px"
                onClick={getCode}
              >
                {t('views.home.login.byCaptcha.sendCaptchaButton')}
                {unref(getCodeLoading) ? `(${unref(getCodeTime)})` : ''}
              </BaseButton>
            </div>
          )
        }
      }
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between items-center w-[100%]">
                <div style="float:left" />
                <ElLink type="primary" underline={false} onClick={toRegister} style="float:right">
                  {t('views.home.login.register')}
                </ElLink>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="w-[100%]">
                <BaseButton
                  loading={loading.value}
                  type="primary"
                  class="w-[100%]"
                  onClick={signIn}
                >
                  {t('views.home.login.login')}
                </BaseButton>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'other',
    component: 'Divider',
    label: t('views.home.login.otherLogin'),
    componentProps: {
      contentPosition: 'center'
    }
  },
  {
    field: 'otherIcon',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between w-[100%]">
                <Icon
                  icon="ant-design:github-filled"
                  size={iconSize}
                  class="cursor-pointer ant-icon"
                  color={iconColor}
                  hoverColor={hoverColor}
                />
                <Icon
                  icon="ant-design:wechat-filled"
                  size={iconSize}
                  class="cursor-pointer ant-icon"
                  color={iconColor}
                  hoverColor={hoverColor}
                />
                <Icon
                  icon="ant-design:alipay-circle-filled"
                  size={iconSize}
                  color={iconColor}
                  hoverColor={hoverColor}
                  class="cursor-pointer ant-icon"
                />
                <Icon
                  icon="ant-design:weibo-circle-filled"
                  size={iconSize}
                  color={iconColor}
                  hoverColor={hoverColor}
                  class="cursor-pointer ant-icon"
                />
              </div>
            </>
          )
        }
      }
    }
  }
])

const iconSize = 30

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

const loading = ref(false)

const iconColor = '#999'

const hoverColor = 'var(--el-color-primary)'

const verifyRef = ref<VerifyComponent | null>(null)

// 登录
const signIn = async () => {
  const formRef = await getElFormExpose()
  await formRef?.validate(async (isValid) => {
    if (!isValid) {
      return
    }
    verifyRef.value?.init()
  })
}

const doSignIn = async () => {
  loading.value = true
  const formData = await getFormData<LoginCaptchaRequest>()

  try {
    const res = await loginByCapthaApi(formData)
    props.loginPostHandle(res.token)
  } finally {
    loading.value = false
  }
}

// 去注册页面
const toRegister = () => {
  emit('to-register')
}
</script>

<template>
  <Form
    :schema="schema"
    :rules="rules"
    label-position="top"
    hide-required-asterisk
    size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
    @register="formRegister"
  />
  <verify ref="verifyRef" @next="doSignIn" />
</template>
