import Layout from '@/views/layout/Layout'
const MyinfoDataRouter = {
    path: '/Myinfo',
    component: Layout,
    redirect: '/Myinfo',
    name: 'Myinfo',
    alwaysShow: true,
    meta: {
        title: 'MyinfoManage',
        icon: 'table'
    },
    children: [
        {
            path: '/MyinfoManage-detail',
            component: () => import('@/views/MyInfoManage/PersonManage'),
            name: 'infoAmend',
            meta: {title: 'infoAmend'}
        },
        {
            path: '/MyClient',
            component: () => import('@/views/MyInfoManage/MyClient'),
            name: 'MyClient',
            meta: {title: 'MyClient'}
        },
        {
            path: '/MySales',
            component: () => import('@/views/MyInfoManage/MySales'),
            name: 'MySales',
            meta: {title: 'MySales'}
        },

    ]
}
export default MyinfoDataRouter
