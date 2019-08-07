import request from '@/utils/request'

export function GetUserInfo() {
    return request({
        url: "/person/GetUserInfo",
        method: "post",
    })
}

export function AmendUserData(data) {
    return request({
        url: "/person/AmendUserData",
        method: "post",
        data
    })
}

export function UserRelevanceData(data) {
    return request({
        url: "/person/UserRelevanceData",
        method: "post",
        data
    })
}

export function AddLogData(data) {
    return request({
        url: "/person/AddLogDataList",
        method: "post",
        data
    })
}

export function reviseContentData(data) {
    return request({
        url: "/person/reviseContentData",
        method: "post",
        data
    })
}

export function UploadRemakerImport(data) {
    return request({
        url: "/person/UploadRemakerImport",
        method: "post",
        data
    })
}

export function AddLogData_Two(data) {
    return request({
        url: "/person/AddLogData_Two",
        method: "post",
        data
    })
}

export function RemoteSearchData(data) {
    return request({
        url: "/person/RemoteSearchData",
        method: "post",
        data
    })
}
export function SreachListDataValue(data) {
    return request({
        url:"/person/SreachListDataValue",
        method:"post",
        data
    })
}
