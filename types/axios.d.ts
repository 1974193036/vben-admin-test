type errorMessageMode = 'none' | 'modal' | 'message' | undefined

export interface RequestOptions {
  // 是否需要对返回数据进行处理
  isTransformResponse?: boolean
  // 是否返回原生响应头 比如：需要获取响应头时使用该属性
  isReturnNativeResponse?: boolean
  // 接口地址，例如/basic-api
  apiUrl?: string
  // 消息提示类型
  errorMessageMode?: errorMessageMode
  // 是否加入时间戳
  joinTime?: boolean
  // 忽略重复请求: true可以重复请求，false取消重复的请求
  ignoreCancelToken?: boolean
  // 是否在请求头中发送令牌
  withToken?: boolean
  // 请求重试机制
  retryRequest?: RetryRequest
}

interface RetryRequest {
  // 是否重试请求
  isOpenRetry: boolean
  // 重试次数
  count: number
  // 重试等待时间
  waitTime: number
}

export interface Result<T = any> {
  code: number
  message: string
  result: T
  type: 'success' | 'error' | 'warning'
}
