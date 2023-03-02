此 Package 用于调试测试 API 使用

```ts
src
├── app.tsx
├── assets
│   └── loading.png
├── components
│   ├── animation-select
│   ├── collapse-btn
│   ├── components-panel
│   ├── effect-select
│   ├── ...
│   ├── debug
│   ├── global.ts
│   └── select.tsx
├── index.less
├── main.tsx
├── tmeland
│   ├── base
│   ├── disco
│   ├── island
│   ├── livehouse
│   └── vr-room
└── vite-env.d.ts
```

src/tmeland 目录模拟以往的 TMELAND 业务实现。src/tmeland/base 目录下基于 SDK API 实现了一些业务基类。其余目录为 TMELAND 各个 Room 的业务实现

## 自动化测试

为了方便自动化测试查找按钮，目前为 playground 中按钮增加了 className 属性。参考 src/components/test-util/avatar/avatar-btns.tsx

对应 className 如下，开发时需要注意增加样式 className 时尽量与以下名称不重叠。

### 进入按钮

- 'start-btn' 点击进入世界

### world/room 相关

- 'firstPerson' 第一人称
- 'switchRoom' 切换房间
- 'switchSkin' 切换皮肤
- 'switchPath' 切换 path
- 'explicitRule' 显隐规则测试
- 'pictureQuality' 画质选择
- 'localTexture' 使用本地贴图

### Avatar 相关

- 'avatarClone' 克隆 Avatar
- 'emitListener' 监听键盘 emit 事件
- 'zoomIn' 放大 avatar
- 'zoomOut' 缩小 avatar
- 'modeSwitch' 模式：摇杆
- 'teleTo' 传送至呼吸点(teleTo)
- 'navTo' 导航到呼吸点(navTo)
- 'lookAt' 面向呼吸点(lookAt)
- 'pointPreview' 预览所有呼吸点
- 'keepMoving' 开启持续走动
- 'shortMoving' 运动 5 秒
- 'specialEffect' 特效
- 'changeDress' 打开换装面板
- 'hideSelf' 隐藏自身
- 'hideOthers' 隐藏其他玩家
- 'hideOthersData' 屏蔽其他玩家信息
- 'Animation' 动作
- 'usePendant' 使用挂件

### 其他

- 'mvBtn' 开启/关闭 mv
- 'Snapshot' 拍照
- 'showPicture' 展示头顶图片或按钮
- 'showVideo' 显示 video
- 'ToggleShading' 切换着色
- 'showNavMesh' 显示 NavMesh
- 'createVolume' 显隐规则测试
- 'Record' 录制
- 'speakerJoinsGroup' 演讲者加入群组
- 'listenersJoinGroup' 听众加入群组

### 调试

- 'toggleStats' toggleStats
- 'showClickPosition' 显示点击位置
- 'dropFrameDisplay' 开启丢帧展示
