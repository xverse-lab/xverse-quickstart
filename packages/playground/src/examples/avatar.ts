import { EAvatarComponentType, IAvatarComponent, IMoveEndEvent, ISkeletonAnimationBinding } from '@xverse/core'
import { BaseAvatar } from '../game-play/avatar'
import { BaseWorld } from '../game-play/world'

export class AvatarDemo {
  constructor(private world: BaseWorld) {}

  initAvatar = async (avatarId: string) => {
    const avatar = this.world.getPlayer(BaseAvatar)
    const configs = await this.world.configManager.getConfig()
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
    avatar.priority = 0
    avatar.setScaling({ x: 1.0, y: 1.0, z: 1.0 })
    avatar.init()
    avatar.movementComponent.bAlignGround = true

    avatar.on('navToEnd', (moveEvent: IMoveEndEvent) => {
      console.log(moveEvent.targetPos, moveEvent.isArrived)
    })
  }
}
