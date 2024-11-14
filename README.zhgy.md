> 此项目来自：`https://element-plus-admin-doc.cn/`，让我们感谢大佬 [@kailong321200875](https://github.com/kailong321200875)

# 注意点

1. `/src/constants/index.ts` 下的 `NO_REDIRECT_WHITE_LIST` 表示的是不用跳转登录页的页面链接，同时也是可以匿名访问的页面链接
2. `/src/views/Login/compoments/LoginForm.vue` 是初始化菜单的入口，可以阅读这里的代码了解详细逻辑
3. 主题配置文件在 `/src/store/modules/app.ts` 文件中，可以在官方文档在线预览中详细看效果
4. 注册页面是有问题的，需要自己实现验证码的相关逻辑

# todo项

* [ ] 菜单权限二次开发，我理想中的样子是：后端存储必要的页面链接key和业务相关属性，比如：菜单名称、菜单排序、菜单父节点等信息，前端根据这些信息判断要展示哪些菜单，现在前端需要包含的开发属性有点太多了
