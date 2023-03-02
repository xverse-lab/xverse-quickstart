# World

`World` 代表一个 3D 世界，这个世界由一个或多个 [Room](./room) 组成。

## 初始化

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

await world.init()
```

在上述代码中我们从 SDK 中引入了 World 类和 World 初始化必要的一些参数定义 IWorldOptions。

:::caution
注意：World 只允许构建一次，如果重复构建则会报错
:::

## IWorldOptions

`IWorldOptions` 类型定义了初始化 `World` 需要传入的参数

### 必填参数

- userId

用户加入世界的唯一标识

- canvas

用于渲染 3D 场景的 canvas 的 DOM 选择器

- appId

在 [Console](https://console.xverse.cn/web/index.html) 上注册申请的 AppId，

- token

鉴于安全考虑，需要对用户身份进行鉴权。Token 获取参考 (<https://github.com/xverse-lab/tls-sig-api>)

- worldId

World 的唯一标识，用于用户隔离，可以通过调用元象后台接口获得

- releaseId

[Console](https://console.xverse.cn/web/index.html) 提供了发布管理的功能，可以对 `World` 下的 `Room` 和场景资产进行编排，你可以选择发布 1 个房间或者组合发布多个房间，完成发布后会生成一个 releaseId。

World 初始化是二阶段的，也就是说还需要调用 world 的 init 方法才能完成 world 的初始化，init 是一个异步方法，用于执行 World 的初始化，返回一个 `Promise`，`Promise` resolve 之后就可以进行后续的操作，如果传入参数有误或者网络状况不稳定等等异常情况则会抛出 [错误码](./errorcode)。

如果遇到碰到错误码的情况

1. 如果是网络错误相关的错误，请尝试重新调用 `world.init()` 方法
2. 如果是 UnSupported 错误，则请提示用户目前使用的浏览器环境不支持开启元宇宙
3. 如果是 RepeatInitWorld 错误，则已经进入了 `World`，不需要再次调用了

异步调用完成之后，就得到了一个创建好具有渲染引擎、Avatar、相机、实时同步等功能的 3D 世界，不过这个时候页面中还看不到任何画面。

初始化 World 实例之后就可以调用 World 实例上的一些方法。

### 可选参数

- env

环境参数，可选参数， `sit` 测试环境 或 `uat`用户体验环境 或 `prod` 生产环境；默认 `prod`。测试环境会请求到元象的开发环境后台，不保证稳定性，但是能获得最新的更新，一般用于调试。

## 获取玩家引用

每一个加入 World 的用户，SDK 内部都会自动创建代表该用户的 Avatar 实例，并且原生的将 Avatar 的所有操作同步到其他玩家客户端上。

代表用户自己的 Avatar 实例可以用 `getPlayer` 方法获取到。

```ts
class World {
  /**
   * 获取玩家 Avatar 的引用，传入的 AvatarClass 必须是 Avatar 的子类
   * @returns
   */
  getPlayer<T extends Avatar>(AvatarClass?: ConstructorType<T>): T
}
```

更详细的说明参考 [Avatar 章节](./avatar.md)

## 创建 Actor

RichSurface、Avatar、SubSequence 等等继承自 Actor 的类创建实例都需要通过 World 的 `spawn` 方法

更详细的说明参考 [Actor 章节](./actor.md)

## 事件

World 在内部状态变化时会触发事件让开发者能够响应 World 内部的状态变化。事件列表如下：

|        事件名        |                               说明                               |                 回调函数参数                 |                      建议操作                       |
| :------------------: | :--------------------------------------------------------------: | :------------------------------------------: | :-------------------------------------------------: |
|     disconnected     |                    SDK 与元象服务器断开时触发                    |                      -                       | 提示用户断开连接，可以尝试调用 `reconnect` 方法重连 |
|     reconnected      |                 SDK 与元象服务器重新连接成功触发                 |                      -                       |                  提示用户重连成功                   |
|     reconnecting     |                SDK 尝试与元象服务器重新连接时触发                |                      -                       |                   提示用户重连中                    |
|     repeatLogin      | 使用同一个 userId 重复进入 World 时触发，旧的 world 会触发该事件 |                      -                       |         提示用户已被挤下线，不允许其他操作          |
|     roomSwitched     |                          房间切换时触发                          | { prevRoomId: number, targetRoomId: number } |                          -                          |
| enteringForReconnect |                          重连进房时触发                          |                      -                       |                          -                          |
|  firstEnteringRoom   |                          初次进房时触发                          |                      -                       |                          -                          |

| userKicked | 元象服务器将 userId 踢下线时出发 | - | 提示用户被踢下线，不允许其他操作 |
| fatalError | 发生严重错误时触发 | - | 模态框提示用户 reload 页面 |

更多事件相关的通用操作可以参考[事件处理](./event.md)

## 获取玩家当前所在房间

用户可以在不同房间中 [切换](./room.md)，那么就可以通过 World 的 `getCurrentRoom` 方法获取到玩家当前所在的 Room。

注意在 World 初始化之后，进入某一个 Room 之前这个方法返回的可能是 `undefined`

```ts
const currentRoom = worldInstance.getCurrentRoom()
const roomId = currentRoom?.roomId
```

## 根据 ActorId 获取 Actor

用户可以调用 World 的 `getActorById`方法获取到对应 id 的 actor 元素.未找到返回 undefined
id 是创建 actor 时传入的参数,用于辨识不同 actor

```ts
const actor = worldInstance.getActorById(actorId)
```

## 获取所有房间

调用 World 的 `getRoomInstances` 方法可以获取到所有 `getRoomInstance` 创建出的房间实例的引用

代码示例

```ts
const rooms = world.getRoomInstances()
```

## 获取房间列表配置

调用 World 的 `getRoomConfigs` 方法可以获取到所有当前 `releaseId` 下的每个房间的配置数据集合，房间配置数据包括房间 ID、房间名称、房间皮肤列表等等。

代码示例

```ts
const roomConfigs = world.getRoomConfigs()
```

## 销毁世界

<!-- 如果 World 初始化失败，需要先对 World 一些未完成的初始化进行销毁再重新实例化 -->

```ts
class World {
  /**
   * 销毁世界
   */
  destroy(): void
}
```

## joystick 摇杆

World 提供了 joystick 模块可以控制用户行进位置，参考 [joystick](./joystick)

## 预加载

如果需要对一个 releaseId 下的所有资产进行提前下载，在应用运行时就可以不等待网络加载而使用本地资源。

具体参考 [资产预加载章节](../advanced/preload.md)

<!-- ## 处理异常 -->

<!-- ## 创建副本 -->

<!-- World 实例化的时候传入了用于隔离不同用户状态同步的 `worldId` 参数，在某些应用场景中我们可能需要创建一个 -->

TODO:

## 画质设置

可以通过 `setPictureQualityLevel` 方法对场景的画质进行设置，分为高中低三个档位

```ts
class World {
  /**
   * 设置 画质
   * @param name
   * @returns
   */
  setPictureQualityLevel(level: IPictureQualityLevel): void
}
```

## 环境光强度设置

可以通过 `setEnvLightIntensity` 方法对场景内的环境光强度进行设置

函数签名：

```ts
class World {
  /**
   * 设置环境光强度
   * @param intensity 环境光强度，默认为1
   */
  setEnvLightIntensity(intensity: number): void
}
```

<!-- ## 静态 World vs 动态 World -->
