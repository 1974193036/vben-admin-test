import { ResultEnum } from '@/enums/httpEnum'

export function resultError(message = '请求失败') {
  return {
    code: ResultEnum.ERROR,
    message,
    result: null,
    type: 'error'
  }
}

export function resultSuccess<T = Recordable>(result: T, message = 'ok') {
  return {
    code: ResultEnum.SUCCESS,
    message,
    result,
    type: 'success'
  }
}

/**
 * @description 本函数用于从request数据中获取token，请根据项目的实际情况修改
 *
 */
export function getRequestToken(request: requestParams): string | undefined {
  return request.headers?.authorization
}

export interface requestParams {
  body: any
  method: string
  headers?: { authorization?: string }
  query: any
}
