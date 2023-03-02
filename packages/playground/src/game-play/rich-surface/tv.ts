import { ConfigTools, RichSurface, EMediaSourceType } from '@xverse/core'

export class TV extends RichSurface {
  private video?: HTMLVideoElement
  async init(bomId: string, url: string) {
    const video = document.createElement('video')
    this.video = video
    video.src = url
    video.muted = true
    video.autoplay = false
    video.playsInline = true
    video.setAttribute('controls', 'controls')
    video.setAttribute('preload', 'auto')
    video.setAttribute('hidden', 'hidden')
    // 需要设置跨域，否则引擎侧可能出现无法解析视频的问题
    video.setAttribute('crossorigin', 'anonymous')
    video.id = 'tv'
    video.loop = true
    document.body.appendChild(video)
    video.play()
    window.addEventListener('click', this.handleClick)

    const asset = ConfigTools.GetAssetByBom(this.getWorld().getCurrentRoom()!, bomId)
    if (!asset || !(this.video && this.video instanceof HTMLVideoElement)) return

    await this.create({
      type: EMediaSourceType.XVideoSource,
      mediaData: this.video,
      addMeshOption: { url: asset.url },
    })
  }

  handleClick = () => {
    const video = this.video
    if (!video) return
    // 如果暂停了就需要点击播放
    if (video.paused || video.muted) {
      video.play()
      video.muted = false
    }
  }

  public dispose(): void {
    // this.videoSource?.dispose()
    this.video?.pause()
    this.video && document.body.removeChild(this.video)
    this.video = undefined
    window.removeEventListener('click', this.handleClick)
    super.dispose()
  }
}
