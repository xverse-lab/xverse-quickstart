# 术语和坐标系

## 术语

World：代表元象 3D 世界

Room: 代表 3D 世界中的一个 3D 场景

Skin: 3D 场景的风格表现

Path: 3D 场景中的不同路线

Avatar: 3D 虚拟角色

RichSurface: RichSurface 是 3D 场景中的一个可交互部件，可以在上面设置 TV，图片等多媒体资源

SubSequence: 单个特效，位置由开发者决定

Sequence: 带有位置信息的场景特效

Actor: 上述 RichSurface、Avatar、SubSequence 等派生类的基类，提供显示隐藏，生命周期管理等功能

Console: 元象的控制台

releaseId: 发布标识，对应着一次 Console 的一次发布

BOMId: 3D 场景的配置清单

## 坐标系

元象的坐标系采用左手坐标系

## Transform

X 轴正向为右，Z 轴正向为上，Y 轴正向向后。SDK 提供了 `IPosition` 的类型定义用于表示坐标。

朝向上，绕 Y 轴旋转为 Pitch，绕 Z 轴旋转为 raw；绕 X 轴旋转为 roll；SDK 提供了 `IRotation` 的类型定义用于表示朝向。

SDK 提供了 `IScaling` 的类型定义用来表示缩放。

## 单位

元象的所有距离单位均为 `cm`。
