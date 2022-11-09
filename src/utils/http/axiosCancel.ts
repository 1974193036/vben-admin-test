import axios from 'axios'
import type { CreateAxiosOptions } from './axiosTransform'
import type { Canceler } from 'axios'
import { isFunction } from '@/utils/is'

let pendingMap = new Map<string, Canceler>()

const getPendingUrl = (config: CreateAxiosOptions) => [config.method, config.url].join('&')

export class AxiosCanceler {
  /**
   * Add request
   * @param {Object} config
   */
  addPending(config: CreateAxiosOptions, ignoreCancelToken: boolean) {
    if (ignoreCancelToken === false) {
      this.removePending(config)
    }
    const url = getPendingUrl(config) // 类似`post&/basic-api/login`
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
        if (!pendingMap.has(url)) {
          // If there is no current request in pending, add it
          pendingMap.set(url, cancel)
        }
      })
  }

  /**
   * Removal request
   * @param {Object} config
   */
  removePending(config: CreateAxiosOptions) {
    const url = getPendingUrl(config)

    if (pendingMap.has(url)) {
      // If there is a current request identifier in pending,
      // the current request needs to be cancelled and removed
      const cancel = pendingMap.get(url)
      cancel && cancel(url)
      pendingMap.delete(url)
    }
  }

  /**
   * @description: Clear all pending
   */
  removeAllPending() {
    pendingMap.forEach((cancel) => {
      cancel && isFunction(cancel) && cancel()
    })
    pendingMap.clear()
  }

  /**
   * @description: reset
   */
  reset(): void {
    pendingMap = new Map<string, Canceler>()
  }
}
