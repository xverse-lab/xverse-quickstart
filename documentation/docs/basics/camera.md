# 相机

相机（Camera）是一个在 SDK 内部实现的单例模块，在 World 实例构造之后就可以通过 World 的 `getCamera` 方法获取到相机的引用。

## 快速使用

```typescript
// 禁用相机旋转
worldInstance.getCamera().disableRotation()

// 开启相机旋转
worldInstance.getCamera().enableRotation()

// 获取相机位置
const position = worldInstance.getCamera().position

// 获取相机旋转
const rotation = worldInstance.getCamera().rotation

// 设置相机位姿
worldInstance.getCamera().pose = { position, rotation }

// 截屏
worldInstance.getCamera().screenShot()
// 添加相机旋转限制
worldInstance.getCamera().setMainCameraRotationLimit()
// 移除相机旋转限制
worldInstance.getCamera().removeMainCameraRotationLimit()
```
