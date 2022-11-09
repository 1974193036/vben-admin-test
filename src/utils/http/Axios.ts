import { cloneDeep } from 'lodash-es'
import axios from 'axios'
import qs from 'qs'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import type { CreateAxiosOptions } from './axiosTransform'
import type { RequestOptions, Result, UploadFileParams } from '#/axios'
import { isFunction } from '@/utils/is'
import { ContentTypeEnum, RequestEnum } from '@/enums/httpEnum'
import { AxiosCanceler } from './axiosCancel'

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

    const axiosCanceler = new AxiosCanceler()

    // 请求拦截器
    this.axiosInstance.interceptors.request.use((config: CreateAxiosOptions) => {
      // @ts-ignore
      console.log(config)
      const { ignoreCancelToken } = config.requestOptions!
      // if (ignoreCancelToken === false) {
      //   // 忽略重复请求: true可以重复请求，false取消重复的请求
      //   axiosCanceler.addPending(config, ignoreCancelToken)
      // }
      // 忽略重复请求: true可以重复请求，false取消重复的请求
      axiosCanceler.addPending(config, ignoreCancelToken as boolean)

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
      if (res) {
        axiosCanceler.removePending(res.config)
      }
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res)
      }
      return res
    }, undefined)

    // 响应拦截器错误处理
    if (responseInterceptorsCatch && isFunction(responseInterceptorsCatch)) {
      this.axiosInstance.interceptors.response.use(undefined, (error: AxiosError) => {
        // @ts-ignore
        return responseInterceptorsCatch(error)
      })
    }
  }

  private getTransform() {
    const { transform } = this.options
    return transform
  }

  /**
   * @description:  File Upload
   */
  uploadFile<T = any>(config: CreateAxiosOptions, params: UploadFileParams) {
    const formData = new window.FormData()
    const customFilename = params.name || 'file'
    if (params.filename) {
      formData.append(customFilename, params.file, params.filename)
    } else {
      formData.append(customFilename, params.file)
    }
    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data![key]
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item)
          })
          return
        }
        formData.append(key, value)
      })
    }

    return this.axiosInstance.request<T>({
      ...config,
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': ContentTypeEnum.FORM_DATA
      }
    })
  }

  supportFormData(config: CreateAxiosOptions) {
    const headers = config.headers || this.options.headers
    const contentType = headers?.['Content-Type'] || headers?.['content-type']
    if (
      contentType !== ContentTypeEnum.FORM_URLENCODED ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === RequestEnum.GET
    ) {
      return config
    }

    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' })
    }
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

    conf.requestOptions = opt

    // 支持application/x-www-form-urlencoded
    conf = this.supportFormData(conf)

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
