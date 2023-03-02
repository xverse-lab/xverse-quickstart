import {
  EAvatarComponentType,
  EFPSStatus,
  ELoggerLevels,
  EVoiceGroupUserAuth,
  IAvatarComponent,
  IGroupInfo,
  IMoveEndEvent,
  IPosition,
  ISkinInfoSetting,
  IVoiceGroupUserInfo,
  IWorldOptions,
  ISkeletonAnimationBinding,
  Room,
  World,
  preDetect,
  ICheckStage,
  uaParser,
} from '@xverse/core'
import { Button, FloatingBubble, List, Modal, Toast } from 'antd-mobile'
import { FocusEventHandler, useEffect, useRef, useState } from 'react'
import loadingImage from './assets/loading.png'
import { ISelectProps } from './components/select'
import Hls from 'hls.js'
import { g } from './components/global'
import { AvatarBtns } from './components/test-util/avatar/avatar-btns'
import { DebugBtns } from './components/test-util/debug/debug'
// import { OtherBtns } from './components/test-util/other/other-btns'
import { WorldBtns } from './components/test-util/world/world-btns'
import { BaseAvatar } from './game-play/avatar'
import { AvatarDemo } from './examples/avatar'
import { BaseWorld } from './game-play/world'

const VWAvatarId = 'c0cd771b1f3439af'
const VWReleaseId = '2302171641_93a991'
export const AIAvatarId = 'e24a5e9dbc868397' //需要确保上面的rid中含有这个角色，需要有嘴部动作
// const VWReleaseId = '2211081053_825b7b'
const VWAppId = '11020'
const TechnologyExhibitionAppId = '11016'
const VisibilityRuleRoom = '11022'
const viewModesConfig = [
  {
    label: 'simple',
    value: 'simple',
  },
  {
    label: 'serverless',
    value: 'serverless',
  },
]

const localTexturePathMap = {
  c933d0f441251c97: 'f6dc32e0e84f9cc6',
  af16a7fcff9a201a: '5a93d82a71ce52dd',
  f4f56a125d49bc8c: 'd383f739f6275e2b',
}

const urlParam = new window.URLSearchParams(location.search)
const userId = urlParam.get('userId') || Math.random().toString(16).slice(2)
const appId = urlParam.get('appId') || VWAppId
const releaseId = urlParam.get('releaseId') || VWReleaseId
const roomId = urlParam.get('roomId') || localStorage.getItem('roomId') || undefined
const skinId = urlParam.get('skinId') || undefined
const pathId = urlParam.get('pathId') || undefined
const pointId = urlParam.get('pointId') || undefined
let wid = urlParam.get('worldId') || undefined
const wsServerUrl = urlParam.get('ws') ? decodeURIComponent(urlParam.get('ws')!) : undefined
const scheduleUrl = urlParam.get('scheduleUrl') ? decodeURIComponent(urlParam.get('scheduleUrl')!) : undefined
const debug = urlParam.get('debug')
const preload = !!urlParam.get('preload')
const eruda = !!urlParam.get('eruda')
const from_console = !!urlParam.get('from_console')
const analyze = !!urlParam.get('analyze')
const auto_test = !!urlParam.get('auto_test')

export const avatarId = urlParam.get('avatarId') || VWAvatarId

const isShowObVideo = urlParam.get('isShowOb') || undefined
if (debug) {
  World.SetLoggerLevels(ELoggerLevels.Debug)
}

export function setFingerprint() {
  const key = 'p_userId'
  const userId = localStorage.getItem(key)
  if (!userId) {
    const genUserId = Math.random().toString(16).slice(2)
    localStorage.setItem(key, genUserId)
    return genUserId
  }
  return userId
}

Toast.config({
  duration: 3000,
  position: 'top',
})

let worldInstance: World
let handleInterval: () => Promise<void> | undefined
const intervalHandler: number = window.setInterval(() => {
  if (typeof handleInterval === 'function') {
    handleInterval()
  }
}, 1000)

function App() {
  const [showFunctionList, setShowFunctionList] = useState(true)
  const [roomsConfigs, setRoomConfigs] = useState<ISelectProps<string>['options']>([])
  const [skinConfigs, setSkinConfigs] = useState<ISelectProps<string>['options']>([])
  const [pathConfigs, setPathConfigs] = useState<ISelectProps<string>['options']>([])
  const [status, setStatus] = useState<'initial' | 'inited' | 'entered' | 'failed'>('initial')
  const [pointConfigs, setPointConfigs] = useState<ISelectProps<string>['options']>([])
  const [progress, setProgress] = useState('')
  const [showFunctionFloatingBubble, setShowFunctionFloatingBubble] = useState(false)
  const [voiceUserList, setVoiceUserList] = useState<IVoiceGroupUserInfo[]>([])
  const [fpsStatus, setFPSStatus] = useState(EFPSStatus.Good)
  const [isShowFpsStatus, setIsShowFpsStatus] = useState(true)
  const [isNetworkGood, setIsNetworkGood] = useState(-1)
  const [viewMode, setViewMode] = useState<string>('')
  const [isInGroup, setIsInGroup] = useState(false)
  const [panoramaActived, setPanoramaActived] = useState(false)
  const [showBackground, setShowBackground] = useState(false)
  const [backToMain, setBackToMain] = useState(false)
  const obVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const viewMode = localStorage.getItem('viewMode') || viewModesConfig[0].value
    setViewMode(viewMode)
    //科技展/众创空间
    if (appId !== TechnologyExhibitionAppId && appId !== VisibilityRuleRoom)
      sessionStorage.setItem('originURL', location.href)
  }, [])

  useEffect(() => {
    if (!viewMode) return
    if (isShowObVideo) {
      showObVideo()
      return
    }
    init()
  }, [viewMode])

  const init = async () => {
    // 独立检测逻辑
    // try {
    //   const wid = 'e629ef3e-022d-4e64-8654-703bb96410eb'
    //   const worldOptions: IWorldOptions = {
    //     canvas: 'canvas',
    //     appId: appId,
    //     userId: userId,
    //     env: 'sit',
    //     token: 'token',
    //     wsServerUrl: wsServerUrl,
    //     scheduleUrl: scheduleUrl,
    //     releaseId: releaseId,
    //     worldId: wid,
    //     serverless: viewMode === 'serverless',
    //     // forbiddenWatermark: true,
    //   }

    //   await preDetect(worldOptions, (stage: ICheckStage) => {
    //     console.log(stage)
    //     Toast.show(stage)
    //   })
    // } catch (error) {
    //   console.error(error)
    //   Modal.alert({
    //     content: String(error),
    //     onConfirm: () => {
    //       location.reload()
    //     },
    //     confirmText: '重新进入',
    //     style: {
    //       zIndex: 10000,
    //     },
    //   })
    // }
    // return

    try {
      worldInstance = await createWorld()
      worldInstance.getFpsDetector().on('fpsStatusChanged', ({ curFpsStatus }) => {
        console.error('setFPSStatus', curFpsStatus)
        setFPSStatus(curFpsStatus)
      })
    } catch (error) {
      console.error(error)
      Modal.alert({
        content: String(error),
        onConfirm: () => {
          location.reload()
        },
        confirmText: '重新进入',
        style: {
          zIndex: 10000,
        },
      })
      return
    }
    const avatarDemo = new AvatarDemo(worldInstance as BaseWorld)
    await avatarDemo.initAvatar(avatarId)
    setStatus('inited')
    // 从 world 上读取所有可以切换的 room，如果换成用户，可能直接从他们的配置系统读取

    //如果URL传递了analyze参数,则关闭卡顿分析
    //默认打开
    if (analyze) {
      worldInstance._dataKeeper.stopAnalyze()
    }
  }

  const createWorld = async () => {
    if (!wid) {
      wid = 'e629ef3e-022d-4e64-8654-703bb96410eb'
    }
    const worldOptions: IWorldOptions = {
      canvas: 'canvas',
      appId: appId,
      userId: userId,
      env: 'sit',
      token: 'token',
      wsServerUrl: wsServerUrl,
      scheduleUrl: scheduleUrl,
      releaseId: releaseId,
      worldId: wid,
      serverless: viewMode === 'serverless',
      // forbiddenWatermark: true,
    }
    const world = new World(worldOptions)
    ;(window as any).world = world
    ;(window as any).toast = Toast
    ;(window as any).uaParser = uaParser

    await world.init()

    world.getPreload().on('progress', ({ current, total }) => {
      const progressText = `(${current}/${total})`
      setProgress(progressText)
    })

    world.getPreload().on('timeout', ({ url, size }) => {
      console.warn(`资源下载即将超时，当前下载资源url：${url}，资源大小${size}`)
    })

    await world.getPreload().start(
      (current, total) => {
        // const progressText = `(${current}/${total})`
        // setProgress(progressText)
      },
      //,
      // {
      //   filterCallback: (item: IPreloadItemConfig, index: number, array: IPreloadItemConfig[]): boolean => {
      //     if (
      //       item.assetUrl.includes(
      //         'https://console-appasset-1258211750.file.myqcloud.com/1/effects/b33371545a1941c8957fc0224c5fcb74/FX_Water_A',
      //       )
      //     ) {
      //       return false
      //     } else {
      //       return true
      //     }
      //   },
      // },
    )

    console.debug('初始化世界成功')
    world.DefaultAvatarClass = BaseAvatar
    g.world = world

    world.on('disconnected', () => {
      Modal.alert({
        content: '与服务器失去连接',
        onConfirm: () => {
          location.reload()
        },
      })
    })
    world.on('reconnected', () => {
      Toast.show('重连成功')
    })
    world.on('reconnecting', () => {
      Toast.show('尝试重连中...')
    })
    world.on('repeatLogin', () => {
      Toast.show('重复登录被挤掉线了')
    })
    world.on('userKicked', () => {
      Modal.alert({
        content: '被服务器踢出了世界',
        onConfirm: () => {
          location.reload()
        },
        confirmText: '重新进入',
      })
    })

    world.on('fatalError', () => {
      Modal.alert({
        content: '发生异常，请重新进入',
        onConfirm: () => {
          location.reload()
        },
        confirmText: '重新进入',
      })
    })

    world.getNetworkDetector()?.on('networkQuality', (res) => {
      setIsNetworkGood(res.good ? 1 : 0)
    })
    world.voiceGroup.on('groupInfo', (groupInfo) => {
      handleGetGroupUserInfo(groupInfo)
    })

    return world
  }

  const toggleFunctionList = (open: boolean) => {
    setShowFunctionList(open)
    setShowFunctionFloatingBubble(!open)
  }

  const updateSkinConfigs = () => {
    const skinConfigs = worldInstance
      .getCurrentRoom()
      ?.getRoomConfig()
      .skinList.map((item) => {
        return {
          label: item.name + '-' + item.id,
          value: item.id,
        }
      })

    const room = worldInstance.getCurrentRoom()
    if (!room) return

    const pathConfigs = worldInstance.getCurrentRoom()?.currentSkinConfig?.pathList.map((item) => {
      return {
        label: item.name + '-' + item.id,
        value: item.id,
      }
    })

    const pointConfigs = worldInstance.getCurrentRoom()?.currentSkinConfig?.pointList.map((item) => {
      return {
        label: item.name,
        value: item.id,
      }
    })

    skinConfigs && setSkinConfigs(skinConfigs)
    pathConfigs && setPathConfigs(pathConfigs)
    pointConfigs && setPointConfigs(pointConfigs)
  }

  const handleBroadcast: FocusEventHandler<HTMLInputElement> = (e) => {
    console.debug(e)
    // (worldInstance.currentRoom as VrRoom).startBroadcast('')
  }

  const handleGetGroupUserInfo = async (groupInfo: IGroupInfo) => {
    const userList = groupInfo.users
    setVoiceUserList(userList)
  }

  const showObVideo = () => {
    // bind them together
    const obVideoSrc = 'https://joy-live-pull.xverse.cn/office-221024/bside.m3u8'
    if (Hls.isSupported() && obVideoRef.current) {
      const hls = new Hls()
      hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        console.log('manifest loaded, found ' + data.levels.length + ' quality level')
        obVideoRef.current?.play()
        obVideoRef.current?.style.setProperty('visibility', 'visible')
      })
      hls.loadSource(obVideoSrc)
      // bind them together
      hls.attachMedia(obVideoRef.current)

      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // try to recover network error
              console.log('fatal network error encountered, try to recover')
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('fatal media error encountered, try to recover')
              hls.recoverMediaError()
              break
            default:
              // cannot recover
              hls.destroy()
              alert({
                content: '跟看出现错误',
                onConfirm: () => {
                  location.reload()
                },
                confirmText: '重新进入',
              })
              break
          }
        }
      })
    } else if (obVideoRef.current && obVideoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      obVideoRef.current.src = obVideoSrc
      obVideoRef.current.style.setProperty('visibility', 'visible')

      obVideoRef.current.play()
    } else {
      alert('您的设备不支持跟看')
    }
  }

  const handleClickBubble = () => {
    if (showFunctionList) toggleFunctionList(false)
    else toggleFunctionList(true)
    if (showBackground) {
      setBackToMain(true)
    }
  }

  const hideBtnList = (open: boolean) => {
    setShowBackground(open)
    if (!open) {
      setBackToMain(false)
      return
    }
    toggleFunctionList(false)
  }

  const worldBtnsProps = {
    appId: appId,
    releaseId: releaseId,
    avatarId: avatarId,
    roomsConfigs: roomsConfigs,
    roomId: roomId,
    skinConfigs: skinConfigs,
    viewModesConfig: viewModesConfig,
    pathConfigs: pathConfigs,
    skinId: skinId,
    pathId: pathId,
    viewMode: viewMode,
    from_console: from_console,
    updateSkinConfigs: updateSkinConfigs,
    worldInstance: worldInstance,
    setViewMode: setViewMode,
    panoramaActived: panoramaActived,
  }
  const otherBtnsProps = {
    worldInstance: worldInstance,
    isInGroup: isInGroup,
    setIsInGroup: setIsInGroup,
  }

  const avatarBtnsProps = {
    worldInstance: worldInstance,
    userId: userId,
    pointConfigs: pointConfigs,
    pointId: pointId,
    avatarId: avatarId,
    backMainPage: backToMain,
    hideBtnList: hideBtnList,
  }

  const debugBtnsProps = {
    worldInstance: worldInstance,
    setIsShowFpsStatus: setIsShowFpsStatus,
  }
  const renderButtons = () => {
    return (
      <>
        {
          <FloatingBubble
            axis="y"
            style={{
              '--initial-position-bottom': '15px',
              '--initial-position-right': '5px',
            }}
            onClick={handleClickBubble}
          >
            {showFunctionFloatingBubble && showBackground ? '返回' : showFunctionFloatingBubble ? '展开' : '收起'}
          </FloatingBubble>
        }

        <div className="function-list" style={{ display: showFunctionList ? 'block' : 'none' }}>
          <WorldBtns {...worldBtnsProps} />
          <AvatarBtns {...avatarBtnsProps} />
          {/* <OtherBtns {...otherBtnsProps} /> */}
          <DebugBtns {...debugBtnsProps} />
        </div>
      </>
    )
  }

  const renderLoading = () => {
    return (
      <div className="loading" id="loading">
        <img src={loadingImage} alt="" />
        <div>即将进入场景 {progress}</div>
      </div>
    )
  }

  // 废弃
  const preparePlayer = () => {
    const avatar = worldInstance.getPlayer(BaseAvatar)

    const componentsData = localStorage.getItem(setFingerprint())
    console.debug('缓存装扮', componentsData)
    // const components = []
    // if (componentsData) {
    //   try {
    //     components = JSON.parse(componentsData)
    //   } catch (error) {
    //     console.error(error)
    //   }
    // } else {
    //   setTimeout(() => {
    //     Toast.show('未存储装扮，请自行换装')
    //   }, 1000)
    // }

    avatar.priority = 0

    avatar.setSkeleton('45ad1ec4ee124eef8820d281a31ec628')
    avatar.setAnimationInstanceBinding([
      {
        animationName: 'Idle',
        path: '5040eef7a89c4a9e9039799be54d4910',
      },
      {
        animationName: 'Walking',
        path: '77e5110a72ea485390632daade14517f',
      },
      {
        animationName: 'Running',
        path: '4ca10c7a7a364bfead359260d2fb1797',
      },
    ])
    avatar.changeComponents([
      {
        type: EAvatarComponentType.Body,
        path: '12fb7bd3c7254fc283bbcdc4e9d6b760',
      },
    ])
    // avatar.setVAT('1a8fd2f01ac04660b2848e96e7afd669')

    // avatar.setVatAnimationInstanceBinding([
    //   {
    //     animationName: 'Idle',
    //     path: '6765984d3ea846afa4d8696c7dc77623',
    //   },
    //   {
    //     animationName: 'Walking',
    //     path: 'fbf5224eef9441f0b9b721d2a060ff70',
    //   },
    //   {
    //     animationName: 'Running',
    //     path: 'c1955e8032924ceaab1f01b4d901692d',
    //   },
    // ])

    avatar.init()
  }

  const enterWorld = async () => {
    const roomConfigs = worldInstance.getRoomConfigs().map((item) => {
      return {
        label: item.name,
        value: item.id,
      }
    })
    // 设置 UI 数据
    setRoomConfigs(roomConfigs)

    const targetRoomId = roomId || roomConfigs[0].value
    const TargetRoomClass = Room

    const targetRoom = worldInstance.getRoomInstance(targetRoomId, TargetRoomClass)
    targetRoom?.on('pathChanged', () => {
      setPanoramaActived(worldInstance.panorama.actived)
    })
    if (!targetRoom) return

    const roomInfo: ISkinInfoSetting = {}
    if (roomId) {
      // 设置了 roomId 才能设置二级参数
      if (skinId) roomInfo.skinId = skinId
      if (pathId) roomInfo.pathId = pathId
    }

    // todo 待rid更新，添加全景图bomid
    if (viewMode === 'serverless' && targetRoom.skinInfo.skinId === '15156') {
      roomInfo.pathId = 'af16a7fcff9a201a'
      roomInfo.localTextureBomId = localTexturePathMap['af16a7fcff9a201a']
    }
    if (!targetRoom) {
      alert('无效 roomId ' + (roomId || ''))
      return
    }

    // 临时逻辑
    // roomInfo.combinationId = '0'
    // 把 URL 上的参数设置过来
    targetRoom.setSkinInfo(roomInfo)

    try {
      await targetRoom.enter()
    } catch (error) {
      console.error(error)
      Toast.show({
        content: String(error),
      })
      setStatus('failed')
      return
    }
    setStatus('entered')
    updateSkinConfigs()
    worldInstance.joystick.init()
    worldInstance.getKeyboard().init()

    // fps detector
    worldInstance.getFpsDetector().start()

    // 点击地面事件
    worldInstance.getClickingEvent().on('click', (pos: IPosition) => {
      // do sth
      console.log(pos)
    })

    /**
     * 配合自动化测试函数
     */

    if (auto_test) {
      console.log('auto_test')
      worldInstance._rotationEvent.clear()
      worldInstance._rotationEvent.bindPcEvents()
      // worldInstance._rotationEvent.bindMobileEvent()
      //摇杆位置添加元素
      const joystickPos = document.createElement('div')
      joystickPos.style.position = 'absolute'
      joystickPos.style.left = '125px'
      joystickPos.style.bottom = '125px'
      joystickPos.style.width = '5px'
      joystickPos.style.height = '5px'
      joystickPos.id = 'joystickPos'
      document.body.appendChild(joystickPos)
    }
  }

  const renderClickButton = () => {
    const handleClick = () => {
      enterWorld()
      setStatus('initial')
    }
    return (
      <div className="adm-mask adm-center-popup-mask" style={{ background: 'rgba(0, 0, 0, 0.55)' }}>
        <div className="adm-mask-aria-button" role="button" aria-label="遮罩层"></div>
        <Button onClick={handleClick} className="start-btn">
          点击进入世界
        </Button>
      </div>
    )
  }

  const renderCanvas = () => {
    return (
      <>
        <canvas id="canvas" style={{ pointerEvents: 'all' }} className="stream unselect"></canvas>
        {status === 'initial' && renderLoading()}
        {status === 'inited' && renderClickButton()}
        {status !== 'initial' && renderButtons()}
        <div className="networkStatus">
          网络状态: {isNetworkGood === -1 ? '检测中' : isNetworkGood === 1 ? '好' : '差'}
        </div>

        {isInGroup && (
          <List header="用户列表" style={{ position: 'absolute', left: '0', top: '0' }}>
            {voiceUserList.map((user) => {
              return (
                <List.Item>
                  <p style={{ margin: '0' }}>{`UserId: ${user.userId}`}</p>
                  <p style={{ margin: '0' }}>{`${
                    user.auth === EVoiceGroupUserAuth.SpecialGuest
                      ? '演讲者'
                      : user.auth === EVoiceGroupUserAuth.Hoster
                      ? '主持人'
                      : '听众'
                  }`}</p>
                </List.Item>
              )
            })}
          </List>
        )}
        <p
          hidden={!isShowFpsStatus}
          style={{
            position: 'absolute',
            top: '40px',
            left: '20px',
            color: 'white',
            WebkitTextStroke: '0.4px black',
            fontWeight: 'bold',
            fontSize: '14',
          }}
        >
          FPS Status: {EFPSStatus[fpsStatus]}
        </p>
      </>
    )
  }

  return (
    <div className="App">
      {/* <video
        src="https://static.xverse.cn/test/928b3699dc9740252ed85ed6b90463d5_720x1280.mp4"
        className="stream unselect"
        id="video"
      ></video> */}
      {isShowObVideo ? (
        <video
          playsInline
          muted
          ref={obVideoRef}
          id="ob-video"
          className="ob-video"
          src="https://app-asset-1258211750.file.myqcloud.com/1/media/MotherNature.mp4"
        ></video>
      ) : (
        renderCanvas()
      )}
    </div>
  )
}

export default App
