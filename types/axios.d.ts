export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined

export interface RequestOptions {
  // 是否需要对返回数据进行处理
  isTransformResponse?: boolean
  // 是否返回原生响应头 比如：需要获取响应头时使用该属性
  isReturnNativeResponse?: boolean
  // 接口地址，例如/basic-api
  apiUrl?: string
  // 消息提示类型
  errorMessageMode?: ErrorMessageMode
  // 是否加入时间戳
  joinTime?: boolean
  // 忽略重复请求: true可以重复请求，false取消重复的请求
  ignoreCancelToken?: boolean
  // 是否在请求头中发送令牌
  withToken?: boolean
}

export interface Result<T = any> {
  code: number
  message: string
  result: T
  type: 'success' | 'error' | 'warning'
}

// multipart/form-data: upload file
export interface UploadFileParams {
  // Other parameters
  data?: Recordable
  // File parameter interface field name
  name?: string
  // file name
  file: File | Blob
  // file name
  filename?: string
  [key: string]: any
}
