/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const saleTableRouter = {
  path: '/sale-table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'saleManage',
  meta: {
    title: 'saleManage',
    icon: 'table'
  },
  children: [
    {
      path: 'order-table',
      component: () => import('@/views/saleManage/orderManage/orderTable'),
      name: 'OrderTable',
      meta: { title: 'saleOrderManage' }
    }
  ]
}
export default saleTableRouter
