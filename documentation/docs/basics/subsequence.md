# SubSequence

SubSequence(特效)是一种特殊的 Actor，它可能会包含各种渲染资源。

它可以被播放，播放中各种渲染资源会按照编排好的顺序出现。

特效会有不同的模板，这些模板是由 SubSequence 的子类实现的。

```typescript
import { SubSequence } from '@xverse/core'
// 创建灯光特效
const subSeq = world.spawn(SubSequence)
subSeq.init('sequence url').then(() => {
  subSeq.play()
})
```

相关事件：特效开始播放、停止播放等会有事件触发：

```typescript
/**
 * 特效加载完毕
 */
endLoading: never
/**
 * 特效动画开始播放
 */
animPlay: never
/**
 * 特效动画结束播放
 */
animEnd: never
/**
 * 特效动画循环一次
 */
animLoop: never
```

```typescript
subSeq.on('animEnd', () => {
  // 播放结束 do sth...
})
```

## SpriteRain

SpriteRain(红包雨)本质是特效的一种特殊实现。实现时只需要传入红包雨的资产和配置相关参数进行初始化，就可以播放了。

```typescript
import { SpriteRain } from '@xverse/core'

interface ISetRain {
  sky: IPoint
  ground: IPoint
  speed?: number
  size?: number
  rainNumber?: number
  radius?: number
  rotateSpeed?: number
}
const spriteRain = world.spawn(SpriteRain)
spriteRain.setRain(params as ISetRain).then(() => {
  spriteRain.play()
})
```
