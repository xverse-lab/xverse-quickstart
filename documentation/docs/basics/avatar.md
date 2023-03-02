# Avatar

Avatar 是 3D 世界中的虚拟角色，它继承自 [Actor](./actor.md)。

开发者也可以基于自己的业务需求继承 Avatar 实现业务逻辑。

## 创建

Avatar 的创建也是二阶段，分为实例化和初始化。

### 实例化

从 SDK 角度来看, Avatar 主要有三类：玩家自己（后称 Player）、元象后端同步过来的同一房间内的其他玩家、开发者创建的单机 Avatar（NPC）。

SDK 内部会自动去实例化一些 Avatar，这些 Avatar 包括玩家自己和从元象后端同步过来的同一房间内的其他玩家。同步的其他玩家的生命周期都由 SDK 内部管理，开发者不用关心，这些实例可以通过 `world` 的 `avatars` 属性获取到引用（建议不要对他们进行操作，调用了也不会同步到其他客户端）。

开发者也可以手动去创建一些 Avatar 到场景中。这些 Avatar 的任何行为都是单机的，不会同步到其他客户端。

所以这里的实例化开发者关心的只有玩家自己和单机 Avatar。

- 玩家自己

```ts
class World {
  /**
   * 获取玩家 Avatar 的引用，传入的 AvatarClass 必须是 Avatar 的子类
   * @returns
   */
  getPlayer<T extends Avatar>(AvatarClass?: ConstructorType<T>): T
}

const player = world.getPlayer()
```

调用 `getPlayer` 后 SDK 内部默认使用的是 Avatar 类去做实例化的，如果想要修改这种默认行为，可以传入自己继承的 Avatar 子类。

每次调用 `getPlayer` SDK 内部会比较传入的 Avatar 类和当前玩家类是否一致，如果不一致就会销毁当前的 Avatar 类来重新实例化。这个只发生在传入的 AvatarClass 参数非空的情况下。

<!-- TODO: 销毁重建 -->

- 单机 avatar

单机的 Avatar 的实例化和其他 Actor 完全一致。都是使用 World 的 Spawn 方法来实例化

```ts
import { Avatar } from '@xverse/core'

world.spawn(Avatar, false)
```

### 初始化

完成 Avatar 实例化之后，还需要对 Avatar 进行一些设置才能将他们渲染出来

```ts
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
avatar.changeComponents([
  {
    type: EAvatarComponentType.Clothes,
    path: 'c550b3339e9143c28f03ef4ab0d15305',
  },
  {
    type: EAvatarComponentType.Hair,
    path: '0f9432d565bd432188ba7293b32ecc11',
  },
  {
    type: EAvatarComponentType.Pants,
    path: '0cd1b04aaf1e43aab597ba4316136f02',
  },
  {
    type: EAvatarComponentType.Shoes,
    path: 'd00fc082261a488d8e3f901be7b97cf6',
  },
])

avatar.init()
```

第一步需要设置 Avatar 的骨骼资产，这个资产 Path 可以从 Console 角色配置中获取到。

第二步需要设置动画状态机绑定的资源骨骼资产，这个资产 Path 可以从 Console 角色配置中获取到。

:::tip

这里的角色动画状态机状态，目前有且只有 `Idle` | `Walking` | `Running` 三种状态

:::

第三步是设置 Avatar 的装扮。虽然这步可选的，但是建议设置。

完成上述步骤后，调用 Avatar 的 `init` 方法就可以把 Avatar 渲染在场景中。渲染完成会触发 load 事件。

### VAT

VAT 指的是预先把动画数据烘焙到一张 Texture 中，在运行时直接交由 GPU 进行蒙皮的技术。不同于传统的蒙皮在 CPU 端需要进行动画和骨骼的计算，通过预计算的方式，减少了 CPU 的消耗。

代码示例如下：

```ts
avatar.setVAT('f90001792fd14903b6ed044b372da79e')

avatar.setVatAnimationInstanceBinding([
  {
    animationName: 'Idle',
    path: '6765984d3ea846afa4d8696c7dc77623',
  },
  {
    animationName: 'Walking',
    path: 'fbf5224eef9441f0b9b721d2a060ff70',
  },
  {
    animationName: 'Running',
    path: 'c1955e8032924ceaab1f01b4d901692d',
  },
])

avatar.init()
```

如果需要 VAT 的功能，还需要在调用 `init` 之前设置 VAT 的相关资产。

第一步是设置 VAT 需要设置 VAT 的资产 Path。这个资产 Path 可以从 Console 角色配置的动作资产中获取到。
还需要设置 VAT 的动画状态机，动画状态机和上述的骨骼动画状态机类似，也需要设置动画状态机。

<!-- TODO: -->

设置 VAT 是可选的，但是建议设置，可以增加同屏显示人数能力

SDK 提供设置骨骼、动画、VAT 相关资产的一键设置方法 `setSkeletonAnimation`, 可以通过传入相应参数快速设置 avatar

### 自定义实例化类

同一房间内的其他玩家是 SDK 使用 Avatar 类来实例化的，这个默认设置也可以被修改为自己实现的 Avatar 类。

在进入世界（第一次进入某个房间，即调用 `enter` 方法前）前，修改 World 实例的 `DefaultAvatarClass` 属性实现自定义其他玩家的类。参考示例：

```ts
world.DefaultAvatarClass = BizAvatar
```

### 克隆

开发者如果想要通过克隆已有的 Avatar 来创建新的单机 Avatar，可以通过在 World spawn 时传入额外的可选的 `template` 参数。这个 `template` 参数需要是 `Avatar` 的实例，并支持 `priority` 参数设置克隆 `Avatar` 优先级，为确保克隆成功，可设置优先级为 0

```ts
const clonedAvatar = world.spawn(Avatar, true, { template: world.getPlayer(), priority: 0 })
clonedAvatar.setNickName('cloned_avatar')
```

上述的例子就使用玩家自己作为模板克隆出一个新的 Avatar，并给他设置了昵称。SDK 内部会自动调用 init 方法初始化 Avatar，所以判断 Avatar 是否加载成功只需要监听 `load` 事件即可。

## Npc

npc 是一种特殊的 avatar, 通过 NpcManager 管理类来创建和操控 npc

### 创建导航 npc

创建完毕后，可从 npcManager.npcInfos 获取创建的 npc 信息，npcManager.npcInfos 是个数组，包含所有创建的 npc 信息

```ts
import { NpcManager } from '@xverse/core'
const npcManager = new NpcManager(world)
npcManager.create()
```

### npc 导航开始

通过传入 npc 的 userId 控制指定 npc 开始导航, npc 的 userId 从 npcManager.npcInfos 中获取。
npc 按照指定路径行进，每到达一个导览点后可调用 startConduct 继续行进至下一个导览点。
每次调用 startConduct 后，可收到事件名为 conductorDestUpdate 的导航广播，从广播信息中可拿到 npc 和玩家下一个要行进的点位和镜头信息。
拿到信息后，用户可自行控制玩家行为。

```ts
import { Broadcast, IConductorDestUpdate } from '@xverse/core'

npcManager.startConduct(userId)

new Broadcast(worldInstance, 'conductorDestUpdate', (data: IConductorDestUpdate) => {
  ....
})
```

### npc 导航取消

传入 npc 的 userId 取消导航, 取消后 npc 返回出生点，如果还在行进途中调用 startConduct, 则 npc 继续前往下一个导览点。

```ts
npcManager.stopConduct(userId)
```

### npc 卸载

传入 npc 的 userId 卸载指定 npc。

```ts
npcManager.destroy(userId)
```

## 动作

如果在 Console 中对 Avatar 配置了一些动作，那么在运行时 Avatar 就可以播放这些动作，可以通过 `playAnimation` 来实现

```ts
class Avatar {
  playAnimation(path: string, isLoop?: boolean, callback?: (...args: any) => any): Promise<void>
}
```

第一个参数是 Console 上配置的动作资产的 ID

第二个参数是 是否循环播放该动作，默认是 `false`

第三个参数是动作播放结束后的回调。

## 装扮

### 普通装扮

在初始化的时候我们设置了 Avatar 的默认装扮，在运行时也可以改变 Avatar 的装扮，参考如下代码。
`changeComponents`支持批量，可以一次传入多个装扮。
但是不支持同时传入`套装 Suit` + `上衣 Clothes 或 裤子 Pants`，这两类是互斥关系，SDK 无法判断该用套装还是该用上衣/裤子，会抛出错误。

```ts
avatar.changeComponents({
  type: EAvatarComponentType.Shoes,
  path: 'd00fc082261a488d8e3f901be7b97cf6',
})
```

换装接口接受数组或者单项装扮设置，可以改变某一个装扮或者进行批量换装。

入参的装扮配置的 `type` 是一个由 SDK 定义的 [枚举](https://h5.xverse.cn/docs/sdk/core/latest/enums/EAvatarComponentType.html) ；`path` 则是 Console 中配置的装扮资产 路径。

### 获取当前装扮

调用 `getCurrentComponents` 可以获取到 Avatar 当前的装扮

```ts
avatar.getCurrentComponents()
```

### 捏脸

```ts
avatar.diyFace('Face_Whole_Height', 0.8)
```

<!-- ### 挂件 -->

<!-- TODO: -->

## 挂件

avatar 可以使用挂件，如手持道具可乐瓶子

### 添加挂件

调用 `addPendant` 传入挂件资产 Path，同一 Path 不可重复挂载，重复使用只生效一次

```ts
avatar.addPendant('path')
```

### 移除挂件

调用 `removePendant` 传入已使用的挂件资产 Path

```ts
avatar.removePendant('path')
```

### 获取当前使用中的挂件 id 列表

调用 `getCurrentPendents` 获取

```ts
avatar.getCurrentPendents()
```

### 获取当前使用中的挂件列表

调用 `getAllPendants` 获取

```ts
avatar.getAllPendants()
```

### 设置所有挂件的可见性

调用 `allPendantsVisibility` 设置 true or false

```ts
avatar.allPendantsVisibility = true (or false)
```

### 设置挂件的可见性

调用 `setPendantVisibility` 设置 path 以及可见性 true（or false）

```ts
avatar.setPendantVisibility(path, show)
```

## 行进

Player 有两种方式可以行进：通过摇杆驱动 Player 行进、通过点击场景驱动 Player 自动寻路行进。

默认使用摇杆的方式，可以通过 `World` 实例（这是一个全局开关，所以是在 `World` 实例上）的 `movementTriggerMode` 属性获取当前行进方式；也可以通过赋值 `movementTriggerMode` 为 `joystick` 或者 `autoNavigation` 切换不同的行进方式。

### 摇杆

通过摇杆驱动 Player 行进不需要调用额外的方法就能生效，只需要参考如下代码设置行进模式为摇杆（摇杆是默认选项，如果不需要切换则不用设置），初始化摇杆，用户操纵摇杆即可驱动 Player，摇杆相关功能可以参考 [摇杆章节](./joystick.md)。

```ts
const world = new World()
worldInstance.movementTriggerMode = 'joystick'
```

### 自动寻路

SDK 内置了点击场景驱动 Player 前往点击点的实现。只需要进行如下设置即可。

```ts
const world = new World()
worldInstance.movementTriggerMode = 'autoNavigation'
```

在`autoNavigation`模式下，也可以禁用内置的点击驱动能力，按该方法设置即可:

```
worldInstance.disableClickNavigation = true
```

如果想要通过编程调用驱动 Player 自动寻路行进至目标点位，可以调用 `navigateTo` 方法

```ts
const player = worldInstance.getPlayer()
player.navigateTo({ x: 0, y: 0, z: 0 }, { endCallback: () => console.error('nav end') })
```

第二个参数还可以传入 `endCallback`，会在行进到目标点后触发这个回调函数。

如果不传入回调，也可以通过事件获知行进结束。
在 navigateTo 完成后，`avatar`会触发`navToEnd`事件，参数是行进目标位置和是否走到了该位置。

```ts
const player = worldInstance.getPlayer()
player.on('navToEnd', (moveEvent: IMoveEndEvent) => {
  console.log(moveEvent.targetPos, moveEvent.isArrived)
})
```

### 面向某个位置

SDK 内置了将`Player`和`镜头`一起面向某个位置（lookAt）的功能。同 navigateTo 一样，也可以传入回调。

```ts
const avatar = worldInstance.getPlayer(BaseAvatar)

try {
  avatar.lookAt(targetPosition, {
    endCallback: () => {
      console.log('Look at end')
    },
    time: 1000,
  })
} catch (err) {
  console.error(err)
}
```

同 navigateTo 一样，在 lookAt 完成后，`avatar`会触发`lookAtEnd`事件，参数是转向目标位置和是否转到了该位置。

```ts
const player = worldInstance.getPlayer()
player.on('lookAtEnd', (moveEvent: IMoveEndEvent) => {
  console.log(moveEvent.targetPos, moveEvent.isArrived)
})
```

## 缩放

Avatar 进入场景不同大小的房间，它相对于场景也会呈现不同的大小。如果要调整 Avatar 缩放可以 `setScaling` 来实现

函数签名：

```ts
class Avatar {
  /**
   * 设置缩放
   */
  setScaling(scaling: IScaling): void
}
```

参考示例：

```ts
const player = world.getPlayer()
player?.setScaling({ x: 2, y: 2, z: 2 })
```

## 昵称

Avatar 的头顶昵称通常用于标识 Avatar 的用户身份，这个是一个常见的需求，所以 SDK 内置了这个实现。开发者也可以选择自己实现。

### 设置昵称

函数签名：

```ts
class Avatar {
  /**
   * 设置缩放
   */
  setNickName(texts: string, options?: INickNameOptions): void
}
```

当 `texts`超过 18 字符将报错。

参考示例：

```ts
const nickname = '游客' + userId.slice(0, 3)
avatar.setNickName(nickname)
```

### 获取昵称

函数签名：

```ts
class Avatar {
  /**
   * 设置缩放
   */
  getNickName(): string
}
```

## 状态同步

对于代表玩家自己的 Avatar，SDK 内部会将一些方法调用和行为同步给同一房间内在线的其他玩家客户端，包括

方法调用：

- setSkeleton
- setAnimationInstanceBinding
- setVAT
- setVatAnimationInstanceBinding
- playAnimation
- setScaling
- setNickName
- changeComponents
- dispose

行为：

- 行进、旋转

### 自定义状态同步内容

除了上诉 SDK 内部实现状态同步内容，开发者也可以自定义一些状态同步内容。

Avatar 提供了 `setSyncInfo` 方法发送上行数据给元象后端，让元象后端同步给其他用户。

`setSyncInfo` 函数签名:

```ts
class Avatar {
  setSyncInfo(info: string): Promise<unknown>
}
```

需要注意的是入参是 `string`, SDK 内部不关心状态同步内容的原始数据结构。

同一房间内的其他玩家可以通过 `receiveSyncInfo` 事件收到其他玩家同步过来的数据（玩家自己不会收到）。可以通过复写`receiveSyncInfo()`方法来处理收到的自定义数据。

```ts
class BizAvatar extends Avatar {
  private syncStuff() {
    // 同步内容
    const syncInfo = JSON.Stringify({ bizId: 'bizId' })
    this.setSyncInfo(syncInfo)
  }

  public onReceiveSyncInfo({ data }: { data: string }): void {
    // 复写方法 收到同步内容，玩家自己不会收到
    const content = JSON.parse(data)
    console.debug('收到同步消息', content)
  }
}
```

### 同步开关

### 发送信息给其他人的开关

在某些情况下，你可能不想把自己的行为同步给其他玩家。那么可以使用 `syncFlag` 来控制状态同步的开关。参考示例：

```ts
avatar.syncFlag = false
```

设置了上面的标志位后，上文列出的玩家的行为都不会发送给其他玩家，其他玩家也不会收到这些改变。

一些应用场景如下：

1. 实现换装本地预览功能，在调用 `changeComponents` 进行换装前关闭状态同步，就不会把装扮信息同步给其他客户端。其他客户端也看不到该改动。

### 接收其他人信息同步开关

上个接口只能控制自己不发送同步信息到别人，在某些情况下，你可能不想接收其他所有玩家的同步信息。那么可以使用 `setBlockOthersSyncInfo` 选项。参考示例：
默认 false 不阻塞,当设置为 true 时,阻塞其他所有玩家的同步信息

```ts
world.setBlockOthersSyncInfo(boolean)
```

设置了上面的标志位后，将不再接收其他玩家的信息同步。

一些应用场景如下：

1. 在某些场景下,希望本地控制其他玩家行为.当设置`world.setBlockOthersSyncInfo(true)`,屏蔽其他人的信息同步,从而操控其他 Avatar

## 同屏人数设置

同一时刻屏幕上可渲染的 Avatar 是有限的，超过一定的渲染 Avatar 数量就会造成性能问题，导致体验下降，所以需要根据需求控制同一时刻屏幕上可渲染的 Avatar 数量。

作为一项全局设置可以通过 World 的 setLod 方法来实现，方法定义如下：

```ts
class World {
  /**
   * 设置同屏人数
   * @param lodGroup
   * @returns
   */
  setLod(lodSettings: ILodSettings[]): void
}
```

入参 lodGroup 为一个数组，其中的元素 maxRange 表示为此 lod 层级的最远可见范围，quota 表示了在这个距离范围内的角色数量。参考如下示例，数组中第二列设置了距离视口[1000,2000]的距离范围内，有 5 个最大可见角色。 需要注意的是，当这个范围内有大于 quota 数量的角色时则仅能显示 5 个，如果角色距离变化而走出了这一距离范围后，新的距离对应的 lod 组如果还有剩余可显示的 quota 名额，则这个角色会正常显示出来

```ts
const lodGroup = [
  { maxRange: 1000, quota: 5 },
  { maxRange: 2000, quota: 5 },
  { maxRange: 3000, quota: 5 },
]
world.setLod(lodGroup)
```

## 智能语音

第一步: 初始化语音

```ts
initAISay({ configJson: JSON.stringify(configJson) }) //configJson 语音相关配置, 需转为json字符串传入
```

第二步：调用对应的方法

```ts
await aiSay(text: string) //说一段文字
aiSayStop() //停止说话
aiSayPause() //暂停说话
aiSayResume() //恢复说话
```

## 属性

属性参考如下表格

|    属性名     |                     说明                     |
| :-----------: | :------------------------------------------: |
| enableCulling | 相机内看不到 avatar 了，就会被剔除，不再渲染 |

## 事件

Avatar 继承了 Actor 的所有事件，参考 [事件处理](./event.md) 可以对 Avatar 绑定 UI 事件
