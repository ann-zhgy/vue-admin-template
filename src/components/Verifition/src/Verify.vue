<script lang="tsx">
import { defineComponent, PropType } from 'vue'
import { CaptchaType } from './types'

export default defineComponent({
  name: 'Verify',
  props: {
    captchaType: {
      type: String as PropType<CaptchaType>,
      default: () => CaptchaType.SLIDER
    }
  },
  emits: ['next'],
  setup(props, { emit }) {
    // config 对象为TAC验证码的一些配置和验证的回调
    const config = {
      // 生成接口 (必选项,必须配置, 要符合tianai-captcha默认验证码生成接口规范)
      requestCaptchaDataUrl: `http://localhost:8080/captcha/get?captchaType=${props.captchaType}`,
      // 验证接口 (必选项,必须配置, 要符合tianai-captcha默认验证码校验接口规范)
      validCaptchaUrl: 'http://localhost:8080/captcha/check',
      // 验证码绑定的div块 (必选项,必须配置)
      bindEl: '#captcha-box',
      // 验证成功回调函数(必选项,必须配置)
      validSuccess: (_res, _c, tac) => {
        // 销毁验证码服务
        tac.destroyWindow()
        // console.log('验证成功，后端返回的数据为', res)
        // 调用具体的login方法
        emit('next')
      },
      // 验证失败的回调函数(可忽略，如果不自定义 validFail 方法时，会使用默认的)
      validFail: (_res, _c, tac) => {
        console.log('验证码验证失败回调...')
        // 验证失败后重新拉取验证码
        tac.reloadCaptcha()
      },
      // 刷新按钮回调事件
      btnRefreshFun: (_el, tac) => {
        console.log('刷新按钮触发事件...')
        tac.reloadCaptcha()
      },
      // 关闭按钮回调事件
      btnCloseFun: (_el, tac) => {
        console.log('关闭按钮触发事件...')
        tac.destroyWindow()
      }
    }
    // 一些样式配置， 可不传
    let style = {
      // 按钮样式
      btnUrl: 'https://minio.tianai.cloud/public/captcha-btn/btn3.png',
      // 背景样式
      bgUrl: 'https://minio.tianai.cloud/public/captcha-btn/btn3-bg.jpg',
      // logo地址
      logoUrl: 'https://minio.tianai.cloud/public/static/captcha/images/logo.png',
      // 滑动边框样式
      moveTrackMaskBgColor: '#f7b645',
      moveTrackMaskBorderColor: '#ef9c0d'
    }
    // 参数1 为 tac文件是目录地址， 目录里包含 tac的js和css等文件
    // 参数2 为 tac验证码相关配置
    // 参数3 为 tac窗口一些样式配置
    window
      .initTAC('./tac', config, style)
      .then((tac) => {
        tac.init() // 调用init则显示验证码
      })
      .catch((e) => {
        console.log('初始化tac失败', e)
      })
    return () => <div id="captcha-box"></div>
  }
})
</script>
