import { Broadcast, World, EBroadcastLevel, EventEmitter } from '@xverse/core'
import { BaseWorld } from './world'
export enum Bottles {
  /**
   * 美汁源
   */
  MeiZhiYuan = 'MeiZhiYuan',
  /**
   * 芬达
   */
  FenDa = 'FenDa',
  /**
   * AHHA
   */
  AHHA = 'AHHA',
  /**
   * 纯悦
   */
  ChunYue = 'ChunYue',
  /**
   * 阳光
   */
  YangGuang = 'YangGuang',
  /**
   * 淳茶社
   */
  ChunChaShe = 'ChunChaShe',
  /**
   * 雪碧
   */
  XueBi = 'XueBi',
  /**
   * 可乐
   */
  KeLe = 'KeLe',
}

export interface IEventBusEvents {
  takeBottle: {
    /**
     * 拿瓶的avatar userId
     */
    userId: string
    /**
     * 拿着的瓶子
     */
    bottleId: Bottles
  }
}

export interface IBaseEventBusEvents {
  avatarTouched: {
    userId: string
  }
  avatarLoaded: {
    userId: string
  }
  clickCheerBubble: {
    userId: string
  }
  othersLoaded: {
    userId: string
  }
  othersDisposed: {
    userId: string
  }
  roomEnterError: {
    code?: number
  }
  pathEnterError: {
    code?: number
  }
  enterAppOB: {
    code?: number
  }
  avatarClick: {
    userId: string
  }
  avatarLongPress: {
    userId: string
  }
  // 点击头顶气泡
  bubbleClick: {
    userId: string
  }
  // 点击头顶气泡消失
  bubbleDispose: {
    userId: string
    bomId: string
  }
}

export interface IBottleProps {
  info: {
    userId: string
    bottleId?: Bottles
  }
}

export enum BroadcastType {
  dropBottle = 'dropBottle',
  takeBottle = 'takeBottle',
}

export class BusinessEventBus {
  public broadcastMap: Map<string, any>
  public world: World
  constructor(world: World) {
    this.world = world
    this.broadcastMap = new Map()
  }

  /**
   * @description 注册指定广播事件
   * @param broadcastType 自定义广播类型
   * @param callback(data, isFromSelf) 自定义广播回调
   *  data 用户自定义数据
   *  isFromSelf 消息是否是自己派发的
   */
  registerBroadcast(broadcastType: BroadcastType, callback: (...args: any) => any) {
    if (!this.world) return
    // 创建一个广播对象
    const broadcast = new Broadcast(this.world, broadcastType, (data: any, isFromSelf) => {
      callback(data, isFromSelf)
    })
    this.broadcastMap.set(broadcastType, broadcast)
    return broadcast
  }

  /**
   * @description 广播事件
   * @param broadcastType 自定义广播类型
   * @param data 用户自定义数据
   * @param msgType 派发类型，分为
   * EBroadcastLevel.RoomLevel = 1, // 房间级同步
   * EBroadcastLevel.Followers = 2, // 关注列表级同步
   * EBroadcastLevel.SpecificUser = 3, // 指定同步人
   */
  broadcast(broadcastType: BroadcastType, data: string, msgType?: EBroadcastLevel) {
    const broadcast = this.broadcastMap.get(broadcastType)
    if (!broadcast) return
    broadcast.broadcast({
      data: {
        message: data,
      },
      msgType: msgType || EBroadcastLevel.RoomLevel,
    })
  }

  /**
   * @description 销毁指定广播事件
   * @param broadcastType 自定义广播类型
   */
  destroyBroadcast(broadcastType: BroadcastType) {
    if (this.broadcastMap.has(broadcastType)) {
      this.broadcastMap.get(broadcastType).destroy()
    }
  }
}
export class BaseEventBus extends EventEmitter<IBaseEventBusEvents> {
  public world: BaseWorld
  constructor(world: BaseWorld) {
    super()
    this.world = world
  }
}
