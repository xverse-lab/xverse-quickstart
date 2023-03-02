# Path

皮肤（Skin）由一个或多个 Path 组成。每个 Path 都有自己的渲染类型。渲染类型有两种：视频流模式和全景图模式。视频流模式下可以改变相机位置实现镜头移动，全景图模式目前就只能在一个相机位置转动相机浏览。

```ts
export enum RenderType {
  PANORAMA = 'PANORAMA',
  VIDEO = 'VIDEO',
}
```

这个类型可以通过 `IPathConfig` 中的 `renderType` 属性获取到

## 切换 Path

在进房后可以在当前房间的任意 Path 间进行切换

```ts
await worldInstance.getCurrentRoom()?.setSkinInfo({
  pathId,
})
```

## 载具路线执行完成后的回调

载具 Path 的调用会持续一段时间，除了根据异步返回确定是否调用成功之外，还可以传入 Path 执行完成的回调函数，会在执行完成后触发调用。

参考示例：

```ts
world.getCurrentRoom().setSkinInfo(
  { pathId: '64a6fd7308ed20c4' },
  {
    endCallback: () => {
      console.error('end')
    },
  },
)
```

## 载具路线镜头旋转角度限制

载具 Path 的调用会持续一段时间，这期间允许滑屏转动，有时我们不希望 360° 旋转，而是限制在一个固定的角度，这时就可以设置`dynamicPathRotateLimit`。

参考示例：

```ts
// ptich限制在+-80，yaw限制在+-70
world.getCurrentRoom().setSkinInfo({
  pathId: '64a6fd7308ed20c4',
  { maxPitchDiff: 80, maxYawDiff: 70 }:
})
```

## 一三人称切换

Path 还有不同的人称属性，分为第一人称和第三人称

枚举定义:

```ts
export enum PersonType {
  Third = 'ThirdPerson',
  First = 'FirstPerson',
}
```

这个类型可以通过 `IPathConfig` 中的 `personType` 属性获取到
