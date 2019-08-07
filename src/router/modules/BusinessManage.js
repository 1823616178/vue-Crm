/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const BusinessManage = {
    path: '/Busin-Manage',
    component: Layout,
    redirect: '/table/Busin-Manage',
    name: 'BusinManage',
    alwaysShow: true,
    meta: {
        title: 'BusinManage',
        icon: 'peoples'
    },
    children: [
        {
            path: '/Busin-New',
            component: () => import('@/views/BusinessManage/EnterpriseNew'),
            name: 'EnterpriseNew',
            meta: {title: 'EnterpriseNew'}
        },
        {
            path: '/Special-Buiness',
            component: () => import('@/views/BusinessManage/SpecialBuiness'),
            name: 'SpecialBuiness',
            meta: {title: 'SpecialBuiness'}
        },
    ]
}
export default BusinessManage
