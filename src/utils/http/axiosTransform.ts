import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

import type { RequestOptions, Result } from '#/axios'

export interface CreateAxiosOptions extends AxiosRequestConfig {
  // 自定义数据处理方式
  transform?: AxiosTransform
  // 自定义配置项
  requestOptions?: RequestOptions
}

export abstract class AxiosTransform {
  /**
   * @description: 请求前处理配置（比请求拦截器还要更早）
   */
  beforeRequestHook?: (config: CreateAxiosOptions, options: RequestOptions) => CreateAxiosOptions

  /**
   * @description: 请求拦截器
   */
  requestInterceptors?: (config: CreateAxiosOptions) => CreateAxiosOptions

  /**
   * @description: 请求拦截器错误处理
   */
  requestInterceptorsCatch?: (error: AxiosError) => void

  /**
   * @description: 响应拦截器
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>

  /**
   * @description: 响应拦截器错误处理（超出 2xx 范围的状态码都会触发该函数）
   */
  responseInterceptorsCatch?: (error: AxiosError) => void

  /**
   * @description: 处理响应数据（接口响应正常返回，比响应拦截器更晚）
   */
  transformResponseHook?: (res: AxiosResponse<Result>, options: RequestOptions) => any
}
