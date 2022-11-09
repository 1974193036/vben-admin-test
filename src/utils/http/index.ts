import { clone } from 'lodash-es'
import { deepMerge, joinTimestamp } from '@/utils/index'
import { isString } from '@/utils/is'
import { ContentTypeEnum, RequestEnum, ResultEnum } from '@/enums/httpEnum'
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform'
import { VAxios } from './Axios'
import { checkStatus } from './checkStatus'

const transform: AxiosTransform = {
  /**
   * @description: 请求前处理配置（比请求拦截器还要更早）
   */
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinTime = true } = options
    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`
    }

    const params = config.params || {}
    const data = config.data || false

    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
    } else {
      if (!isString(params)) {
        // 非GET请求如果没有提供data，则将params视为data
        config.data = data || params
        config.params = undefined
      } else {
        // 兼容restful风格
        config.url = config.url + params
        config.params = undefined
      }
    }
    return config
  },

  /**
   * @description: 请求拦截器
   */
  requestInterceptors(config) {
    // todo: 封装getToken方法
    const token = 'fakeToken1'
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      ;(config as Recordable).headers.Authorization = token
    }
    return config
  },

  /**
   * @description: 响应拦截器
   */
  responseInterceptors: (res) => {
    return res
  },

  /**
   * @description: 响应拦截器错误处理（超出 2xx 范围的状态码都会触发该函数）
   */
  responseInterceptorsCatch: (error) => {
    console.log('=========', error)
    // todo: 添加错误日志
    // const errorLogStore = useErrorLogStoreWithOut();
    // errorLogStore.addAjaxErrorInfo(error);

    const { response, code, message, config } = error || {}
    // @ts-ignore
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none'
    // @ts-ignore
    const msg: string = response?.data?.message || message || ''
    const err: string = error?.toString?.() || ''

    let errMessage = ''
    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = '接口请求超时, 请刷新页面重试!'
      }
      if (err?.includes('Network Error')) {
        errMessage = '网络异常, 请检查您的网络连接是否正常!'
      }

      if (errMessage) {
        if (errorMessageMode === 'modal') {
          // todo:
          // createErrorModal({ title: '错误提示', content: errMessage })
        } else if (errorMessageMode === 'message') {
          // todo:
          // createMessage.error(errMessage)
        }
        return Promise.reject(error)
      }
    } catch (error) {
      throw new Error(error as unknown as string)
    }

    // todo: checkStatus
    // 上面的情况甚至都不返回error.response
    // checkStatus: 超出 2xx 范围的错误提示
    checkStatus(error?.response?.status as number, msg, errorMessageMode)

    return Promise.reject(error)
  },

  /**
   * @description: 处理响应数据（接口响应正常2xx返回，比响应拦截器更晚）
   */
  transformResponseHook: (res, options) => {
    const { isTransformResponse, isReturnNativeResponse } = options
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code、message这些信息时开启
    if (!isTransformResponse) {
      return res.data
    }
    const { data } = res
    if (!data) {
      throw new Error('请求出错，请稍候重试')
    }
    // 这里 code，result，message为 后台统一的字段，需要在 types/axios.d.ts 内修改为项目自己的接口返回格式
    const { code, message, result } = data
    // 这里逻辑可以根据项目进行修改
    const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS
    if (hasSuccess) {
      return result
    }

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let timeoutMsg = ''
    switch (code) {
      case ResultEnum.TIMEOUT:
        timeoutMsg = '登录超时,请重新登录!'
        // todo: 执行登出逻辑
        break
      default:
        if (message) {
          timeoutMsg = message
        }
    }

    if (options.errorMessageMode === 'modal') {
      // todo: 弹窗提示错误消息
      // createErrorModal({ title: '错误提示', content: timeoutMsg });
    } else if (options.errorMessageMode === 'message') {
      // todo: 轻提示错误消息
      // createMessage.error(timeoutMsg)
    }

    throw new Error(timeoutMsg || '请求出错，请稍候重试')
  }
}

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  const defaultOptions = {
    // axios设置超时时间
    timeout: 10 * 1000,
    // axios设置请求头
    headers: { 'Content-Type': ContentTypeEnum.JSON },
    // 自定义数据处理方式
    transform: clone(transform),
    // 自定义配置项，下面的选项都可以在独立的接口请求中覆盖
    requestOptions: {
      // 需要对返回数据进行处理
      isTransformResponse: true,
      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      isReturnNativeResponse: false,
      // 接口地址，例如/basic-api
      apiUrl: import.meta.env.VITE_GLOB_API_URL,
      // 消息提示类型
      errorMessageMode: 'message',
      // 是否加入时间戳
      joinTime: true,
      // 忽略重复请求: true可以重复请求，false取消重复的请求
      ignoreCancelToken: true,
      // 是否携带token
      withToken: true
    }
  }
  // 深度合并
  const options = deepMerge(defaultOptions, opt || {})
  console.log(options)
  return new VAxios(options)
}

export const defHttp = createAxios()

// other api url
// export const otherHttp = createAxios({
//   timeout: 60 * 1000,
//   headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
//   requestOptions: {
//     apiUrl: '/other-api',
//     errorMessageMode: 'none'
//   }
// })
