/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const stockManageRouter = {
  path: '/stock-manage',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'stockManage',
  meta: {
    title: 'stockManage',
    icon: 'table'
  },
  children: [
    {
      path: '/stock-order-manage',
      component: () => import('@/views/stockManage/stockOrder'),
      name: 'stockOrderManage',
      meta: { title: 'stockOrderManage' }
    }
  ]
}
export default stockManageRouter