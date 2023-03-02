import {
  Avatar,
  World,
  IWorldOptions,
  IAvatarComponent,
  ISkeletonAnimationBinding,
  IVATAnimationBinding,
  INickNameOptions,
} from '@xverse/core'
import { BaseAvatar } from './avatar'
import { BaseEventBus } from './event-bus'
import { injectHttpHook } from './inject-http-hook'

export interface IClonedAvatarData {
  components: IAvatarComponent | IAvatarComponent[]
  nickname: INickname
  vat: string
  skeletonAnimations: ISkeletonAnimationBinding[]
  skeleton: string
  vatAnimations: IVATAnimationBinding[]
}

interface INickname {
  text: string
  options?: INickNameOptions | undefined
}
export interface ITmeWorldOptions extends IWorldOptions {
  /**
   * 是否添加 tbundle ，默认 false
   */
  useTbundle?: boolean
  /**
   * 资源请求的 hostname
   */
  cdnHost?: string
}

export class BaseWorld extends World {
  private _nicknameVisible = true
  private _othersVisible = true
  public baseEventBus = new BaseEventBus(this)
  public useTbundle = false

  constructor(options: ITmeWorldOptions) {
    super(options)
    this.initEvents()
    this.useTbundle = !!options?.useTbundle || false
  }

  async init() {
    await super.init()
    if (this.useTbundle) {
      const { cdnHost } = this._options as ITmeWorldOptions
      const preloadConfig = await this.getPreload().getConfig()
      injectHttpHook(preloadConfig, cdnHost)
    }
  }

  initEvents() {
    this.baseEventBus.on('othersLoaded', this.onOthersLoaded.bind(this))
    this.baseEventBus.on('othersDisposed', this.onOthersDispose.bind(this))
  }

  /**
   * 所有角色 actor，包括自己spawn 和后端同步的，注意和avatars的区别
   */
  get avatarMaps() {
    const map: Map<string, BaseAvatar> = new Map()
    this.actorsMap.forEach((actor) => {
      if (actor instanceof Avatar) map.set(actor.userId, actor as BaseAvatar)
    })
    return map
  }

  /**
   * 设置昵称可见性
   * @param val true可见  false 不可见
   * todo 监听新角色加入
   */
  set nicknameVisible(val: boolean) {
    ;(this.avatars as BaseAvatar[]).forEach((avatar: BaseAvatar) => {
      avatar.nicknameComponent?.setEnabled(val)
    })
    this._nicknameVisible = val
  }

  get nicknameVisible() {
    return this._nicknameVisible
  }

  /**
   * 设置其他人可见性
   * @param val true可见  false 不可见
   * todo 监听新角色加入
   */
  set othersVisible(val: boolean) {
    ;(this.avatars as BaseAvatar[]).forEach((avatar: BaseAvatar) => {
      if (avatar.isSelf) return
      val ? avatar.show() : avatar.hide()
    })
    this._othersVisible = val
  }

  get othersVisible() {
    return this._othersVisible
  }

  onOthersLoaded(e: { userId: string }) {
    if (!this._othersVisible) {
      this.avatarMaps.get(e.userId)?.nicknameComponent?.setEnabled(false)
    }
    if (!this._othersVisible) {
      this.avatarMaps.get(e.userId)?.hide()
    }
  }

  onOthersDispose(e: { userId: string }) {
    console.log('🚀 ~ file: world.ts ~ line 63 ~ BaseWorld ~ onOthersDisposed ~ e', e)
  }
  onRenderError(e: any) {
    console.log('🚀 ~ file: world.ts ~ line 60 ~ BaseWorld ~ onRenderError ~ e', e)
  }

  onReconnecting(e: any) {
    console.log('🚀 ~ file: world.ts ~ line 84 ~ BaseWorld ~ onReconnecting ~ e', e)
  }

  /**
   * 克隆玩家
   * @params clonedAvatarData 角色配置
   */
  public async cloneAvatar(clonedAvatarData: IClonedAvatarData): Promise<BaseAvatar> {
    const avatar = this.spawn(BaseAvatar, true)
    const { components, nickname, vat, skeletonAnimations, skeleton, vatAnimations } = clonedAvatarData || {}
    skeleton && avatar.setSkeleton(skeleton)
    vat && avatar.setVAT(vat)
    if (vatAnimations && vatAnimations.length) {
      avatar.setVatAnimationInstanceBinding(vatAnimations)
    }
    if (skeletonAnimations && skeletonAnimations.length) {
      avatar.setAnimationInstanceBinding(skeletonAnimations)
    }
    components && avatar.changeComponents(components)
    nickname && avatar.setNickName(nickname.text, nickname.options)
    avatar.priority = 0
    await avatar.init()
    return avatar
  }
}
