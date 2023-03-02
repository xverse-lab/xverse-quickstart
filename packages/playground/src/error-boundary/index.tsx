import { EFPSStatus } from '@xverse/core'
import { Modal } from 'antd-mobile'
import { useCallback, useEffect } from 'react'
import { BaseWorld } from '../game-play/world'

export function ErrorBoundary(props: { world: BaseWorld }) {
  if (!props.world) return
  const { world: baseWorld } = props

  useEffect(() => {
    baseWorld.on('disconnected', onDisconnectedHandler)
    baseWorld.on('fatalError', onFatalErrorHandle)
    // 切Room失败，在执行切房间失败的地方要派发一个roomEnterError事件
    baseWorld.baseEventBus.on('roomEnterError', onEnterRoomErrorHandle)
    // 切Path失败，在执行切path失败的地方要派发一个pathEnterError事件
    baseWorld.baseEventBus.on('pathEnterError', onPathEnterErrorHandler)
    // 绑定FPS
    baseWorld.getFpsDetector().on('fpsStatusChanged', onFpsStatusChangedHandle)
    // Net探测
    baseWorld.getNetworkDetector().on('networkQuality', onNetworkQualityChangedHandle)
    baseWorld.getNetworkDetector().startNetworkChecking()
    baseWorld.getFpsDetector().start()

    return () => {
      baseWorld.off('disconnected', onDisconnectedHandler)
      baseWorld.off('fatalError', onFatalErrorHandle)
      baseWorld.baseEventBus.off('roomEnterError', onEnterRoomErrorHandle)
      baseWorld.baseEventBus.off('pathEnterError', onPathEnterErrorHandler)
      baseWorld.getFpsDetector().off('fpsStatusChanged', onFpsStatusChangedHandle)
      baseWorld.getNetworkDetector().off('networkQuality', onNetworkQualityChangedHandle)
      baseWorld.getNetworkDetector().stopNetworkChecking()
      baseWorld.getFpsDetector().stop()
    }
  }, [])

  // 处理断开连接
  const onDisconnectedHandler = useCallback((args?: { code?: number }) => {
    const code = typeof args?.code !== 'undefined' ? `\n(${String(args.code)})` : ''
    Modal.show({
      title: '没有找到网络',
      content: `当前网络似乎断开了\n请确认网络已连接后重试${code}`,
    })
  }, [])

  // 处理切换path失败
  const onPathEnterErrorHandler = useCallback((args?: { code?: number }) => {
    const code = typeof args?.code !== 'undefined' ? `\n(${String(args.code)})` : ''
    Modal.show({
      title: '出错啦',
      content: `我们在连接时出现了偏差\n请重新试试${code}`,
    })
  }, [])

  // 处理致命错误
  const onFatalErrorHandle = (args?: { code?: number }) => {
    const code = typeof args?.code !== 'undefined' ? `\n(${String(args.code)})` : ''
    Modal.show({
      title: '出错了',
      content: `我们连接出现未知错误\n请重新试试${code}`,
    })
  }

  // 处理进房失败
  const onEnterRoomErrorHandle = (opts?: { code?: number; message?: string }) => {
    onObHandler('enterOB', opts)
  }

  // 处理FPS变化
  const onFpsStatusChangedHandle = (options: { curFpsStatus: EFPSStatus }) => {
    const { curFpsStatus } = options
    if (EFPSStatus[curFpsStatus]) {
      const ret = onObHandler('lowFPS')
      // 只有真进入B面 才停止检测
      if (ret) {
        baseWorld.getFpsDetector().stop()
      }
    }
  }

  // 检测网络质量
  const onNetworkQualityChangedHandle = (e: { good: boolean }) => {
    if (!e.good) {
      const ret = onObHandler('badNet')
      if (ret) {
        baseWorld.getNetworkDetector().stopNetworkChecking()
      }
    }
  }

  // B面回调 enterOB包含建联 & 进房
  const onObHandler = (
    type: 'lowFPS' | 'badNet' | 'enterOB' | 'checkError',
    args?: { code?: number; message?: string },
  ) => {
    const code = typeof args?.code !== 'undefined' ? `\n(${String(args.code)})` : ''
    const modalContent: Record<typeof type, string> = {
      checkError: `你的设备/浏览器版本较低，\n目前仅可进入跟看模式${code}`,
      enterOB: `连接时出现了网络障碍\n目前仅可进入跟看模式${code}`,
      lowFPS: `模式设备运行异常\n为更好的体验\n将进入跟看${code}`,
      badNet: `受网络波动原因\n目前仅可进入跟看模式${code}`,
    }
    Modal.confirm({
      title: '很抱歉',
      content: modalContent[type],
      confirmText: '我知道了',
      onConfirm: () => {
        // 进入B面，静态图片或者视频
      },
    })
    return true
  }
}
