# 摇杆

摇杆是一个在 SDK 内部实现的单例模块，在 World 实例构造之后就可以通过 World 的 `getJoystick()` 方法获取到摇杆的引用。移动摇杆默认可以控制玩家移动。

## 初始化

摇杆需要是在运行时去按需初始化的，调用 init 方法就可以显示摇杆并操作

```ts
world.getJoystick().init()
```

## 控制显隐

- 显示摇杆

```ts
world.getJoystick().show()
```

- 隐藏摇杆

```ts
world.getJoystick().hide()
```

## 控制是否可操控

- 禁用摇杆

```ts
world.getJoystick().disable()
```

- 隐藏摇杆

```ts
world.getJoystick().enable()
```

## 行进开关

默认情况下，移动摇杆可以控制玩家移动。这个也可以通过 JoyStick 的 `movePlayer` 属性改变这个默认行为，设置为 `false` 后移动摇杆，玩家也不会移动的。

## 事件

摇杆也会触发一些事件提供给开发者，这些事件主要是

| 事件名 |           说明           |
| :----: | :----------------------: |
| start  |      摇杆启动时触发      |
|  end   | 摇杆移动结束复位时时触发 |
|  move  |      摇杆移动时触发      |
