import { ISkinSwitchedEvent, Room } from '@xverse/core'
import { Toast } from 'antd-mobile'
import { BreathPoint } from './rich-surface/breath-point'
import { Image } from './rich-surface/image'
import { TV } from './rich-surface/tv'

export class BaseRoom extends Room {
  public onEnter() {
    console.debug('成功进入' + this.getRoomConfig().name)
    Toast.show('成功进入' + this.getRoomConfig().name)
  }

  public onSkinChanged(event: ISkinSwitchedEvent): void {
    console.debug('切换皮肤')
  }

  public addBreathPoint(id: string, url: string) {
    const breathPoint = this.getWorld().spawn(BreathPoint)
    breathPoint.init(id, url, this.getWorld())
    breathPoint.on('click', () => {
      this.handleClickBreathPoint(id)
    })
    return breathPoint
  }

  public addImage(id: string, url: string) {
    const image = this.getWorld().spawn(Image)
    image.init(id, url)
    image.on('click', () => {
      this.handleImageClick(id)
    })
  }

  public addTv(id: string, url: string) {
    const tv = this.getWorld().spawn(TV)
    tv.init(id, url)
    tv.on('click', () => {
      this.handleTvClick(id)
    })
  }

  public handleClickBreathPoint(id: string) {
    console.debug('BreathPoint clicked', id)
  }

  public handleImageClick(id: string) {
    console.debug('Image clicked', id)
  }

  public handleTvClick(id: string) {
    console.debug('Tv clicked', id)
  }

  public onLeave(): void {
    console.debug('成功离开' + this.getRoomConfig().name)
  }
}
