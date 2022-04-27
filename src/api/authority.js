import service from '@/utils/request'
// @Router /authority/getAuthorityList [post]
export const getAuthorityList = (page, size) => {
  return service({
    url: '/v1/role/list' + '?page=' + page + '&size=' + size,
    method: 'get',
  })
}

// @Summary 删除角色
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body {authorityId uint} true "删除角色"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /authority/deleteAuthority [post]
export const deleteAuthority = (data) => {
  return service({
    url: '/v1/role/del',
    method: 'post',
    data
  })
}

// @Summary 创建角色
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body api.CreateAuthorityPatams true "创建角色"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /authority/createAuthority [post]
export const createAuthority = (data) => {
  return service({
    url: '/v1/role/add',
    method: 'post',
    data
  })
}

// @Summary 修改角色
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.SysAuthority true "修改角色"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"设置成功"}"
// @Router /v1/role/set [post]
export const updateAuthority = (data) => {
  return service({
    url: '/v1/role/set',
    method: 'post',
    data
  })
}
