# Skin

一个房间可以有不同的房间风格，那么这个房间风格就称为皮肤（Skin），在进房前可以指定要进入的房间皮肤，也可以在运行时动态切换。

## 切换皮肤

```ts
await worldInstance.getCurrentRoom()?.setSkinInfo({
  skinId,
})
```

对当前房间调用 `setSkinInfo` 是一个异步调用，异步调用成功后会就完成了皮肤的切换

对非当前房间调用 `setSkinInfo` 是一个同步调用。调用后不会发生任何可见的变化，除非开发者后续调用了目标房间的 `enter` 方法。
