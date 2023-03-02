---
sidebar_position: 2
---

# 迁移至 2.0

## 预加载

### SDK 1.X

```js
import { Xverse, IViewMode } from '@xverse/tmeland'
const xverse = new Xverse({/*some options*/})
await xverse.preload?
.start(viewMode as IViewMode,(process: number,total:number)=>{
    console.log(process,total)
})
```

### SDK 2.X

暂无

## 进房

### SDK 1.X

```js
//xverse 见 预加载
//1.传入 roomId 来隔离
//2.传入 skinId 来确定房间风格
import { XverseRoom } from '@xverse/tmeland'
const room: XverseRoom = await xverse.joinRoom(/*roomId skinId 等与进房相关的参数*/)
```

### SDK 2.X

```js
import { IRoomInfoSetting, IWorldOptions, Room, World } from '@xverse/core'
//第一步:初始化世界 init
const worldOptions: IWorldOptions = {/*初始化世界所需参数*/}
const world: World = new World(worldOptions)
await world.init()

//第二步:实例化房间；从world 上读取所有可以切换的 room，或直接从业务相关的配置系统读取
const roomConfigs = world.roomConfigs.map((item) => {
    return {
    label: item.name,
    value: item.id,
    }
})
roomConfigs.forEach((roomConfig) => {
    world.getRoomInstance(Room, {
        roomId: roomConfig.value,
    })
})

//第三步:进房 enter
const room = world.getRoomInstances().find(…/*roomID*/…)
const roomInfo: IRoomInfoSetting = {……}
room.setRoomInfo(roomInfo)
await room.enter()
```

## 切换房间

### SDK1.X

```js
//room.xxx.access()  xxx指disco、musicianHall、reportHall、watchTower等
room.disco
  .access()
  .then(() => {})
  .catch((e) => {
    toast(`进入XX失败, msg: ${e}`)
  })
```

### SDK2.X

```js
//1.根据roomId找到对应的房间
const targetRoom = world.getRoomInstances().find((item) => item.roomId === roomId)
//2.调用enter
await targetRoom.enter()
```

## 上下飞艇、热气球

### SDK1.X

```js
import { Codes, VehicleType } from '@xverse/tmeland'
try {
    await room.vehicle.access(vehicle)
} catch (error: any) {
    if (error.code === Codes.GetOnVehicle) {
        toast('抱歉目前已满员')
    } else if (error.code === Codes.FrequencyLimit) {
        toast(`您操作的太快了`)
        return
    } else {
        toast(`上${vehicle === VehicleType.HotAirBalloon ? '热气球' : '飞艇'}失败, msg: ${error}`)
    }
}
```

### SDK2.X

    同上切换房间

## 切换一三人称

### SDK1.X

```js
import { Person, Codes } from '@xverse/tmeland'
const targetPerson = Person.First || Person.Third
room.camera
  .setPerson(targetPerson)
  .then(() => {
    /**some code when setPerson success */
  })
  .catch((e) => {
    if (e.code === Codes.FrequencyLimit) {
      toast(`频率限制：您操作的太快了`)
      return
    }
    toast(`人称切换失败, msg: ${e}`)
  })
```

### SDK2.X

```js
await world.currentRoom?.setRoomInfo({
  pathId,
})
```

## 观察者模式、探索模式互切

### SDK1.X

```js
//切到观察者
await room.setViewMode('observer')
//切到探索模式
await room.setViewMode('full')
```

### SDK2.X

```js
//world见进房
//1.传观察者的pathId=‘view1’,切到观察者
//2.传探索模式的pathId='first',切到探索模式
await world.currentRoom?.setRoomInfo({
  pathId,
})
```

##
