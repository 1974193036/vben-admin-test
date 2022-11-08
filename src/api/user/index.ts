// import { defHttp } from '@/utils/http'
// import { LoginParams, LoginResultModel } from './types'

// import { ErrorMessageMode } from '/#/axios'

// const enum Api {
//   Login = '/login',
//   Logout = '/logout',
//   GetUserInfo = '/getUserInfo',
//   GetPermCode = '/getPermCode',
//   TestRetry = '/testRetry'
// }

// export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
// return defHttp.post<LoginResultModel>(
//   {
//     url: Api.Login,
//     params,
//   },
//   {
//     errorMessageMode: ,
//   },
// )
// }

// /**
//  * @description: getUserInfo
//  */
// export function getUserInfo() {
//   return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' })
// }

// export function getPermCode() {
//   return defHttp.get<string[]>({ url: Api.GetPermCode })
// }

// export function doLogout() {
//   return defHttp.get({ url: Api.Logout })
// }

// export function testRetry() {
//   return defHttp.get(
//     { url: Api.TestRetry },
//     {
//       retryRequest: {
//         isOpenRetry: true,
//         count: 5,
//         waitTime: 1000,
//       },
//     },
//   )
// }
