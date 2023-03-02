import { ConfigTools, SpriteRain } from '@xverse/core'
export interface IStartRainOptions {
  /**
   * 红包雨播放时长，单位 ms 默认 5000
   */
  duration: number
  /**
   * 红包雨播放结束后的回调函数
   */
  onEnd: (count: number) => any
  /**
   * 本次播放红包个数
   */
  rainCount?: number
  /**
   * 红包雨的缩放倍数
   */
  rainScale?: number
  /**
   * 红包雨的展示范围
   */
  rainRadius?: number
  /**
   * 红包雨的bomid
   */
  bomId?: string
  /**
   * 红包雨的旋转角度??废弃了？
   */
  rotateSpeed?: number
}
/**
 * 红包雨
 */
export class RedPacketRain extends SpriteRain {
  start(options: IStartRainOptions) {
    if (this.isPlaying) return
    const {
      duration = 9000,
      rainCount = 700,
      rainScale = 0.6,
      rainRadius = 500,
      bomId = 'c456924d74de73a3',
      onEnd = () => void 0,
    } = options || {}
    const asset = ConfigTools.GetAssetByBom(this._world.getCurrentRoom()!, bomId)?.url
    if (!asset) throw 'RedPacketRain asset undefined'
    this.setRain(
      {
        x: this._world.getPlayer().position.x,
        y: this._world.getPlayer().position.y,
        z: 400,
      },
      {
        x: this._world.getPlayer().position.x,
        y: this._world.getPlayer().position.y,
        z: 10,
      },
      0.2,
      rainScale,
      rainCount,
      rainRadius,
      0.1,
    )
    this.init(asset).then(() => {
      this.play(true)
      setTimeout(() => {
        onEnd(this.pickNumber)
        this.stop()
      }, duration)
    })
  }
}
