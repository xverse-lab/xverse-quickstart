# 空间音频

空间音频 应用在 video 和 audio 资源对应的音频，使得音频有空间效果
它的逻辑是：在场景内靠近音源例如 tv，音量变大；远离音源，音量变小；超过范围就听不到

空间音频是一个在 SDK 内部实现的单例模块，在 World 实例构造之后就可以通过 World 的 `getSpatialAudio`方法获取到空间音频的引用。

```typescript
import { IInitAudioData } from '@xverse/core'

/** ---------------------初始化-------------------------- */
// 初始化
const data: IInitAudioData = { audiosConfig: this.audioCfg, videoElements, audioElements }
worldInstance.getSpatialAudio().init(data)

/** --------------------开启/关闭-------------------------- */
// 开启空间音频
worldInstance.getSpatialAudio().enable()
// 开启空间音频
worldInstance.getSpatialAudio().disable()

/** ---------------------播放/停止-------------------------- */
//播放某个音频, 传入序号或序号的数组
worldInstance.getSpatialAudio().stop(idxs)
//停止播放某个音频, 传入序号或序号的数组
worldInstance.getSpatialAudio().stop(idxs)

/** ---------------清理 空间音频，切换场景时需要调用------------ */
worldInstance.spatialAudio.dispose()

/** ---------------重新唤起空间音频------------ */
worldInstance.spatialAudio.resumeAudioContext()
```
