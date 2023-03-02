import { IOrientedObject, World } from '@xverse/core'
import { Toast } from 'antd-mobile'
import { visRuleId } from './world-btns'

const TechnologyExhibitionAppId = '11016'
const TechnologyExhibitionReleaseId = '2212081730_09b7fd'
const VisibilityRuleRoom = '11022'
const VisibilityRuleRoomRid = '2212082112_06d371'
const urlParam = new window.URLSearchParams(location.search)

export class worldTest {
  public static instance: worldTest
  constructor(private worldInstance: World) {}

  public static getInstance(worldInstance: World) {
    if (!this.instance) {
      this.instance = new worldTest(worldInstance)
    }
    return this.instance
  }

  switchPersonTest = (appId: string, releaseId: string, avatarId: string) => {
    if (appId === TechnologyExhibitionAppId) {
      const origin = location.href.split('?')[0]
      location.href = sessionStorage.getItem('originURL') || origin
    } else {
      urlParam.set('appId', TechnologyExhibitionAppId)
      urlParam.set('releaseId', TechnologyExhibitionReleaseId)
      urlParam.set('roomId', '10142')
      urlParam.delete('avatarId')
      const search = urlParam.toString()
      location.href = location.origin + location.pathname + '?' + search
    }
  }

  reEnterWorld = () => {
    const newPos = {
      x: this.worldInstance.getPlayer().position.x + 100,
      y: this.worldInstance.getPlayer().position.y + 100,
      z: this.worldInstance.getPlayer().position.z + 100,
    }
    const newBirthPoint = {
      camera: this.worldInstance.getCamera().pose as IOrientedObject,
      player: {
        position: newPos,
        rotation: this.worldInstance.getPlayer().rotation,
      },
    }

    this.worldInstance.prepareForReEnterWorld(
      this.worldInstance.getCurrentRoom()!,
      'e629ef3e-022d-4e64-8654-703bb96410eb',
      newBirthPoint,
    )

    this.worldInstance.getCurrentRoom()?.on('enter', () => {
      console.error('reEnterSucc')
    })

    this.worldInstance.getCurrentRoom()?.enter()
    return
  }

  switchAppId = (appId: string, releaseId: string) => {
    //切换至众创空间
    if (appId === VisibilityRuleRoom) {
      const origin = location.href.split('?')[0]
      location.href = sessionStorage.getItem('originURL') || origin
    } else {
      urlParam.set('appId', VisibilityRuleRoom)
      urlParam.set('releaseId', VisibilityRuleRoomRid)
      const search = urlParam.toString()
      location.href = location.origin + location.pathname + '?' + search
    }
  }

  changeSkin = async (skinId: string) => {
    await this.worldInstance.getCurrentRoom()?.setSkinInfo({
      skinId,
      combinationId: visRuleId,
    })
    console.log('切换皮肤成功')
  }

  localTexture = async (useLocalTexture: boolean) => {
    const pathId = this.worldInstance.getCurrentRoom()?.getRoomConfig().skinList[0].pathList[0].id
    if (useLocalTexture) {
      const bomId = 'd383f739f6275e2b'
      await this.worldInstance.getCurrentRoom()?.setSkinInfo({
        pathId,
        localTextureBomId: bomId,
      })
    } else {
      await this.worldInstance.getCurrentRoom()?.setSkinInfo({
        pathId,
      })
    }
  }
  changePath = async (pathId: string) => {
    //TODO: 观察者模式需要传一张图片
    let imgPath = undefined
    const localTexturePath = {
      17: 'https://project-asset.xverse.cn/1/image/a0a70d33124b4111874fdb702ea4df8b/VRZJ-nightview.jpg',
      18: 'https://project-asset.xverse.cn/1/image/e0f0400e41424f59bff48b07bc1f5dec/VRZJ-luhanview.jpg',
    }
    if (pathId === '86e51c6c3f6166b6') {
      imgPath = (localTexturePath as any)[this.worldInstance.getCurrentRoom()!.roomId]
    }
    const skinId = this.worldInstance.getCurrentRoom()?.skinInfo.skinId
    await this.worldInstance.getCurrentRoom()?.setSkinInfo(
      {
        skinId,
        pathId,
        localTextureBomId: imgPath,
        combinationId: visRuleId,
      },
      {
        endCallback: () => {
          console.log('载具路线播放完毕')
          Toast.show('载具路线播放完毕')
        },
      },
    )
    console.debug('切换 Path 成功')
  }
}
