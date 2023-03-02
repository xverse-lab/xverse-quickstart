import { Http } from '@xverse/core'
import { IPreloadConfig } from '@xverse/core/lib/src/configs'

/**
 * 拦截http请求，支持添加tbundle参数并修改cdn地址
 * @param world
 * @param cdnHost
 */
export async function injectHttpHook(preloadConfig: IPreloadConfig, cdnHost?: string) {
  let preloadConfigMap: Record<string, string> | undefined
  Http.prototype.transformUrlHook = (url: string) => {
    if (url.startsWith('https://')) {
      if (preloadConfig) {
        const allUrls = preloadConfig.assetList
        if (!preloadConfigMap) {
          preloadConfigMap = {}
          allUrls.forEach((item) => (preloadConfigMap![item.assetUrl] = item.packName))
        }
        const packName = preloadConfigMap[url]
        if (packName) {
          url += (url.indexOf('?') > 0 ? '&' : '?') + `tbundle=${packName}`
          if (cdnHost) {
            url = url.replace(/(https?:\/\/)(.*?)(\/.*)/g, '$1' + cdnHost + '$3')
          }
        }
      }
    }
    return url
  }
}
