---
sidebar_position: 3
---

# Room

Room 是组成 World 的基本单位，是一个独立的 3D 场景，玩家可以在不同的 Room 中跳转切换。

## 初始化

```ts
const disco = world.getRoomInstance('RoomId', Room)

await disco.enter()
```

Room 的实例化和 World 不同，需要通过 World 提供的工厂方法 getRoomInstance 去完成实例化。

第一个参数传入的是 Room 类，可以是从 SDK 导出的 Room 类也可以是导出的 Room 类的子类。第二个参数是 `roomId` ，这个 `roomId` 可以在 [Console](https://console.xverse.cn/web/index.html) 上创建得到。

Room 实例化之后需要调用 Room 的 enter 方法才能进入，等待异步调用成功后就成功进入了该 Room。

**2.1.0 之后的分支开启了硬件解码，所以有一个前提是 `Room` 的 `enter` 方法必须在交互事件（click、touch）的事件回调中**

默认情况下 SDK 内部会使用皮肤列表的第一个皮肤和该皮肤下的 Path 列表中的第一个 Path 作为默认选项进入房间。如果想要改变这一默认行为，可以提前通过 `setSkinInfo` 指定进入房间的选项。参考如下代码

```ts
jayRoom.setSkinInfo({
  skinId: '10086',
  pathId: 'pathId',
})
```

## 离开房间

在多次调用 `enter` 方法切换了多个房间之后，如果想要从当前房间退出，可以调用 Room 的 `leave` 方法，则会从当前房间离开，回到上次访问的房间。

```ts
await roomA.enter()
await roomB.enter()
await world.getCurrentRoom().leave()
```

参考上述代码，先进入了 `roomA` 房间，再进入了 `roomB` 房间，那么再调用 `world.getCurrentRoom().leave()` （也就是`roomB`）的 `leave` 方法则会回到 `roomA` 房间。

如果当前房间就是你最初进入的那个房间，再次调用 `leave` 则什么也不会发生。

## 切换皮肤

一个房间可能有不同的皮肤风格，那么可以通过调用 `setSkinInfo` 来切换不同的皮肤

```ts
room.setSkinInfo({
  skinId: '10086',
})
```

更多细节可参考 [皮肤章节](./skin.md)

## 切换 Path

一个房间一个皮肤下可能有不同的 Path 可以切换，那么可以通过调用 `setSkinInfo` 来切换不同的 Path

```ts
room.setSkinInfo({
  skinId: '10086',
})
```

更多细节可参考 [Path 章节](./path.md)

## 切换 显隐组合 Combination

一个 Path 下可能有多种物品组合可以切换，那么可以通过调用 `setSkinInfo` 来切换不同的 Combination

```ts
room.setSkinInfo({
  combinationId: '1',
})
```

## 触发事件

在运行时，Room 内部会触发一些事件提供给开发者，这些事件主要是

|   事件名    |         说明          |
| :---------: | :-------------------: |
|   create    |   Room 实例化后触发   |
|    enter    | Room enter 成功后触发 |
|    leave    | Room leave 成功后触发 |
| skinChanged |  皮肤切换成功后触发   |
| pathChanged |  Path 切换成功后触发  |

值得注意的是 enter 事件和 leave 事件的触发顺序。参考如下代码

```ts
await roomA.enter()
await roomB.enter()
```

这段代码会从 roomA 跳转到 roomB，事件触发的先后顺序是 roomA enter、 roomA leave、roomB enter

这些事件以 可复写方法 和 发布订阅 两种方式提供给开发者。

更多事件相关的通用操作可以参考[事件处理](./event.md)

### 发布订阅

TODO:

## 内存占用

只实例化 Room 不调用 enter 进入的内存占用量是很小的，进入后才会加载该房间需要的资源导致内存占用量增加。同一时间也只有一个 Room 会被激活（可以通过读取 Room 的 actived 属性判断），也只有激活的 Room 才会占用内存。

在默认情况下，切换 Room 时会将开发者在上个 Room 时创建的 Actor 等资源都释放，如果要修改这个默认行为可参考 [Spawn Actor](./world.md)。

## 传送

传送可以将用户从空间中的某一个位置迁移到另一个位置，这个需求也可以通过 `setSkinInfo` 来实现

### 房间内传送

在一个房间内传送时，可以先获取到当前房间的引用，然后通过 `setSkinInfo` 传入 `birthPoint` 来实现传送效果

<!-- TODO: -->

### 跨房间传送

从一个房间传送到另一个房间的某个点，可以先获取目标房间的引用，然后通过 `setSkinInfo` 来设置房间的一些属性信息，再调用目标房间的 enter 方法即可实现跨房间传送

<!-- TODO: -->

<!-- ## 最佳实践 -->
