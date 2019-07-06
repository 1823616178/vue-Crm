import request from '@/utils/request'

export function GetFormList(data) {
  return request({
    url: "/product/LiuYanCodeStyle",
    method: "post",
    data
  })
}
