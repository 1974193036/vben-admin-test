<template>
  <div>
    <div>views/login</div>
    <input />
  </div>
</template>

<script lang="ts" setup>
import { defHttp } from '@/utils/http'

interface RoleInfo {
  roleName: string
  value: string
}

interface LoginResultModel {
  userId: string | number
  token: string
  roles: RoleInfo[]
}

defHttp
  .post<LoginResultModel>(
    {
      url: '/login',
      data: {
        username: 'vben',
        password: '123456'
      }
    },
    {
      errorMessageMode: 'modal'
    }
  )
  .then((res) => {
    console.log(res, res.token, res.roles)
  })
  .catch((e) => {
    console.log(e)
  })
</script>
