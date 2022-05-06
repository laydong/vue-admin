import service from '@/utils/request'
// @Tags authority
// @Summary 更改角色api权限
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body api.CreateAuthorityPatams true "更改角色api权限"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /casbin/UpdateCasbin [post]
export const UpdateCasbin = (data) => {
  return service({
    url: '/v1/role/up_api_menu',
    method: 'post',
    data
  })
}

// @Tags casbin
// @Summary 获取权限列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body api.CreateAuthorityPatams true "获取权限列表"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /casbin/getPolicyPathByAuthorityId [post]
export const getAuthorityId = (id) => {
  return service({
    url: '/v1/role/api_user_menu?role_id=' + id,
    method: 'get'
  })
}
