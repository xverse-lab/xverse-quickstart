import { ConfigTools, EAvatarComponentType, IAvatarComponent, ISkeletonAnimationBinding, World } from '@xverse/core'
import { time } from 'console'
import { BaseAvatar } from '../../../game-play/avatar'

export class avatarTest {
  public static instance: avatarTest
  constructor(private worldInstance: World) {}

  public static getInstance(worldInstance: World) {
    if (!this.instance) {
      this.instance = new avatarTest(worldInstance)
    }
    return this.instance
  }

  public clonedAvatar = (userId: string) => {
    const avatar = this.worldInstance.getPlayer(BaseAvatar)
    if (!avatar) {
      console.error(`no avatar instance with userId: ${userId} to clone`)
    }
    const clonedAvatar = this.worldInstance.spawn(BaseAvatar, true, {
      template: avatar,
      position: {
        x: avatar.position.x + 200,
        y: avatar.position.y + 200,
        z: avatar.position.z,
      },
      rotation: avatar.rotation,
      scaling: { x: 1, y: 1, z: 1 },
    })
    clonedAvatar.setNickName('cloned_avatar_' + clonedAvatar._actorId)
  }

  public teleInRoom = async (pointId: string) => {
    const room = this.worldInstance.getCurrentRoom()
    if (!room) {
      console.error('navTo: room cannot get')
      return
    }

    const point = ConfigTools.GetPoint(room, pointId)
    if (!point) return
    try {
      room.setSkinInfo({
        birthPoint: {
          player: point.point,
          camera: point.point,
        },
      })
    } catch (err) {
      console.error(err)
    }
  }
  public enlargeAvatar = (times: { x: number; y: number; z: number }) => {
    const player = this.worldInstance.getPlayer(BaseAvatar)
    player?.setScaling(times)
  }
  public shrinkAvatar = (times: { x: number; y: number; z: number }) => {
    const player = this.worldInstance.getPlayer(BaseAvatar)
    if (times.x <= 0 || times.y <= 0 || times.z <= 0) {
      return
    }
    player?.setScaling(times)
  }

  public navToBreath = async (pointId: string) => {
    const room = this.worldInstance.getCurrentRoom()
    if (!room) {
      console.error('navTo: room cannot get')
      return
    }

    const point = ConfigTools.GetPoint(room, pointId)
    if (!point) return

    this.worldInstance.movementTriggerMode = 'autoNavigation'
    this.worldInstance.joystick.hide()

    const avatar = this.worldInstance.getPlayer(BaseAvatar)
    try {
      avatar.navigateTo(point.point.position, {
        endCallback: (arrived: any) => {
          console.debug('arrived', arrived)
          this.worldInstance.movementTriggerMode = 'joystick'
          this.worldInstance.joystick.show()
        },
      })
    } catch (err) {
      console.error(err)
    }
  }

  public lookAtBreath = async (pointId: string) => {
    const room = this.worldInstance.getCurrentRoom()
    if (!room) {
      console.error('lookAt: room cannot get')
      return
    }

    const point = ConfigTools.GetPoint(room, pointId)
    if (!point) return

    const avatar = this.worldInstance.getPlayer(BaseAvatar)

    try {
      avatar.lookAt(point.point.position, {
        endCallback: () => {
          console.log('trun To end')
        },
        time: 1000,
      })
    } catch (err) {
      console.error(err)
    }
  }

  public toggleOthers = (isShowingOthers: boolean) => {
    const avatarId = this.worldInstance.getPlayer()._actorId
    this.worldInstance.avatarManager._syncedAvatarMap.forEach((avatar: any) => {
      if (!isShowingOthers) {
        if (avatar._actorId !== avatarId) avatar.hide()
      } else {
        console.log(avatar._actorId, avatarId)
        if (avatar._actorId !== avatarId) avatar.show()
      }
    })
  }

  public toggleBlockOther() {
    const state = this.worldInstance.getBlockOthersSyncInfo()
    this.worldInstance.setBlockOthersSyncInfo(!state)
  }

  public addAINpc = async (avatarId: string) => {
    const avatar = this.worldInstance.spawn(BaseAvatar)
    const configs = await this.worldInstance.configManager.getConfig()
    // 注意：这是使用非公开 API 获取数据，不建议这么操作，这里只是灵活测试各种 avatar
    const config = configs.config.avatarList.find((item: any) => item.id === avatarId)
    if (!config) {
      console.warn('can not found avatar config')
      return
    }
    const skeleton = config.componentList.find((item: any) => item.type === 'SKELETON')
    const animations = config.componentList.find((item: any) => item.type === 'ANIMATION')
    const body = config.componentList.find((item: any) => item.type === EAvatarComponentType.Body)
    const clothes = config.componentList.find((item: any) => item.type === EAvatarComponentType.Clothes)
    const shoes = config.componentList.find((item: any) => item.type === EAvatarComponentType.Shoes)
    const hair = config.componentList.find((item: any) => item.type === EAvatarComponentType.Hair)
    const pants = config.componentList.find((item: any) => item.type === EAvatarComponentType.Pants)

    const walkAnimation = animations.unitList.find((item: any) => item.name.toLowerCase().indexOf('walk') > -1)
    const idleAnimation = animations.unitList.find((item: any) => item.name.toLowerCase().indexOf('idle') > -1)
    let runAnimation = animations.unitList.find((item: any) => item.name.toLowerCase().indexOf('run') > -1)
    if (!runAnimation) runAnimation = walkAnimation

    const skeletonPath = skeleton.unitList[0].id
    const animationList = [
      {
        animationName: 'Idle',
        path: idleAnimation.id,
      },
      {
        animationName: 'Walking',
        path: walkAnimation.id,
      },
      {
        animationName: 'Running',
        path: runAnimation.id,
      },
    ] as ISkeletonAnimationBinding[]

    //智能语音说话所需嘴部动作绑定
    const blendShape = animations.unitList.find(
      (item: { name: string }) => item.name.toLowerCase().indexOf('blendshape') > -1,
    )
    if (blendShape)
      animationList.push({
        animationName: 'BlendShape',
        path: blendShape.id,
      })

    avatar.setSkeletonAnimation({
      skeleton: skeletonPath,
      skeletonAnimations: animationList,
    })

    const components: IAvatarComponent[] = [{ type: EAvatarComponentType.Body, path: body.unitList[0].id as string }]
    if (shoes)
      components.push({
        type: EAvatarComponentType.Shoes,
        path: shoes.unitList[0].id as string,
      })
    if (clothes)
      components.push({
        type: EAvatarComponentType.Clothes,
        path: clothes.unitList[0].id as string,
      })
    if (pants)
      components.push({
        type: EAvatarComponentType.Pants,
        path: pants.unitList[0].id as string,
      })
    if (hair)
      components.push({
        type: EAvatarComponentType.Hair,
        path: hair.unitList[0].id as string,
      })

    avatar.changeComponents(components)
    avatar.priority = 1 //这个是需要的
    await avatar.init()
    return avatar
  }
}
