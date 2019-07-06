/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const production = {
  path: '/production',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'production',
  meta: {
    title: 'production',
    icon: 'table'
  },
  children: [
    {
      path: '/dycoms',
      component: () => import('@/views/dynamic_composing/Index'),
      name: 'dycoms',
      meta: {title: 'dycoms'}
    },
    {
      path: '/production-table',
      component: () => import('@/views/production/complexTable'),
      name: 'production',
      meta: {title: 'curtain_coating'}
    },
    {
      path: '/FenQieManage',
      component: () => import('@/views/production/FenQieManage'),
      name: 'FenQieManage',
      meta: {title: 'FenQieManage'}
    },
    {
      path: '/formula-table',
      component: () => import('@/views/prdctionManage/formulaManage/formulaTable'),
      name: 'FormulaTable',
      meta: {title: 'formulaTable'}
    },
  ]
}
export default production
