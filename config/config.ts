import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import slash from 'slash2';
// import themePluginConfig from './themePluginConfig';

const { pwa } = defaultSettings;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
// const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';

const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      // dynamicImport: {
      //   loadingComponent: './components/PageLoading/index',
      //   webpackChunkName: true,
      //   level: 3,
      // },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

// if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
//   plugins.push([
//     'umi-plugin-ga',
//     {
//       code: 'UA-72788897-6',
//     },
//   ]);
//   plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
// }

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    }, 
    // 单独的一个页面，后续可以考虑对应各个业务线
    // {
    //   path: '/Lark',
    //   name: "Lark"",
    //   component: '../layouts/BasicLayout',
    //   // icon: "area-chart",
    //   children: [
    //     {
    //       "path": "list",
    //       "name": "sheet-list"
    //     },
    //     {
    //       "path": "timeline",
    //       "name": "sheet-timeline"
    //     }
    //   ]
    // },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/my-online-list',
            },
            {
              path: '/my-online-list',
              name: 'my-online-list',
              icon: 'user',
              component: './Welcome',
            },
            {
              path: '/online',
              name: 'online',
              icon: 'container',
              routes: [
                {
                  path: '/online/lark',
                  name: 'Lark',
                  component: './Lark',
                },
                {
                  path: '/online/people',
                  name: 'People',
                  component: './People',
                },
                {
                  path: '/online/Security',
                  name: 'Security',
                  component: './Welcome',
                },
                {
                  path: '/online/Docs',
                  name: 'Docs',
                  component: './Welcome',
                },
                {
                  path: 'online/businessline/create',
                  hideInMenu: true,
                },
                {
                  path: '/People/createBus',
                  hideInMenu: true,
                },
                {
                  path: '/People/bus',
                  hideInMenu: true,
                },
                {
                  path: '/businessline/createFeature',
                  hideInMenu: true,
                },
              ],
            },
            {
              path: '/sheet',
              name: 'sheet',
              icon: 'area-chart',
              routes: [
                {
                  path: '/sheet/list',
                  name: 'sheet-list',
                },
                {
                  path: '/sheet/timeline',
                  name: 'sheet-timeline',
                },
              ],
            },
            {
              path: '/manage',
              name: 'manage',
              icon: 'solution',
              component: './Manage',
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  // chainWebpack: webpackPlugin,
  // proxy: {
  //   '/server/api/': {
  //     target: 'https://preview.pro.ant.design/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server': '' },
  //   },
  // },
  proxy: {
    '/api/v1': {
      // 联调地址，stage环境
      target: 'https://gatekeeper-stage.bytedance.net',
      // 开发地址
      // target: 'https://yapi.bytedance.net/mock/3804',
      changeOrigin: true,
    },
  },
} as IConfig;
