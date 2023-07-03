import { RouteRecordRaw } from 'vue-router'

// @mimas: allocated root path of current app, defined in package.json
const appPath = process.env.appPath as string

const routes: RouteRecordRaw[] = [
  {
    path: appPath,
    component: () => import('layouts/MainLayout.vue'),
    redirect: appPath + '/switch',
    children: [
      {
        path: 'original',
        component: () => import('pages/OriginalPage.vue')
      },
      {
        path: 'converge',
        component: () => import('pages/ConvergePage.vue')
      },
      {
        path: 'switch',
        component: () => import('pages/http/HttpIndex.vue')
      },
      // @mimas: about, updates, releases...
      {
        path: 'about',
        component: () => import('pages/AboutPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
