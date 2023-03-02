# FPS 监视器

FPS 监视器用于监控 FPS 状况
它的逻辑是：根据一定频率采样帧率，判断在一定时间范围内低于可容忍帧率的比例，如果低于可容忍比例，则判断当前的 FPS 状况不好(Bad)，否则判断当前的 FPS 状况稳定(Good)

FPS 是挂载在 world 上的对象,会随 world 初始化而初始化.

当切入切出程序时， Fps Detector 会清空自己的采样，确保不会因为因为切出切入导致采样丢失

## 快速使用

```typescript
import { fpsDetector, EFPSStatus } from '@xverse/core'

/** -------------------获取fpsDetector-------------------- */

const fpsDetector = worldInstance.getFpsDetector()

/** ---------------------自动模式-------------------------- */

fpsDetector.on('fpsStatusChanged', ({ curFpsStatus }) => {
  // 将结果渲染在屏幕上
  renderToScreen(EFPSStatus[curFpsStatus])
})
// 开始采样
fpsDetector.start()

// 过了一会儿
fpsDetector.stop()
/** -------------------自动模式结束------------------------ */

/** ---------------------手动模式-------------------------- */

// 将更新模式改为手动模式
fpsDetector.updateMode = EUpdateStatusMode.ManualUpdate
// 开始采样
fpsDetector.start()

// 设定每 6s 检查一次当前 FPS 状态
const detectInterval = setInterval(() => {
  // 更新并获取当前 FPS 状态
  const curFpsStatus = fpsDetector.getStatus()
  // 将结果渲染在屏幕上
  renderToScreen(EFPSStatus[curFpsStatus])

  // 如果不需要监控了
  if (needNotDetect) {
    // 停止监控
    fpsDetector.stop()
    // 停止计时器
    clearInterval(detectInterval)
  }
}, 6000)
/** -------------------手动模式结束------------------------ */
```

## FPS 状况一览

FPS 状况是枚举值，它的名字是 `EFPSStatus`

| 状况名 |       说明       |
| :----: | :--------------: |
|  Good  |   FPS 状况稳定   |
|  Bad   | FPS 目前低于预期 |

## 切换模式

FPS 监视器的作用通常是作为调试监控，但也可能开发者想在运行时使用 FPS 监视器，比如，当 FPS 状况持续低于预期，就降低分辨率或降低画质。

在运行时每个时间间隔都判断 FPS 状况是昂贵且没有必要的，因此，开发者可以根据自己的需要选择是否自动更新 FPS 状况

```typescript
// 将更新模式切换为手动更新
fpsDetector.updateMode = EUpdateStatusMode.ManualUpdate

// 获取当前 FPS 状况
const curFpsStatus = fpsDetector.getStatus()
```
