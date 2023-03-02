---
sidebar_position: 5
---

# RichSurface

RichSurface 是 3D 场景中的一个可交互部件，可在上面设置多媒体资源，SDK 内置的功能包括视频源、静态贴图、呼吸点。也是继承自 [actor](./actor.md)

Richsurface 由两个部分组成，一个是模型，一个是媒体资源。通过特定接口，可以给模型设定任意符合规范的媒体资源。

## 模型部分

实例化 RichSurface 和其他 Actor 一致。

```ts
import { RichSurface } from '@xverse/core'
const surface = world.spawn(RichSurface)
```

使用 addMeshAsync(option: IAddMeshOption) 接口 IAddMeshOption 接口中设置 url 或者 defaultMeshOption，当设置 url 时，会加载 url 指定的文件，而当 url 为空时，根据 defaultMeshOption 中的信息，创建一些内置的简单模型，比如面片、BOX 等

### 给模型设置媒体资源

setMediaSource( mediaSource: XMediaSource ) 入参 XMediaSource 类型是所有用于 Richsurface 的媒体资源的基类。

## 媒体资源部分

媒体资源全部继承自基类`XMediaSource`，目前实现的媒体资源包括

| 媒体资源             | 说明           |
| -------------------- | -------------- |
| XVideoSource         | 视频类媒体资源 |
| XStaticTextureSource | 静态图资源     |
| XTextSource          | 文本资源       |
| XSpriteImgSource     | 精灵图资源     |

媒体资源通过`setMedia()`设置使用的媒体，通过`getController()`获取控制器（比如视频的播放，文本的移动等）
下面代码描述了生成一个静态图资源，并设置到一个 richsurface 模型上的过程

```typescript
//EMediaSourceType 包括上述四种资源类型
import { RichSurface, EMediaSourceType } from '@xverse/core'

const surface = world.spawn(RichSurface)

//richsurface需要挂载的模型
const addMeshOption = {
  defaultMeshOption: {
    type: EDefaultMeshType.Plane,
    position: point?.point.position,
    rotation: point?.point.rotation,
    width: 2 * 100,
    height: 2 * 100,
  },
}

//richsurface挂载的富媒体资源
const media = 'https://static.xverse.cn/playground/demo.jpg'

//媒体参数
const mediaOptions = {
  fps: fps,
  lifeTime: lifeTime,
  spriteWidthNumber: spriteWidthNumber,
  spriteHeightNumber: spriteHeightNumber,
}

surface.create({
  type: EMediaSourceType.XStaticTextureSource,
  mediaData: media,
  addMeshOption,
  mediaOptions,
  billboardMode: EBillboardMode.All,
})
```

### 改变 richsurface 绑定的模型

```ts
import { RichSurface,EMediaSourceType} from '@xverse/core'

const surface = world.spawn(RichSurface)
surface.create(...)

const meshOption = {
    defaultMeshOption: {
    type: EDefaultMeshType.Plane,
    position: point?.point.position,
    rotation: point?.point.rotation,
    width: 2 * 100,
    height: 2 * 100,
  }
}

//richsurface挂载的富媒体资源
const media = 'https://static.xverse.cn/playground/demo.jpg'
//媒体资源参数
const mediaOptions = {
    fps: fps,
    lifeTime: lifeTime,
    spriteWidthNumber: spriteWidthNumber,
    spriteHeightNumber: spriteHeightNumber
}

/**
 * 支持修改媒体资源
 * 传入参数media, 则会修改模型上挂载的媒体资源
 * 支持更换媒体资源参数
 * 当参数不包含mediaOptions,则保留上次媒体资源参数设置
 *
 * 不支持更换媒体资源类型
 */
surface.change(media, mediaOptions)
```

### 事件监听

目前支持方法有 `beginLoading`, `beginOverlap`, `beginPlay`, `click`, `doubleClick`,`endLoading`, `endOverlap`, `endPlay`, `longPress`, `mouseEnter`, `mouseLeave`, `pointerDown`, `pointerOut`, `pointerUp`

```ts
/**
 * surface事件监听方法
 */
surface.on('click', (e) => {
  // do something
})
```

### 静态贴图

在 new `XStaticTextureSource`之后，使用`setMedia(data: string)`设置静态图资源，此处的 data 可以是 base64、url、blob 等。静态图没有什么控制器，因此`getController()`拿到的是 null

### 视频流

在 new `XVideoSource`之后，使用`setMedia(data: HTMLVideoElement)`设置 tv 资源。通过`getController()`拿到控制器，做`play`、`pause`、`stop`、`seek`操作。

### 精灵图

在 new `XSpriteImgSource`之后，使用`setMedia(data: string, options: ISpriteImgOptions)`来设置精灵图资源，通过`getController()`拿到精灵图控制器，主要为控制精灵图的播放`play()`与暂停`pause()`

"每循环播放完一次"后会抛出`onLoop`事件

在下面的代码中，创建一份精灵图媒体资源，并指定声明周期为 1s，闪烁频率 15fps，精灵图中的水平精灵数量与垂直精灵数量分别为 4 和 5。当设置声明周期为-1 时，会永久显示。 XSpriteImgSource 中每次播放完成所有序列帧之后，会触发回调, 参考下面的代码

```typescript
//创建surface
const surface = world.spawn(RichSurface)
surface.create(.....)

// 添加回调,每次循环一次之后，就会触发
surface.getMediaSource().on('onLoop',()=>{
  console.log('===> loop')
})


```

### 文字

在 new `XTextSource`之后，首先需要使用`init(option: ITextCanvasOption)`来做本文资源的初始化，此处主要设置文本绘制画面的大小、画面区域划分等信息。然后通过`setMedia(data: string, options: ITextSourceOption)`来填写实际的文本内容。初始化只要做一次即可，之后的`setMedia`可以执行多次，来完成文本更新等内容。文本的 demo 在 playground/src/simpleLevelDemo/test/demo_richsurface.ts 中 DemoCreateWordSource() 函数部分。

#### ITextCanvasOption

| 类型          | 说明                                 |
| ------------- | ------------------------------------ |
| width         | 用于承载文字绘制区域的画布的宽(像素) |
| height        | 用于承载文字绘制区域的画布的高(像素) |
| widthSlotNum  | 画布区域水平均匀划分数量             |
| heightSlotNum | 画布区域垂直均匀划分数量             |

之所以需要设置画布水平、垂直区域划分，是为了在同一块画布中，可以同时指定不同区域，绘制不同文字。

一些情况说明：

- 当设置背景图的大小，小于画布的宽高时，可能出现背景图只展示了一部分的问题；
- 当文字比较模糊时，需要增大画布的宽高，同时需要增大文字字体大小
- 当只增大画布宽高，不改变文字大小时，会发现文字相对于画布缩小了，原因是文字绘制是按照像素绘制，而不是比例绘制

##### ITextSourceOption

| 类型          | 说明                                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| currentSlot   | 当前需要绘制文字的区域编号，从 0 开始，最大为 (widthSlotNum\*heightSlotNum-1), 按照从左到右、从上到下一次排列。 |
| clearArea     | true: 清理当前指定区域；false：不清理，直接在现有区域中继续绘制                                                 |
| fontSize      | 字体大小                                                                                                        |
| font          | 字体类型                                                                                                        |
| color         | 字体颜色                                                                                                        |
| fontWeight    | 字体粗细                                                                                                        |
| backgroundUrl | 背景图片                                                                                                        |

通过 ITextSourceOption 中的 currentSlot 来指定当前绘制作用于哪个区域。背景图片会直接在整张画布中展示，而文字本身会在指定区域中绘制。

## Billboard 模式

目前提供了 5 种模式，具体见文档中关于 EBillboardMode 的描述；

下面表示在各个方向上，都开启 billboard

`surface.rootComponent.billboardMode = EBillboardMode.All`

通过`create()`方法创建的 richsurface,可以自行设置 `EBillboardMode` 参数

## AttachToActor

开发者可以选择将创建好的 RichSurface 附着到其他的 Actor 之上，比如 Avatar，实现一些自定义的组合。

## 可视距离

`RichSurface` 实例的 `maxVisibleValue` 属性可以获取和设置最大可视距离
`RichSurface` 实例的 `minVisibleValue` 属性可以获取和设置最小可视距离

## 事件

参考 [事件处理章节](./event.md)
