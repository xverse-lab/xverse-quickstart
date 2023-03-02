# Actor

场景中的绝大部分对象都是派生自 Actor 类，它提供了一些公共的方法和事件。继承自 Actor 的类有

- Avatar
- RichSurface
- SubSequence/Sequence

## 实例化

所有 Actor 的实例化必须通过 World 提供的工厂方法 spawn 来进行实例

接口签名：

```ts
class World {
  /**
   *
   * @param ActorClass
   * @param disposeOnRoomLeave Room Leave 时是否 dispose 该 Actor，默认 true
   * @returns
   */
  spawn<T extends IExtendedActor>(
    ActorClass: ConstructorType<T>,
    disposeOnRoomLeave?: boolean,
    params?: SpawnParameters,
  ): T
}
```

使用示例：

```ts
const richsurface = this.getWorld().spawn(RichSurface, false)
```

spawn 方法的第一个参数是 Actor 类的子类，一般传入的是 SDK 提供的 Avatar 等 Actor 子类，开发者也可以传入继承这些类的子类。

第二个参数是布尔值 `disposeOnRoomLeave`，用于标识在离开当前房间时是否需要 SDK 内部销毁掉该 Actor。 是可选的，默认为 `true`。在某些情况下，如果想要创建一些不随房间离开一并销毁的 Actor 可以传入 `false`。

第三个参数是可选的。可用于指定 Actor 出生时的朝向、位置等数据。包含以下参数：

|   参数名   |                     说明                      |
| :--------: | :-------------------------------------------: |
| `position` |            用于设置 Actor 位置信息            |
| `rotation` |               用于设置朝向信息                |
| `scaling`  |               用于控制缩放比例                |
| `template` | 用于设置克隆 avatar，详见 [克隆](./avatar.md) |
| `priority` |       用于设置克隆出来的 avatar 优先级        |

## 获取引用

通过 `spawn` 方法实例化 `Actor` 之后，开发者可以自己存储 `Actor` 的引用。同时 SDK 内部也持有所有 `Actor` 实例引用，可以通过 `World` 实例的 `actorsMap` 访问到所有 `Actor` 实例，也可以通过 `World` 的 `getActorsByType` 方法，传入 `Actor` 类获取到所有该类 `Actor` 的实例。

## 销毁

调用 `Actor` 实例的 `dispose` 方法会将该 `Actor` 从世界中移除销毁，SDK 持有的引用也会被删除。

如果开发者自己存储了 `Actor` 的引用，在调用 `dispose` 方法后也需要注意手动删除引用，防止`幽灵节点`的出现。

## 公共方法

公共的方法参考如下表格

| 方法名  |                  说明                   |
| :-----: | :-------------------------------------: |
|  show   |              显示该 Actor               |
|  hide   |              隐藏该 Actor               |
| dispose | 销毁该 Actor, 并释放该 Actor 持有的资源 |

## 事件

参考 [事件处理章节](./event.md)
