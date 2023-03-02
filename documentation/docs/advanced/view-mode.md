# 自定义模式

## 观察者模式

在网络状况差的情况或者用户终端性能差的情况可以选择切换到观察者模式。观察者模式是对全景图模式 Path 的一个扩展，可以通过在 `setSkinInfo` 时设置 `localTextureBomId` 参数，使用本地贴图路径而不通过网络下载贴图资源。实现了不需要网络也可以浏览场景。

代码示例：

```ts
await worldInstance.currentRoom?.setSkinInfo({
  pathId, // 全景图路线id
  localTextureBomId: localTextureBomId, // 全景图 bomId
})
```

## 无网模式

serverless 模式不需要后端服务。使用 serverless 模式时，初始化 world 时需指定 serverless 为 true，然后在每次进房前，调用 setSkinInfo 传入 pathId 和 localTextureBomId。
serverless 模式下只能进行切房间操作，avatar 建议都隐藏。

代码示例：

```ts
import { World, IWorldOptions } from '@xverse/core'

const worldOptions: IWorldOptions = {
  canvas: 'canvas',
  appId: 'appId',
  worldId: 'world',
  releaseId: 'releaseId',
  userId: 'userId'
  token: 'token',
  serverless: true
}

const world = new World(worldOptions)

await world.init()
....

await world.currentRoom?.setSkinInfo({
  pathId,   // 全景图路线 id
  localTextureBomId: localTextureBomId // 全景图 bomId
})


await targetRoom.enter()
```
