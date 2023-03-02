# TimeLine

TimeLine 是为了方便快速的编排表演类节目而实现的结构。可以利用配套[在线工具(软解)](https://console.xverse.cn/web-editor/index.html#/)、[在线工具(硬解)](https://console.xverse.cn/web-editor-hard/index.html#/)进行可预览的实时的编排，提高表演类需求开发效率。还支持播放中事件触发，可实现更丰富的功能，如触发盖屏，触发红包雨等。

> 现阶段 TimeLine 支持角色（大小调整），动作，特效，位置。
>
> 目前网页编排后会有操作支持导出到本地，格式为 JSON。需自己维护。

## 注意事项

TimeLine 本身不包含任何实体资源，比如 glb 格式的资源。只是一份 JSON 格式的配置文件。所以 Timeline 是否可以正常播放依赖房间-皮肤所包含的资源，是与皮肤强相关的。

使用者需要在编排工具中选择相应的 rid 下的房间-皮肤，工具会展示可用资源，编排后的 TimeLine 只可以在包含配置文件所有内容的房间-皮肤下才可以正常播放。不然会缺失部分素材，播放效果不符合预期。

如果需要复用已编排好的 TimeLine，可以将 TimeLine JSON 文件加载在工具中，加载时会进行素材校验，不存在的素材会以红色标注，可以替换或者删除，实现整体流程复用，提高开发效率。

## 使用路径

1. 通过 World 提供的工厂方法 `spawn` 来进行实例，TimeLine 是与房间绑定的，默认情况下退出房间会销毁

```typescript
timeLine = world.spawn(Timeline)
```

2. `load` 数据方法，返回 Promise，结束后所有数据已经加载在内存中了。load 数据大的话可能比较久。load 完成之后并不会渲染到场景中，首次 `play` 之后才会出现。没有渲染在场景中时也可以使用 `goToFrame` 方法进行播放位置的跳转。

```typescript
timeLine.load(timeLineData: ITimeLineType)
```

`warmUpLoad`（渐进加载）数据方法，返回 Promise，结束后，入参中 startTime 时刻（默认是 0）所需要的数据已经在内存中了，随着 TimeLine 的播放
数据会逐步加载进内存，避免峰值内存过高。

```typescript
timeLine.warmUpLoad(timeLineData: ITimeLineType, startTime: number)
```

preLoad 的阈值是 30s，即会提前 30s 加载所需要的资源。如果出现播放时，资源缺失，说明 30s 得默认阈值太短了，可以把阈值设置得更大，阈值设置越大，峰值内存越大。

```typescript
timeLine.preLoadTime = 60
```

1. 事件监听。

```typescript
timeLine.on('notify', ('编辑timeline的事件名') => {
  if (e === '编辑timeline的事件名') {
    //自定义func
    func()
  }
})
```

4. 播放 timeLine，可选传参 true，实现循环播放。首次 `play` 会使 `load` 后的数据进行渲染。

```typescript
timeline.play(loop?: boolean)
```

5. 暂停

```typescript
timeline.pause()
```

6. 销毁

```typescript
timeline.dispose()
```

7. 跳转帧，秒的话需要乘 fps，fps 可通过 `timeLine.fps` 获得。跳转帧不会影响播放状态，暂停状态下跳转后，仍然是暂停。播放过程中跳转后则继续播放。首次渲染之前跳转，资源也不会渲染，只有首次 `play` 才可以触发首次渲染。

```typescript
timeline.goToFrame(value: number)
```

注意，如果调用了渐进加载`warmUpLoad`来 load 资源，跳转帧之前，需要提前加载跳转到的帧所需要的资源：

```typescript
timeline.prepareResourceAt(time: number).then(()=>{
    timeline.goToFrame(time * timeline.fps)
})
```
