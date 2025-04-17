export default {
  common: {
    login: '登录',
    loginOut: '退出系统',
    document: '项目文档',
    reminder: '温馨提示',
    loginOutMessage: '是否退出本系统？',
    back: '返回',
    ok: '确定',
    cancel: '取消',
    close: '关闭',
    reload: '重新加载',
    closeTab: '关闭标签页',
    closeTheLeftTab: '关闭左侧标签页',
    closeTheRightTab: '关闭右侧标签页',
    closeOther: '关闭其它标签页',
    closeAll: '关闭全部标签页',
    query: '查询',
    reset: '重置',
    shrink: '收起',
    expand: '展开',
    delMessage: '是否删除所选中数据？',
    delWarning: '提示',
    delOk: '确定',
    delCancel: '取消',
    delSuccess: '删除成功',
    operation: '操作',
    status: '状态',
    statusDesc: {
      enable: '启用',
      disable: '停用'
    }
  },
  components: {
    lock: {
      lockScreen: '锁定屏幕',
      lock: '锁定',
      lockPassword: '锁屏密码',
      unlock: '点击解锁',
      backToLogin: '返回登录',
      entrySystem: '进入系统',
      placeholder: '请输入锁屏密码',
      message: '锁屏密码错误'
    },
    error: {
      noPermission: '抱歉，您无权访问此页面。',
      pageError: '抱歉，您访问的页面不存在。',
      networkError: '抱歉，服务器报告错误。',
      returnToHome: '返回首页'
    },
    form: {
      inputText: '请输入',
      selectText: '请选择',
      startTimeText: '开始时间',
      endTimeText: '结束时间'
    },
    setting: {
      projectSetting: '项目配置',
      theme: '主题',
      layout: '布局',
      systemTheme: '系统主题',
      menuTheme: '菜单主题',
      interfaceDisplay: '界面显示',
      breadcrumb: '面包屑',
      breadcrumbIcon: '面包屑图标',
      collapseMenu: '折叠菜单',
      hamburgerIcon: '折叠图标',
      screenfullIcon: '全屏图标',
      sizeIcon: '尺寸图标',
      localeIcon: '多语言图标',
      tagsView: '标签页',
      logo: 'logo',
      greyMode: '灰色模式',
      fixedHeader: '固定头部',
      headerTheme: '头部主题',
      cutMenu: '切割菜单',
      copy: '拷贝',
      clearAndReset: '清除缓存并且重置',
      copySuccess: '拷贝成功',
      copyFailed: '拷贝失败',
      footer: '页脚',
      uniqueOpened: '菜单手风琴',
      tagsViewIcon: '标签页图标',
      dynamicRouter: '动态路由',
      reExperienced: '请重新退出登录体验',
      fixedMenu: '固定菜单'
    },
    size: {
      default: '默认',
      large: '大',
      small: '小'
    },
    search: {
      query: '查询',
      reset: '重置',
      shrink: '收起',
      expand: '展开'
    },
    tagView: {
      reload: '重新加载',
      closeTab: '关闭标签页',
      closeTheLeftTab: '关闭左侧标签页',
      closeTheRightTab: '关闭右侧标签页',
      closeOther: '关闭其它标签页',
      closeAll: '关闭全部标签页'
    },
    table: {
      delMessage: '是否删除所选中数据？',
      delWarning: '提示',
      delSuccess: '删除成功'
    },
    userInfo: {
      loginOut: '退出系统',
      document: '项目文档'
    },
    editableTable: {
      popconfirmTitle: '确定删除该行吗？',
      popconfirmButtonContent: '删除当前行'
    },
    mol3dViewer: {
      initFail: '3Dmol 初始化失败'
    }
  },
  router: {
    login: '登录',
    level: '多级菜单',
    menu: '菜单',
    menu1: '菜单1',
    menu11: '菜单1-1',
    menu111: '菜单1-1-1',
    menu12: '菜单1-2',
    menu2: '菜单2',
    authorization: '权限管理',
    userManagement: '用户管理',
    roleManagement: '角色管理',
    menuManagement: '菜单管理',
    functionManagement: '接口管理',
    functionGroupManagement: '功能分组管理',
    appInfoManagement: '应用管理'
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
      welcome: '欢迎使用本系统',
      message: '开箱即用的中后台管理系统',
      login: {
        title: '登录',
        byPassword: {
          username: '用户名',
          password: '密码',
          usernamePlaceholder: '请输入用户名/邮箱/手机号',
          passwordPlaceholder: '请输入密码',
          forgetPassword: '忘记密码'
        },
        byCaptcha: {
          username: '用户名',
          usernamePlaceholder: '请输入邮箱/手机号',
          captcha: '验证码',
          captchaPlaceholder: '请输入验证码',
          sendCaptchaButton: '发送验证码'
        },
        loginWithPassword: '用户名密码登录',
        loginWithCaptcha: '验证码登录',
        register: '还没有账号？去注册',
        login: '登录',
        otherLogin: '其它登录方式'
      },
      register: {
        title: '注册',
        username: '用户名',
        email: '邮箱',
        phone: '手机号',
        password: '密码',
        checkPassword: '确认密码',
        usernamePlaceholder: '请输入用户名',
        emailPlaceholder: '请输入邮箱',
        phonePlaceholder: '请输入手机号',
        passwordPlaceholder: '请输入密码',
        checkPasswordPlaceholder: '请再次输入密码',
        register: '注册',
        hasUser: '已有账号？去登录'
      }
    },
    authorManage: {
      user: {
        simple: {
          username: '用户名',
          email: '邮箱',
          phone: '手机号',
          status: '状态',
          permission: '权限',
          operation: {
            updatePermission: '修改权限',
            disable: '禁用',
            disableMessageBoxTitle: '停用账号',
            disableMessageBoxContent: '确认停用账号[{username}]？',
            enable: '启用',
            enableMessageBoxTitle: '启用账号',
            enableMessageBoxContent: '确认启用账号[{username}]？'
          }
        },
        rbac: {
          username: '用户名',
          nickname: '昵称',
          email: '邮箱',
          phone: '手机号',
          status: '状态',
          roles: '角色',
          operation: {
            userDetail: '用户详情',
            userUpdate: '修改用户',
            updateRoleDialogTitle: '修改用户角色',
            disable: '禁用',
            disableMessageBoxTitle: '停用账号',
            disableMessageBoxContent: '确认停用账号[{username}]？',
            enable: '启用',
            enableMessageBoxTitle: '启用账号',
            enableMessageBoxContent: '确认启用账号[{username}]？',
            updateBindAppDialogTitle: '修改应用授权'
          },
          dialog: {
            title: {
              add: '添加用户',
              edit: '修改用户',
              view: '用户详情'
            }
          },
          detail: {
            appKey: 'appkey',
            roles: '角色',
            updateRole: '修改角色',
            bindedRoles: '已绑定角色',
            allRoles: '所有角色',
            updateApp: '绑定应用',
            bindedApp: '已绑定应用',
            allApp: '所有应用'
          }
        }
      },
      role: {
        no: '角色编号',
        name: '角色名称',
        nameZh: '角色中文名称',
        description: '角色描述',
        appKey: '所属应用',
        operation: {
          roleDetail: '角色详情',
          updateRole: '修改角色',
          addRole: '创建角色',
          disable: '禁用',
          disableMessageBoxTitle: '停用角色',
          disableMessageBoxContent: '确认停用角色[{name}]？',
          disableMessageBoxContentWarn: '角色[{name}]正在使用中，确认停用？',
          enable: '启用',
          enableMessageBoxTitle: '启用角色',
          enableMessageBoxContent: '确认启用角色[{name}]？'
        },
        dialog: {
          title: {
            add: '创建角色',
            edit: '修改角色',
            view: '角色详情'
          }
        },
        detail: {
          functions: '功能'
        }
      },
      menu: {
        no: '菜单编号',
        title: '菜单名称',
        componentKey: '菜单标识',
        pageType: '页面类型',
        pageTypeDesc: {
          static: '静态页面',
          dynamic: '动态页面'
        },
        parentNo: '父级菜单',
        appKey: '所属应用',
        functionGroup: '功能',
        operation: {
          menuDetail: '菜单详情',
          updateMenu: '修改菜单',
          addMenu: '创建菜单',
          disable: '禁用',
          disableMessageBoxTitle: '停用菜单',
          disableMessageBoxContent: '确认停用菜单[{name}]？',
          disableMessageBoxContentWarn: '菜单[{name}]正在使用中，确认停用？',
          enable: '启用',
          enableMessageBoxTitle: '启用菜单',
          enableMessageBoxContent: '确认启用菜单[{name}]？'
        },
        dialog: {
          title: {
            add: '创建菜单',
            edit: '修改菜单',
            view: '菜单详情'
          }
        },
        detail: {
          functionGroups: '功能',
          functionGroupNo: '功能编号',
          functionGroupTitle: '功能名称',
          functionGroupCallType: '调用方式',
          functionGroupStatus: '状态'
        }
      },
      function: {
        no: '编号',
        title: '名称',
        requestMethod: '请求方式',
        requestUrl: '请求url',
        appKey: '所属应用',
        operation: {
          detail: '接口详情',
          update: '修改接口',
          add: '创建接口',
          disable: '禁用',
          disableMessageBoxTitle: '停用接口',
          disableMessageBoxContent: '确认停用接口[{name}]？',
          disableMessageBoxContentWarn: '接口[{name}]正在使用中，确认停用？',
          enable: '启用',
          enableMessageBoxTitle: '启用接口',
          enableMessageBoxContent: '确认启用接口[{name}]？'
        },
        dialog: {
          title: {
            add: '创建菜单',
            edit: '修改菜单',
            view: '菜单详情'
          }
        },
        detail: {}
      },
      functionGroup: {
        no: '编号',
        title: '名称',
        callType: '调用方式',
        callTypeDesc: {
          byShow: '页面初始化',
          byButton: '按钮点击'
        },
        appKey: '所属应用',
        frontendPage: '应用于页面',
        functions: '功能接口',
        operation: {
          detail: '功能组详情',
          update: '修改功能组',
          add: '创建功能组',
          disable: '禁用',
          disableMessageBoxTitle: '停用功能组',
          disableMessageBoxContent: '确认停用功能组[{name}]？',
          disableMessageBoxContentWarn: '功能组[{name}]正在使用中，确认停用？',
          enable: '启用',
          enableMessageBoxTitle: '启用功能组',
          enableMessageBoxContent: '确认启用功能组[{name}]？'
        },
        dialog: {
          title: {
            add: '创建功能组',
            edit: '修改功能组',
            view: '功能组详情'
          }
        },
        detail: {}
      },
      appInfo: {
        appKey: 'appkey',
        appName: '名称',
        description: '描述',
        accessControlBy: '权限控制方式',
        accessControlByDesc: {
          byRbac: '权限服务控制',
          bySelf: '服务自己控制'
        },
        grantAccessPermissionBy: '访问权限授予方式',
        grantAccessPermissionByDesc: {
          byAuto: '自动授权',
          byManual: '手动授权'
        },
        appType: '类型',
        appTypeDesc: {
          backend: '后端应用',
          web: '前端应用',
          'mini-program': '小程序应用',
          android: '安卓应用',
          ios: 'ios应用'
        },
        operation: {
          detail: '应用详情',
          update: '修改应用',
          add: '创建应用',
          disable: '禁用',
          disableMessageBoxTitle: '禁用应用',
          disableMessageBoxContent: '确认禁用应用[{name}]？',
          disableMessageBoxContentWarn: '应用[{name}]正在使用中，确认禁用？',
          enable: '启用',
          enableMessageBoxTitle: '启用应用',
          enableMessageBoxContent: '确认启用应用[{name}]？'
        },
        dialog: {
          title: {
            add: '创建应用',
            edit: '修改应用',
            view: '应用详情'
          }
        },
        detail: {}
      }
    }
  }
}
