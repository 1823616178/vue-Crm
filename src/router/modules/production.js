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
    // {
    //   path: 'dynamic-table',
    //   component: () => import('@/views/production/dynamicTable/index'),
    //   name: 'DynamicTable',
    //   meta: { title: 'dynamicTable' }
    // },
    // {
    //   path: 'production-table',
    //   component: () => import('@/views/production/complexTable'),
    //   name: 'production',
    //   meta: { title: 'productionTable' }
    // },
    {
      path: 'formula-table',
      component: () =>
        import('@/views/prdctionManage/formulaManage/formulaTable'),
      name: 'FormulaTable',
      meta: { title: 'formulaTable' }
    },
    {
      path: 'production-table',
      component: () => import('@/views/production/complexTable'),
      name: 'production',
      meta: { title: 'curtain_coating' }
    },
    {
      path: 'liuyan-dispatching',
      name: 'DragTable',
      component: () => import('@/views/production/dragTable.vue'),
      meta: { title: 'Ly_dispatching' }
    },

    // {
    //   path: 'slitting-management',
    //   component: () => import('@/views/production/dynamicTable/index'),
    //   name: 'DynamicTable',
    //   meta: { title: 'slitting_management' }
    // },
    {
      path: 'dycoms',
      component: () => import('@/views/dynamic_composing/Index'),
      name: 'dycoms',
      meta: { title: 'dycoms' }
    }
  ]
}
export default production
