# 快速开始

## 创建 World

想要得到一个 3D 场景，第一步是先初始化一个 World 实例。参考如下示例

```ts
import { World, IWorldOptions } from '@xverse/core'


const worldOptions: IWorldOptions = {
  canvas: 'canvas',
  appId: 'appId',
  worldId: 'world',
  releaseId: 'releaseId',
  userId: 'userId'
  token: 'token',
}

const world = new World(worldOptions)


await world.init(worldOptions)
```

在上述代码中我们从 SDK 中引入了 World 和 World 初始化必要的一些参数定义 IWorldOptions，参数详细释义可以在[这里](../basics/world.md)查看。然后就得到了 World 的实例。World 初始化是二阶段的，也就是说还需要调用 world 的 init 方法才能完成 world 的初始化，异步调用成功之后，就得到了一个创建好渲染引擎、Avatar、相机等等的 3D 世界，不过这个时候页面中看到的画面还是空白的。因为我们还需要选择一个具体场景的 Room 进入。

## 创建 Room

Room 是对元象提供的场景的一个具体承载，仅通过元象提供的一个 roomId 就可以创建出一个具体的场景。

```typescript
const exampleRoom = worldInstance.getRoomInstance('exampleRoomId', Room)

exampleRoom.setSkinInfo({
  skinId: '10086',
  pathId: 'pathId',
})

await exampleRoom.enter()
```

Room 的实例化和 World 不同，需要通过 World 提供的工厂方法 getRoomInstance 去完成实例化。Room 实例化完成之后需要调用 Room 的 enter 方法，等待异步调用成功之后就能看到 3D 场景。

调用 `enter` 之前可以调用 `setSkinInfo` 指定进入房间时的皮肤和 Path。这步是可选的，如果开发者未指定，SDK 内部会使用皮肤列表和 Path 列表中的第一个。当然 SDK 默认指定的并不一定是开发者想要的效果，开发者可以自己指定。

## 渲染玩家 Avatar

Avatar 是玩家在 3D 世界中的虚拟化身。每一个进入世界的用户在每一个客户端上都会有一个 Avatar 实例代表自己。

在用户自己的客户端上，SDK 内部会在创建 World 时默认创建一个代表用户的 Avatar，开发者可以通过 `World` 的 `getPlayer` 方法获取到。默认情况下通过 getPlayer 实例化后 Avatar 是不会渲染到 3D 场景中。如果需要渲染出玩家 Avatar， 需要给 Avatar 设置骨骼、绑定动画状态机需要的动画资源，调用 init 方法。

```ts
const avatar = worldInstance.getPlayer(BaseAvatar)

avatar.setSkeleton('f90001792fd14903b6ed044b372da79e')
avatar.setAnimationInstanceBinding([
  {
    animationName: 'Idle',
    path: 'eedb797787d6497492b9d02f2d937f35',
  },
  {
    animationName: 'Walking',
    path: '6af45fa9439440f6a7c2f2ec78e0da63',
  },
  {
    animationName: 'Running',
    path: '6af45fa9439440f6a7c2f2ec78e0da63',
  },
])

await avatar.init()
```

等待异步调用成功之后就能看到 [Demo](http://h5.xverse.cn/playground/origin/master/index.html) 这样的效果。
