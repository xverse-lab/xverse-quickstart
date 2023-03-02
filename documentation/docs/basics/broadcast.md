# 广播

广播帮助用户派发自己在业务中的自定义事件，由于在 SDK 内部做了分流，开发者可以在根据自己的分类，实例化多个广播，用于处理不同的业务类型

    ⚠️注意: 发送客户端派发的消息，发送客户端自己也会收到，可以用监听函数中的参数 isFromSelf 判断消息是否是发送客户端自己派发的

## 快速使用

```typescript
// 创建一个广播对象
const broadcast = new Broadcast(
  /**
   * World 实例
   */
  worldInstance,
  // 广播类型
  'Common',
  /**
   * 监听器
   * @param data 用户自定义数据
   * @param isFromSelf 消息是否是自己派发的
   */
  (data, isFromSelf) => {
    console.log('[Broadcast][Common]', data, 'isFromSelf: ', isFromSelf)
  },
)

// 派发广播
// 注意: 发送客户端派发出的消息，发送客户端自己也可以收到，监听器需要使用 isFromSelf 判断
broadcast.broadcast({
  // 用户自定义数据
  data: { message: 'Common' },
  /**
   * 派发类型，分为
   *    BroadcastLevel.RoomLevel = 1, // 房间级同步
   *    BroadcastLevel.Followers = 2, // 关注列表级同步
   *    BroadcastLevel.SpecificUser = 3, // 指定同步人
   */
  msgType: BroadcastLevel.RoomLevel,
})

// 当不再需要监听广播时
broadcast.destroy()
```

具体 API 可参考文档 [Broadcast](https://h5.xverse.cn/docs/sdk/latest/core/classes/Broadcast.html)
