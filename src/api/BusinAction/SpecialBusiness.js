import request from '@/utils/request'

export function NewSpecialFormData(data) {
    return request({
        url:"/Busin/NewSpecialFormData",
        method:"post",
        data
    })
}
export function GetDrawerListTree(data) {
    return request({
        url:"/Busin/GetDrawerListTree",
        method:"post",
        data
    })
}
export function DeleteTableInfo(data) {
    return request({
        url:"/Busin/DeleteTableInfo",
        method:"post",
        data
    })
}
