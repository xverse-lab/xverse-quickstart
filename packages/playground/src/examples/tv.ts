import { TV } from '../game-play/rich-surface/tv'
import { BaseWorld } from '../game-play/world'

export class TVDemo {
  constructor(private world: BaseWorld) {}

  appendTv() {
    const tv = this.world.spawn(TV, false)
    tv.init('85389b13626395d8', 'https://app-asset-1258211750.file.myqcloud.com/1/media/MotherNature.mp4')
  }
}
