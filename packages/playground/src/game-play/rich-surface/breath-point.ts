import { ConfigTools, EDefaultMeshType, RichSurface, World, XSpriteImgSource, EBillboardMode } from '@xverse/core'

export class BreathPoint extends RichSurface {
  init(id: string, url: string, world: World) {
    this.id = id
    const point = ConfigTools.GetPoint(world.getCurrentRoom()!, id)
    if (!point) return

    this.addMeshAsync({
      defaultMeshOption: {
        type: EDefaultMeshType.Plane,
        position: point.point.position,
        rotation: point.point.rotation,
        width: 2 * 100,
        height: 2 * 100,
      },
    })
    const fps = 15
    const lifeTime = 1
    const spriteWidthNumber = 1
    const spriteHeightNumber = 1
    const spriteImg = new XSpriteImgSource()
    spriteImg.setMedia(url, {
      fps: fps,
      lifeTime: lifeTime,
      spriteWidthNumber: spriteWidthNumber,
      spriteHeightNumber: spriteHeightNumber,
    })

    this.setMediaSource(spriteImg)
    this.rootComponent.billboardMode = EBillboardMode.All
  }
}
