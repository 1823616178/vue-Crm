import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
// import Context from "@/views/TextContent"

/* Router Modules */
import jurisdiction from './modules/jurisdiction.js'
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import treeTableRouter from './modules/tree-table'
// import production from './modules/production'
// import nestedRouter from './modules/nested'
// import saleTableRouter from './modules/sale-table'
// import stockManage from './modules/stock-manage.js'
import BusinessManageRouter from './modules/BusinessManage.js'
import MyInfo from './modules/MyInfo'
// import TextContent from "@/views/TextContent/Index.vue"

/** note: sub-menu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
 **/
export const constantRoutes = [

    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/auth-redirect',
        component: () => import('@/views/login/authredirect'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/errorPage/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/errorPage/401'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: 'dashboard',
        children: [
            {
                path: '/dashboard',
                component: () => import('@/views/dashboard/index'),
                name: 'Dashboard',
                meta: {
                    title: 'dashboard',
                    icon: 'dashboard',
                    noCache: true,
                    affix: true
                }
            }
        ]
    },

]

export default new Router({
    mode: 'hash', // require service support
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutes
})

export const asyncRoutes = [
    /** When your routing table is too long, you can split it into small modules**/
    jurisdiction,
    // saleTableRouter,
    // production,
    // stockManage,
    BusinessManageRouter,
    MyInfo,
    // componentsRouter,
    // chartsRouter,
    // nestedRouter,
    // tableRouter,
    // treeTableRouter,


    {
        hidden: true,
        path: '/error',
        component: Layout,
        redirect: 'noredirect',
        name: 'ErrorPages',
        meta: {
            title: 'errorPages',
            icon: '404'
        },
        children: [
            {
                path: '401',
                component: () => import('@/views/errorPage/401'),
                name: 'Page401',
                meta: {title: 'page401', noCache: true}
            },
            {
                path: '404',
                component: () => import('@/views/errorPage/404'),
                name: 'Page404',
                meta: {title: 'page404', noCache: true}
            }
        ]
    },

    {
        hidden: true,
        path: '/error-log',
        component: Layout,
        redirect: 'noredirect',
        children: [
            {
                path: 'log',
                component: () => import('@/views/errorLog/index'),
                name: 'ErrorLog',
                meta: {title: 'errorLog', icon: 'bug'}
            }
        ]
    },

    {path: '*', redirect: '/404', hidden: true}
]
