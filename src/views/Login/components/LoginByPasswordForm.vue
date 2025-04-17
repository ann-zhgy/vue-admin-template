<script setup lang="tsx">
import { PropType, reactive, ref } from 'vue'
import { Form, FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElLink } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { loginByPasswordApi } from '@/api/authorization/login'
import { LoginPasswordRequest } from '@/api/authorization/login/types'
import { useValidator } from '@/hooks/web/useValidator'
import { Icon } from '@/components/Icon'
import { BaseButton } from '@/components/Button'
import { VerifyComponent } from '@/components/Verifition/src/types'

const { required } = useValidator()

const props = defineProps({
  loginPostHandle: {
    type: Function as PropType<(token: string) => void>,
    required: true
  }
})

const emit = defineEmits(['to-register'])

const { t } = useI18n()

const rules = {
  username: [required()],
  password: [required()]
}

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <h2 class="text-2xl font-bold text-center w-[100%]">{t('views.home.login.title')}</h2>
          )
        }
      }
    }
  },
  {
    field: 'username',
    label: t('views.home.login.byPassword.username'),
    // value: 'admin',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('views.home.login.byPassword.usernamePlaceholder')
    }
  },
  {
    field: 'password',
    label: t('views.home.login.byPassword.password'),
    // value: 'admin',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: t('views.home.login.byPassword.passwordPlaceholder'),
      on: {
        keyDown: (event: KeyboardEvent) => {
          if (event.key === 'Enter') {
            event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true)
            signIn()
          }
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
                <ElLink type="primary" underline={false} style="float:left">
                  {t('views.home.login.byPassword.forgetPassword')}
                </ElLink>
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
  const formData = await getFormData<LoginPasswordRequest>()

  try {
    const res = await loginByPasswordApi(formData)
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
