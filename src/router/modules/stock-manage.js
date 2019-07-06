/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const stockManageRouter = {
  path: '/stock-manage',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'stockManage',
  meta: {
    title: 'stockManage',
    icon: 'nested'
  },
  children: [
    {
      path: '/stock-order-manage',
      component: () => import('@/views/stockManage/stockOrder'),
      name: 'stockOrderManage',
      meta: { title: 'stockOrderManage' }
    },
    {
      path: '/stock-PurchaseAnalyze',
      component: () => import('@/views/stockManage/PurchaseAnalyze'),
      name: 'PurchaseAnalyze',
      meta: { title: 'PurchaseAnalyze' }
    },
  ]
}
export default stockManageRouter
