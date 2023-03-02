# Volume

Volume 用来支持边界 Overlap 和逻辑触发。例如角色行走到某个区域内时弹出提示，样例代码如下：

```typescript
import { IPosition, Volume } from '@xverse/core'

volumeInstance = g.world.spawn(Volume)
volumeInstance.position = pos
volumeInstance.radius = 300
volumeInstance.addIntersectActor(g.world.getPlayer())
volumeInstance.registerOnOverlapBegin(() => {
  Toast.show('进入Volumn')
})
volumeInstance.registerOnOverlapEnd(() => {
  Toast.show('离开Volume')
})

// 展示volume盒体
volumeInstance.debug = true
```
