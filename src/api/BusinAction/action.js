import request from '@/utils/request'

export function getEcterInfoList(data) {
    return request({
        url: "/Busin/getEcterInfoList",
        method: "post",
        data
    })
}

export function AddFirmData(val) {
    return request({
        url: "/Busin/AddFirmData",
        method: "post",
        data: val
    })
}

export function ApplyBusinessData(data) {
    return request({
        url: "/Busin/ApplyBusinessData",
        method: "post",
        data
    })
}

export function cancleApplyFunc(data) {
    return request({
        url: "/Busin/cancleApplyFunc",
        method: "post",
        data
    })
}

export function UpdataBusinData(data) {
    return request({
        url: "/Busin/UpdataBusinData",
        method: "post",
        data
    })
}

export function DownBusinessFile(data) {
    return request({
        url: "/Busin/DownBusinessFile",
        method: "post",
        data
    })
}

export function selectValSeek(data) {
    return request({
        url: "/Busin/selectValSeek",
        method: "post",
        data
    })
}

export function AmendFirmData(data) {
    return request({
        url: "/Busin/AmendFirmData",
        method: "post",
        data
    })
}

export function UploadRemakerDataList(data) {
    return request({
        url: "/Busin/UploadRemakerData",
        method: "post",
        data
    })
}

export function SelectVStatus(data) {
    return request({
        url: '/Busin/SelectValStatus',
        method: "post",
        data
    })
}

export function SelectValPeople(data) {
    return request({
        url: '/Busin/SelectValPeople',
        method: "post",
        data
    })
}