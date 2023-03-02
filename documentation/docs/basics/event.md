# 事件处理

## Actor

所有 Actor 对象都支持绑定事件，内置的事件有 `click` 和 `doubleclick`

参考示例

```ts
const avatar = world.getPlayer()

avatar.on('click', () => {
  console.error('self clicked')
})
```

SDK 提供了 `EventEmitter` 类可用于触发自定义事件

## SDK 对象

SDK 提供的继承自 `EventEmitter` 的对象，针对其事件，都提供了简易监听函数，并且其简易监听函数的明明都遵循 `on${Capitalize<EventName>}` 命名规则

例如：World 对象提供了 `enter` 事件，开发者可以使用事件监听的方式使用:

```typescript
const worldInstance = new World()
worldInstance.on('enter', () => {
  // DoSomething...
})
```

同时，开发者如果继承了世界，那么也可以重写其简易监听函数：

```typescript
class MyWorld extends World {
  onEnter() {
    // DoSomething...
  }
}
```

:::caution
⚠️ 注意：这里的简易监听函数目前只有在被继承的时候才会生效，其他时候替换不会生效，暂不支持使用类似 `room.onEnter = ()=>{}` 这种方式，**使用这种方式目前会完全无效，不能被调用**
:::

## 场景点击事件

在场景中某个位置点击，SDK 会触发`onClick`事件告知开发者被点击的位置，便于开发者做一些额外操作。

```typescript
worldInstance.getClickingEvent().on('click', (pos: IPosition) => {
  // do sth
  console.log(pos)
})
```
