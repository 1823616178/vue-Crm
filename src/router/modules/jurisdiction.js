/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const jurisdiction = {
  path: '/jurisdiction',
  component: Layout,
  redirect: '/jurisdiction/index',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: 'jurisdiction',
    icon: 'lock',
    roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [
    {
      path: 'section',
      component: () => import('@/views/jurisdiction/section'),
      name: 'PesonPermission',
      meta: {
        title: ' divisional_management ',
        roles: ['admin', 'editor'] // or you can only set roles in sub nav
      }
    },
    {
      path: 'role',
      component: () => import('@/views/jurisdiction/role'),
      name: 'RolePermission',
      meta: {
        title: 'rolePermission',
        roles: ['admin', 'editor']
      }
    }
  ]
}

export default jurisdiction
