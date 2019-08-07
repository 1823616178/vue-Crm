import request from '@/utils/request'

export function ApplyConfirmRequests(data) {
    return request({
        url: '/Busin/ApplyBusinessAssigned',
        method: 'post',
        data
    })
}

export function DistributionBusiness(data) {
    return request({
        url: '/Busin/DistributionBusiness',
        method: 'post',
        data
    })
}

export function DelectDistributionBusiness(data) {
    return request({
        url: '/Busin/DelectDistributionBusiness',
        method: 'post',
        data
    })
}