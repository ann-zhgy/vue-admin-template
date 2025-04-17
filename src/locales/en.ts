export default {
  common: {
    login: 'Login',
    loginOut: 'Login out',
    document: 'Document',
    reminder: 'Reminder',
    loginOutMessage: 'Exit the system?',
    back: 'Back',
    ok: 'OK',
    cancel: 'Cancel',
    reload: 'Reload current',
    closeTab: 'Close current',
    closeTheLeftTab: 'Close left',
    closeTheRightTab: 'Close right',
    closeOther: 'Close other',
    closeAll: 'Close all',
    query: 'Query',
    reset: 'Reset',
    shrink: 'Put away',
    expand: 'Expand',
    delMessage: 'Delete the selected data?',
    delWarning: 'Warning',
    delOk: 'OK',
    delCancel: 'Cancel',
    delNoData: 'Please select the data to delete',
    delSuccess: 'Deleted successfully',
    operation: 'operation',
    status: '状态',
    statusDesc: {
      enable: 'enable',
      disable: 'disable'
    }
  },
  components: {
    lock: {
      lockScreen: 'Lock screen',
      lock: 'Lock',
      lockPassword: 'Lock screen password',
      unlock: 'Click to unlock',
      backToLogin: 'Back to login',
      entrySystem: 'Entry the system',
      placeholder: 'Please enter the lock screen password',
      message: 'Lock screen password error'
    },
    error: {
      noPermission: "Sorry, you don't have permission to access this page.",
      pageError: 'Sorry, the page you visited does not exist.',
      networkError: 'Sorry, the server reported an error.',
      returnToHome: 'Return to home'
    },
    form: {
      inputText: 'Please input',
      selectText: 'Please select',
      startTimeText: 'Start time',
      endTimeText: 'End time'
    },
    setting: {
      projectSetting: 'Project setting',
      theme: 'Theme',
      layout: 'Layout',
      systemTheme: 'System theme',
      menuTheme: 'Menu theme',
      interfaceDisplay: 'Interface display',
      breadcrumb: 'Breadcrumb',
      breadcrumbIcon: 'Breadcrumb icon',
      collapseMenu: 'Collapse menu',
      hamburgerIcon: 'Hamburger icon',
      screenfullIcon: 'Screenfull icon',
      sizeIcon: 'Size icon',
      localeIcon: 'Locale icon',
      tagsView: 'Tags view',
      logo: 'Logo',
      greyMode: 'Grey mode',
      fixedHeader: 'Fixed header',
      headerTheme: 'Header theme',
      cutMenu: 'Cut Menu',
      copy: 'Copy',
      clearAndReset: 'Clear cache and reset',
      copySuccess: 'Copy success',
      copyFailed: 'Copy failed',
      footer: 'Footer',
      uniqueOpened: 'Unique opened',
      tagsViewIcon: 'Tags view icon',
      dynamicRouter: 'Dynamic router',
      reExperienced: 'Please exit the login experience again',
      fixedMenu: 'Fixed menu',
      serverDynamicRouter: 'Server dynamic router'
    },
    size: {
      default: 'Default',
      large: 'Large',
      small: 'Small'
    },
    search: {
      query: 'Query',
      reset: 'Reset',
      shrink: 'Put away',
      expand: 'Expand'
    },
    tagView: {
      reload: 'Reload current',
      closeTab: 'Close current',
      closeTheLeftTab: 'Close left',
      closeTheRightTab: 'Close right',
      closeOther: 'Close other',
      closeAll: 'Close all'
    },
    userInfo: {
      loginOut: 'Login out',
      document: 'Document'
    },
    editableTable: {
      popconfirmTitle: 'Are you sure to delete this?',
      popconfirmButtonContent: 'delete'
    },
    mol3dViewer: {
      initFail: '3Dmol init fail!'
    }
  },
  router: {
    login: 'Login',
    level: 'Multi level menu',
    menu: 'Menu',
    menu1: 'Menu1',
    menu11: 'Menu1-1',
    menu111: 'Menu1-1-1',
    menu12: 'Menu1-2',
    menu2: 'Menu2',
    authorization: 'Authorization',
    userManagement: 'User management',
    roleManagement: 'Role management',
    menuManagement: 'Menu management'
  },
  validator: {
    required: '该项为必填项',
    lengthRange: '长度在 {min} 到 {max} 个字符',
    notSpace: '不能包含空格',
    notSpecialCharacters: '不能包含特殊字符',
    phone: '请输入正确的手机号码',
    email: '请输入正确的邮箱',
    emailOrPhone: '请输入正确的邮箱或手机号',
    maxlength: '长度不能超过 {max} 个字符'
  },
  views: {
    home: {
      welcome: 'Welcome to the system',
      message: 'Backstage management system',
      login: {
        title: 'Sign in',
        byPassword: {
          username: 'username',
          password: 'password',
          usernamePlaceholder: 'Please input username or email or phone',
          passwordPlaceholder: 'Please input password',
          forgetPassword: 'Forget password'
        },
        byCaptcha: {
          username: 'username',
          usernamePlaceholder: 'Please input email or phone',
          captcha: 'captcha',
          captchaPlaceholder: 'Please input captcha',
          sendCaptchaButton: 'send captcha'
        },
        loginWithPassword: 'Login with username and password',
        loginWithCaptcha: 'Verification code login',
        register: "Don't have an account yet? Go register",
        login: 'Sign in',
        otherLogin: 'Sign in with'
      },
      register: {
        title: 'Register',
        username: 'username',
        email: 'email',
        phone: 'phone',
        password: 'password',
        checkPassword: 'confirm password',
        usernamePlaceholder: 'Please input username',
        emailPlaceholder: 'Please input email',
        phonePlaceholder: 'Please input phone',
        passwordPlaceholder: 'Please input password',
        checkPasswordPlaceholder: 'Please input password again',
        register: 'Register',
        hasUser: 'Existing account? Go to login'
      }
    },
    authorManage: {
      user: {
        simple: {
          username: 'username',
          email: 'email',
          phone: 'phone',
          status: 'status',
          permission: 'permissions',
          operation: {
            updatePermission: 'Update permission',
            disable: 'To disable',
            disableMessageBoxTitle: 'Disable user',
            disableMessageBoxContent: 'Are you sure disable [{username}]?'
          }
        }
      }
    }
  }
}
