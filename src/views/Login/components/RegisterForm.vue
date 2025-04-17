<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import { ElButton, ElLink, FormRules } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { registerApi } from '@/api/authorization/login'
import { RegisterRequest } from '@/api/authorization/login/types'
import { VerifyComponent } from '@/components/Verifition/src/types'
import { IAgree } from '@/components/IAgree'

const emit = defineEmits(['to-login'])

const { formRegister, formMethods } = useForm()
const { getElFormExpose, getFormData } = formMethods

const { t } = useI18n()

const { required, check } = useValidator()

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
            <h2 class="text-2xl font-bold text-center w-[100%]">
              {t('views.home.register.title')}
            </h2>
          )
        }
      }
    }
  },
  {
    field: 'username',
    label: t('views.home.register.username'),
    value: '',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('views.home.register.usernamePlaceholder')
    }
  },
  {
    field: 'password',
    label: t('views.home.register.password'),
    value: '',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      strength: true,
      placeholder: t('views.home.register.passwordPlaceholder')
    }
  },
  {
    field: 'check_password',
    label: t('views.home.register.checkPassword'),
    value: '',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      strength: true,
      placeholder: t('views.home.register.checkPasswordPlaceholder')
    }
  },
  {
    field: 'email',
    label: t('views.home.register.email'),
    value: '',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('views.home.register.emailPlaceholder')
    }
  },
  {
    field: 'phone',
    label: t('views.home.register.phone'),
    value: '',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('views.home.register.phonePlaceholder')
    }
  },
  {
    field: 'iAgree',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: (formData: RegisterRequest) => {
          return (
            <>
              <div class="flex justify-between items-center w-[100%]" style="width: 480px;">
                <IAgree
                  style="float:left"
                  v-model={formData.iAgree}
                  text="我同意《用户协议》"
                  link={[
                    {
                      text: '《用户协议》',
                      url: 'https://element-plus.org/'
                    }
                  ]}
                />
                <ElLink type="primary" underline={false} onClick={toLogin} style="float:right">
                  {t('views.home.register.hasUser')}
                </ElLink>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'register',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="w-[100%]">
                <ElButton
                  type="primary"
                  class="w-[100%]"
                  loading={loading.value}
                  onClick={register}
                >
                  {t('views.home.register.register')}
                </ElButton>
              </div>
            </>
          )
        }
      }
    }
  }
])

const rules: FormRules = {
  username: [required()],
  password: [required()],
  check_password: [required()],
  code: [required()],
  iAgree: [required(), check()]
}

const toLogin = () => {
  emit('to-login')
}

const loading = ref(false)

const verifyRef = ref<VerifyComponent | null>(null)

const register = async () => {
  const formRef = await getElFormExpose()
  formRef?.validate(async (valid) => {
    if (!valid) {
      return
    }
    verifyRef.value?.init()
  })
}

const doRegist = async () => {
  loading.value = true
  try {
    const formData = await getFormData<RegisterRequest>()
    registerApi(formData).then(toLogin)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <content-wrap style="border: none">
    <Form
      :schema="schema"
      :rules="rules"
      label-position="top"
      hide-required-asterisk
      size="large"
      class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
      @register="formRegister"
    />
    <verify ref="verifyRef" @next="doRegist" />
  </content-wrap>
</template>
