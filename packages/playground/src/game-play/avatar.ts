import {
  Avatar,
  EBillboardMode,
  EAttachRule,
  XTextSource,
  SubSequence,
  RichSurface,
  EDefaultMeshType,
  ConfigTools,
  ETextAlignMode,
  XStaticTextureSource,
} from '@xverse/core'
import { TV } from './rich-surface/tv'

interface IOuterSyncData {
  mood: string
  word: string
}

interface IMeshOption {
  type?: EDefaultMeshType
  width?: number
  height?: number
  rotation?: { pitch: number; yaw: number; roll: number }
  position?: { x: number; y: number; z: number }
}

//聊天气泡保持时长10s
const WordsDuration = 10000
export class BaseAvatar extends Avatar {
  private currentEffect: SubSequence | null = null
  public syncData: IOuterSyncData = {} as IOuterSyncData
  public wordRichSurface?: RichSurface
  private topTv?: TV
  private sayTimer?: number
  public static wordsBackgrounds: string[] = [
    'https://app-asset-1258211750.file.myqcloud.com/1/textures/bubble01.png',
    'https://app-asset-1258211750.file.myqcloud.com/1/textures/bubble02.png',
    'https://app-asset-1258211750.file.myqcloud.com/1/textures/bubble03.png',
  ]
  private _topImages: Map<string, RichSurface> = new Map()

  /** 角色头顶设置图片或按钮
   * @params bomId 图片或按钮的bomId
   * imgUrl 图片或按钮背景图的Url
   * meshOption 配置
   */
  public async setImage(params: { bomId?: string; imgUrl?: string; meshOption?: IMeshOption }) {
    let assetPath = 'https://app-asset-1258211750.file.myqcloud.com/1/textures/bubble01.png'
    try {
      if (params.bomId)
        assetPath = ConfigTools.GetAssetByBom(this.getWorld().getCurrentRoom()!, params.bomId)?.url || assetPath
    } catch (error) {
      console.error('error ===>', error)
    }
    if (params.imgUrl) assetPath = params.imgUrl
    if (!assetPath) return
    const img = this.getWorld().spawn(RichSurface)
    await img.addMeshAsync({
      defaultMeshOption: {
        type: EDefaultMeshType.Plane,
        width: params.meshOption?.width || 40,
        height: params.meshOption?.height || 40,
        rotation: params.meshOption?.rotation || { pitch: 0, yaw: 0, roll: 90 },
        position: params.meshOption?.position || {
          ...this.position,
          z: this.position.z + 235,
        },
      },
    })
    const staticTexture = new XStaticTextureSource()
    staticTexture.setMedia(assetPath, { textureHasAlpha: true })
    img.rootComponent.billboardMode = EBillboardMode.All
    img.setMediaSource(staticTexture)
    img.attachToActor(this, '', {
      positionRule: EAttachRule.KeepWorld,
      rotationRule: EAttachRule.KeepWorld,
      scalingRule: EAttachRule.KeepWorld,
    })
    const height = this.height || 140
    img.position = { x: 0, y: 0, z: (height + 20) / this.scaling.z }
    this._topImages.set(assetPath, img)
    img.on('click', () => {
      console.debug('image click ', params.bomId)
    })
  }

  public disposeImage(bomId: string) {
    bomId = 'https://app-asset-1258211750.file.myqcloud.com/1/textures/bubble01.png'

    console.log('bomId', bomId)
    console.log(this._topImages)
    if (!this._topImages.has(bomId)) return
    console.log('has')

    const img = this._topImages.get(bomId)
    img?.dispose()
    this._topImages.delete(bomId)
  }

  public async syncSetMood(effectId: string) {
    await this.setMood(effectId)
    Object.assign(this.syncData, {
      mood: effectId,
    })

    this.sendSyncData()
  }

  public async syncSay() {
    const nickname = '游客' + this.userId.slice(0, 4)
    await this.say(nickname)
    Object.assign(this.syncData, {
      word: encodeURIComponent(nickname),
    })
    this.sendSyncData()
  }

  public sendSyncData() {
    this.setSyncInfo(JSON.stringify(this.syncData))
  }

  public appendTv() {
    if (this.topTv) return
    const tv = this.getWorld().spawn(TV, false)
    this.topTv = tv
    tv.init('85389b13626395d8', 'https://app-asset-1258211750.file.myqcloud.com/1/media/MotherNature.mp4')
    tv.attachToActor(this, '', {
      positionRule: EAttachRule.KeepRelative,
      rotationRule: EAttachRule.KeepRelative,
      scalingRule: EAttachRule.KeepRelative,
    })
    tv.position = { ...this.position, z: this.position.z + 150 }
  }

  /**
   * 心情挂件因为跨房间最好做成与房间资产无关的挂件，这里用特效实现只是为了测试效果。后续新的应该做成挂件
   * @param effectId
   * @returns
   */
  public async setMood(effectId: string) {
    this.currentEffect?.dispose()
    const sequence = this.getWorld().spawn(SubSequence)
    sequence.attachToActor(this)
    sequence.position = { ...sequence.position, z: sequence.position.z + 150 }
    this.currentEffect = sequence
    const asset = ConfigTools.GetAssetByBom(this.getWorld().getCurrentRoom()!, effectId)
    if (!asset) return

    await sequence.init(asset.url)
    sequence.play()
  }

  // TODO: silent
  public async say(wordsText: string) {
    if (this.sayTimer !== undefined) {
      window.clearTimeout(this.sayTimer)
      this.sayTimer = undefined
    }

    const heights = [80, 140, 200]
    const paddingTops = [5, 5, 5]
    const paddingBottoms = [15, 15, 15]

    const position_z_arr = [235, 245, 255]

    //init textword
    const currentSlot = 0 // 当前正在处理的栏目编号，从0开始，最大值为 widthSlotNum * heightSlotNum - 1
    const width = 480 // 气泡宽度
    let height = 200 // 气泡高度
    const widthSlotNum = 1 // 宽度上的栏目数量
    const heightSlotNum = 1 // 高度上栏目数量
    const fontSize = 45 // 字号
    const textword = new XTextSource()
    textword.init({
      width: width,
      height: height,
      widthSlotNum: widthSlotNum,
      heightSlotNum: heightSlotNum,
    })

    let { lines } = textword.statisticWord(wordsText, {
      currentSlot: currentSlot,
      font: 'black-body',
      fontWeight: 500,
      fontSize: fontSize,
      paddingLeft: 30,
      paddingRight: 15,
    })
    if (lines > 3) lines = 3

    // update
    if (this.wordRichSurface) {
      this.wordRichSurface.dispose()
      delete this.wordRichSurface
    }

    if (!this.wordRichSurface) {
      this.wordRichSurface = this.getWorld().spawn(RichSurface, false)
      height = heights[lines - 1]
      const paddingTop = paddingTops[lines - 1]
      const paddingBottom = paddingBottoms[lines - 1]

      textword.init({
        width: width,
        height: height,
        widthSlotNum: widthSlotNum,
        heightSlotNum: heightSlotNum,
      })

      const position_z = position_z_arr[lines - 1]
      const backgroundUrl = BaseAvatar.wordsBackgrounds?.[lines - 1]
      await this.wordRichSurface.addMeshAsync({
        defaultMeshOption: {
          type: EDefaultMeshType.Plane,
          width: width / 4,
          height: height / 4,
          rotation: { pitch: 180, yaw: 180, roll: 90 }, //引擎角度和ue角度对起相差180,
          position: { ...this.position, z: this.position.z + position_z },
        },
      })

      await textword.setMedia(wordsText, {
        clearArea: true,
        currentSlot: currentSlot,
        fontSize: fontSize, // 字体大小
        font: 'black-body', // 字体
        color: '#ffffff', // 颜色
        fontWeight: 500, // 粗细
        paddingTop: paddingTop,
        paddingLeft: 30,
        paddingRight: 15,
        paddingBottom: paddingBottom,
        backgroundUrl: backgroundUrl, // 背景图
        alignMode: ETextAlignMode.Left,
      })
      this.wordRichSurface.setMediaSource(textword)
      this.wordRichSurface.rootComponent.billboardMode = EBillboardMode.All
      this.wordRichSurface.attachToActor(this, '', {
        positionRule: EAttachRule.KeepWorld,
        rotationRule: EAttachRule.KeepWorld,
        scalingRule: EAttachRule.KeepWorld,
      })
      textword.getTexture().words = wordsText
      const heightCopy = this.height || 140
      this.wordRichSurface.position = {
        x: 0,
        y: 0,
        z: (heightCopy + 20) / this.scaling.z,
      }
    }

    if (WordsDuration) {
      window.clearTimeout(this.sayTimer)
      this.sayTimer = window.setTimeout(() => {
        this.wordRichSurface?.dispose()
        delete this.wordRichSurface
      }, WordsDuration)
    }
  }

  public onReceiveSyncInfo({ data }: any): void {
    console.debug('收到同步消息', this.userId, data)
    if (!data) return
    const { mood, word } = JSON.parse(data)
    if (mood) {
      this.setMood(mood)
    }

    if (word) {
      const decodedWord = decodeURIComponent(word)
      this.say(decodedWord)
    }
  }

  public onDispose(): void {
    this.currentEffect?.dispose()
    this.wordRichSurface?.dispose()
  }

  public onLoad(): void {
    // 在加载完成后设置昵称
    console.log('set nick after load')
    const nickName = '游客' + this.userId.slice(0, 3)
    this.setNickName(nickName)
  }
}
