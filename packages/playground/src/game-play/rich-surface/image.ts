import { ConfigTools, RichSurface, XStaticTextureSource } from '@xverse/core'

export class Image extends RichSurface {
  public staticTexture?: XStaticTextureSource
  async init(bomId: string, imageUrl: string) {
    this.id = bomId
    const asset = ConfigTools.GetAssetByBom(this._world.getCurrentRoom()!, bomId)
    if (!asset) return

    await this.addMeshAsync({ url: asset.url })
    const staticTexture = new XStaticTextureSource()
    this.staticTexture = staticTexture
    staticTexture.setMedia(imageUrl, { textureHasAlpha: false })
    this.setMediaSource(staticTexture)
  }

  async changeTexture(url: string) {
    if (!this.staticTexture) throw 'image unInited'
    await this.staticTexture.setMedia(url)
    this.setMediaSource(this.staticTexture)
  }
}
