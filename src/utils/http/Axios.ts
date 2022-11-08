import { cloneDeep } from 'lodash-es'
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import type { CreateAxiosOptions } from './axiosTransform'
import type { RequestOptions, Result } from '#/axios'
import { isFunction } from '@/utils/is'

export class VAxios {
  private readonly options: CreateAxiosOptions
  private axiosInstance: AxiosInstance

  constructor(options: CreateAxiosOptions) {
    this.options = options
    this.axiosInstance = axios.create(options)
    this.setupInterceptors()
  }

  private setupInterceptors() {
    const transform = this.getTransform()
    if (!transform) {
      return
    }
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch
    } = transform

    // 请求拦截器
    this.axiosInstance.interceptors.request.use((config: CreateAxiosOptions) => {
      // @ts-ignore
      console.log(config)
      const { ignoreCancelToken } = config.requestOptions!
      if (ignoreCancelToken === false) {
        console.log('todo: 忽略重复请求: true可以重复请求，false取消重复的请求')
      }
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config)
      }
      return config
    }, undefined)

    // 请求拦截器错误处理
    if (requestInterceptorsCatch && isFunction(requestInterceptorsCatch)) {
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch)
    }

    // 响应拦截器
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      // todo: 响应都结束了，取消`取消请求`
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res)
      }
      return res
    }, undefined)

    // 响应拦截器错误处理
    if (responseInterceptorsCatch && isFunction(responseInterceptorsCatch)) {
      this.axiosInstance.interceptors.response.use(undefined, (error: AxiosError) => {
        // @ts-ignore
        return responseInterceptorsCatch(this.axiosInstance, error)
      })
    }
  }

  private getTransform() {
    const { transform } = this.options
    return transform
  }

  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf: CreateAxiosOptions = cloneDeep(config)

    const { requestOptions } = this.options

    const opt: RequestOptions = Object.assign({}, requestOptions, options)

    const { beforeRequestHook, transformResponseHook } = this.getTransform() || {}

    // 注意：beforeRequestHook要比请求拦截器还要更早，当调用`request`方法时，才走拦截器那一套流程
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt)
    }
    // conf.requestOptions = opt

    // todo: 支持form表单提交

    return this.axiosInstance
      .request<any, AxiosResponse<Result>>(conf)
      .then((res) => {
        if (transformResponseHook && isFunction(transformResponseHook)) {
          try {
            const ret = transformResponseHook(res, opt)
            return ret
          } catch (err) {
            return Promise.reject(err || new Error('request error!'))
          }
        }
        return res as unknown as Promise<T>
      })
      .catch((e: AxiosError) => {
        return Promise.reject(e)
      })
  }

  get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options)
  }

  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options)
  }

  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options)
  }

  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options)
  }
}
