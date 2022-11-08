import { MockMethod } from 'vite-plugin-mock'
import { resultError, resultSuccess, getRequestToken } from '../_util'
import type { requestParams } from '../_util'

function createFakeUserList() {
  return [
    // 超级管理员
    {
      userId: '1',
      username: 'vben',
      realName: '超级管理员',
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640',
      desc: '管理员～',
      password: '123456',
      token: 'fakeToken1',
      homePath: '/dashboard/analysis',
      roles: [
        {
          roleName: '超级管理员',
          value: 'super'
        }
      ]
    },
    // 测试员
    {
      userId: '2',
      username: 'test',
      password: '123456',
      realName: '测试员',
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=339449197&s=640',
      desc: '测试员～',
      token: 'fakeToken2',
      homePath: '/dashboard/workbench',
      roles: [
        {
          roleName: '测试员',
          value: 'test'
        }
      ]
    }
  ]
}

const fakeCodeList = {
  '1': ['1000', '3000', '5000'],
  '2': ['2000', '4000', '6000']
}

export default [
  // 登录
  {
    url: '/basic-api/login',
    timeout: 200,
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      const checkUser = createFakeUserList().find(
        (item) => item.username === username && password === item.password
      )
      if (!checkUser) {
        return resultError('账户名或者密码错误！')
      }
      const { userId, username: _username, token, realName, desc, roles } = checkUser
      return resultSuccess({
        roles,
        userId,
        username: _username,
        token,
        realName,
        desc
      })
    }
  },
  // 获取用户信息
  {
    url: '/basic-api/getUserInfo',
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      if (!token) return resultError('无效的token')
      const checkUser = createFakeUserList().find((item) => item.token === token)
      if (!checkUser) {
        return resultError('没有相应的用户信息!')
      }
      return resultSuccess(checkUser)
    }
  },
  // 该角色的权限编码
  {
    url: '/basic-api/getPermCode',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      if (!token) return resultError('无效的token')
      const checkUser = createFakeUserList().find((item) => item.token === token)
      if (!checkUser) {
        return resultError('无效的token')
      }
      const codeList = fakeCodeList[checkUser.userId]

      return resultSuccess(codeList)
    }
  },
  // 登出
  {
    url: '/basic-api/logout',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      if (!token) return resultError('无效的token')
      const checkUser = createFakeUserList().find((item) => item.token === token)
      if (!checkUser) {
        return resultError('无效的token')
      }
      return resultSuccess(null, '登出成功！')
    }
  },
  // 测试异常情况
  {
    url: '/basic-api/testRetry',
    statusCode: 405,
    method: 'get',
    response: () => {
      return resultError('Error!')
    }
  }
] as MockMethod[]
