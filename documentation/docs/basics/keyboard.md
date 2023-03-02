# 键盘

键盘是一个在 SDK 内部实现的单例模块，在 World 实例构造之后就可以通过 World 的 `getKeyboard()` 方法获取到键盘的引用。键盘默认 W,A,S,D 可以控制玩家移动。

## 初始化

键盘需要是在运行时去按需初始化的，调用 init 方法就可以初始化键盘事件并操作

```ts
world.getKeyboard().init()
```

## 控制显隐

- 初始化键盘

```ts
world.getKeyboard().init()
```

- 销毁键盘

```ts
world.getKeyboard().destroy()
```

## 行进开关

默认情况下，移动键盘可以控制玩家移动。这个也可以通过 Keyboards 的 `movePlayer` 属性改变这个默认行为，设置为 `false` 后移动摇杆，玩家也不会移动的。

## 事件

摇杆也会触发一些事件提供给开发者，这些事件主要是

| 事件名  |      说明      |
| :-----: | :------------: |
| keydown | 键盘按下时触发 |
|  keyup  | 键盘抬起时触发 |
|  move   | 键盘移动时触发 |
