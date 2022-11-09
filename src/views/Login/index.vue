<template>
  <div>
    <div>views/login</div>
    <input />
    <button @click="cancelAllRequest">取消所有请求</button>
  </div>
</template>

<script lang="ts" setup>
import { defHttp } from '@/utils/http'
import { AxiosCanceler } from '@/utils/http/axiosCancel'

interface RoleInfo {
  roleName: string
  value: string
}

interface LoginResultModel {
  userId: string | number
  token: string
  roles: RoleInfo[]
}

// defHttp
//   .post<LoginResultModel>(
//     {
//       url: '/login',
//       data: {
//         username: 'vben',
//         password: '123456'
//       }
//     },
//     {
//       errorMessageMode: 'modal'
//     }
//   )
//   .then((res) => {
//     console.log('第一次登录请求', res, res.token, res.roles)
//   })
//   .catch((e) => {
//     console.log(e)
//   })

defHttp
  .get({
    url: '/testRetry2'
  })
  .then((res) => {
    console.log(res)
  })
  .catch((e) => {
    console.log(e)
  })

const axiosCanceler = new AxiosCanceler()
const cancelAllRequest = () => {
  axiosCanceler?.removeAllPending()
}
</script>
