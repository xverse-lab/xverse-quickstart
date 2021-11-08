const { Xverse, XverseRoom, Avatar, CameraStates } = (window as any).XverseJS
import './style.css'
import { toast } from './toast'

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
let room: typeof XverseRoom
const ua = navigator.userAgent.toLowerCase()

/**
 * 代表用户自己。主播侧 userAvatar = hostAvatar
 */
let userAvatar: typeof Avatar | null = null
/**
 * 代表主播
 */
let hostAvatar: typeof Avatar | null = null

const app = new Vue({
  el: '#app',
  data() {
    return {
      isWexin: ua.indexOf('micromessenger') != -1,
      loaded: false,
      showAnimation: false, // 展示动画面板
      showMinimap: false, // 展示导航地图
      showGiftModal: false, // 展示礼物 modal
      showDress: false, //展示换装
      selectedGift: {},
      isHost: true,
      minimapList: [],
      centerPoint: null,
      showGiftPanel: false,
      activeGiftId: '',
      giftList: [],
      isCameraInCloseUpState: false,
      roomId: '',
      isMoving: false, // 主播是否在行进
      animations: [],
      activeMinimap: '',
      gitfs: [],
      someoneSendingGift: false,
      currentDirection: null,
      bornPic: '',
      avatarInfo: null,
      showSkins: false,
      previewingSkinId: '',
      skinId: '',
      cameraFollowing: false,
      isAvatarShow: true,
    }
  },
  mounted() {
    if (!this.isWexin) {
      this.initRoom()
    }
  },
  beforeDestroy() {
    this.leave()
  },
  methods: {
    async initRoom() {
      const urlParam = new window.URLSearchParams(location.search)
      const roomId = urlParam.get('roomId') || '5fca7c24-cb1a-491f-9944-35b90d23d4dd' // roomId
      const userId = urlParam.get('userId') || Math.random().toString(16).slice(2) // 业务方的 uid
      this.userId = userId
      const appId = (urlParam.get('appId') || import.meta.env.VITE_APPID) as string
      const skinId = (urlParam.get('skinId') || import.meta.env.VITE_SKINID) as string
      const wsServerUrl = urlParam.get('ws') ? decodeURIComponent(urlParam.get('ws')!) : 'wss://uat-eks.xverse.cn/kugou/ws' // 测试用后台，后面正式环境可以不传
      const avatarId = urlParam.get('avatarId') || '84c44466-b1df-4098-80e3-e0c49628a012' // 测试用 avatarId
      const role = urlParam.get('role') || (roomId ? 'audience' : 'host') // 主态 or 客态。默认主态
      const skinDataVersion = urlParam.get('skinDataVersion') || '1000200002'

      const xverse = new Xverse({
        debug: true
      })

      try {
        room = await xverse.joinRoom({
          canvas: canvas,
          skinId: skinId,
          avatarId: avatarId,
          roomId: roomId!,
          userId,
          role: role!,
          appId: appId,
          skinDataVersion,
          wsServerUrl
        })
      } catch (error) {
        console.error(error)
        alert(error)
        return
      }
      console.log('加入房间成功')
      app.loaded = true
      app.minimapList = room.minimapList
      app.isHost = room.isHost
      app.roomId = room.id
      // 设置电视播放
      this.setVideo()
      this.bindEvent()
    },

    /**
     * 设置电视播放
     */
    setVideo() {
      setTimeout(function () {
        room.tv?.setUrl({ url: 'https://static.xverse.cn/wasm/v7/xverse_tv_840x480_1K.mp4' })
      }, 5000)
    },

    syncVideoProgress() {
      room.tv.setCurrentTime({ currentTime: 20000 })
    },
    /**
     * 点击行进至目标点
     * @param item
     */
    moveTo(item: any) {
      app.showMinimap = false
      if (app.activeMinimap === item.id) {
        if (!room.camera.isInDefaultView()) {
          room.camera.turnToFace({ extra: 'turnToFace by business' })
        }
      } else {
        userAvatar?.moveTo({
          point: item.position,
          extra: JSON.stringify({ extra: 'for test, 查看中文乱码情况' }),
        })
      }
    },
    playAnimation(animationName: string) {
      if (userAvatar?.isMoving) {
        toast('主播正在行进，不允许播放动画')
        return
      }
      userAvatar?.playAnimation({ animationName, loop: true, extra: JSON.stringify({ messageId: '中文ID' }) })
    },
    // 退出房间
    leave() {
      room.leave()
    },
    bindEvent() {
      room.on('avatarChanged', ({ avatars }) => {
        avatars.forEach(avatar => {
          avatar.scale !== 0.6 && avatar.setScale(0.6)
          !avatar.isLoading && (avatar.nickname = avatar.id)
        })
        console.log('avatar 变化', avatars)
        // 主播侧，userAvatar == hostAvatar，观众侧 userAvatar !== hostAvatar
        userAvatar = avatars.filter((av: Avatar) => av.id == app.userId)[0]
        hostAvatar = avatars.filter((av: Avatar) => av.isHost === true)[0]

        app.animations = userAvatar.animations
        // 主播
        if (hostAvatar) {
          hostAvatar.removeAllListener()

          hostAvatar.on('animationStart', ({ animationName, extra }) => {
            console.log('主播开始动作', animationName, '额外信息', extra)
          })
          hostAvatar.on('animationEnd', ({ animationName, extra }) => {
            console.log('主播结束动作', animationName, '额外信息', extra)
          })
          hostAvatar.on('stopMoving', async ({ extra }) => {
            app.isMoving = false
            console.log('主播结束移动', userAvatar, extra)
          })
          hostAvatar.on('startMoving', ({ extra }) => {
            console.log('主播开始移动', userAvatar, extra)
            app.isMoving = true
          })
          hostAvatar.on('positionChanged', ({ currentArea }) => {
            app.activeMinimap = currentArea
          })
        }

        if (userAvatar) {
          // userAvatar.on('viewChanged', ({ extra }) => {
          //   console.log('监听avatar视角变化(rotateTo):', extra)
          // })
        }
      })

      room.on('reconnecting', function () {
        toast('重连中')
      })

      room.on('reconnected', function () {
        toast('重连成功')
      })

      room.on('disconnected', function () {
        toast('连接失败')
      })
    },
 
  },
})

window.app = app