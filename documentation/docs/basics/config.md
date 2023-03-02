# 资产配置读取

3D 场景中会用到许多的场景数据，比如传送时的点位、呼吸点的点位朝向和呼吸点精灵图、RichSurface 的模型等等，这些场景数据都可以在 Console 中配置。这些数据传入 SDK 的接口，SDK 内部基于 World 初始化时提供的 AppId 和 releaseId 获取到配置。SDK 使用者可以通过 World 的 `getRoomConfigs` 和 Room 的 `getRoomConfig` 方法读取到这些配置。RoomConfig 的结构如下

```ts
export interface IRoomConfigItem {
  /**
   * 房间ID
   */
  id: string
  /**
   * 房间名称
   */
  name: string
  /**
   * 房间下的皮肤配置
   */
  skinList: ISkinListItem[]
}

export interface ISkinListItem {
  areaList: IAreaListItem[]
  attr: IAttr
  branchId: string
  dataVersion: string
  id: string
  moduleList: IModuleList[]
  name: string
  pathList: IPathListItem[]
  pointList: IPointListItem[]
}
```

业务代码中会存在很多读取一个 RoomConfig 中的的某个点位的配置，或者某个 Path 的信息，SDK 封装了一个工具类 `ConfigTools` 可以帮助使用者快速实现这个功能。

```ts
export declare class ConfigTools {
  static GetSkinConfig(room: Room, skinId?: string): import('./typings').ISkinConfig
  /**
   * 获得点位列表
   * @param room
   * @param skinId
   * @returns
   */
  static GetPointList(room: Room, skinId?: string): IPointConfig[]
  /**
   * 获取 Path 列表
   * @param room
   * @param skinId
   * @returns
   */
  static GetPathList(room: Room, skinId?: string): IPathConfig[]
  /**
   * 查找点位配置
   * @param room
   * @param pointId
   * @param skinId
   * @returns
   */
  static GetPoint(room: Room, pointId: string, skinId?: string): IPointConfig
  /**
   * 查找 Path 配置
   * @param room
   * @param pathId
   * @param skinId
   * @returns
   */
  static GetPath(room: Room, pathId: string, skinId?: string): IPathConfig
  /**
   * 根据资产 Path 查找资产
   * 建议使用 {@link GetAssetByBom}
   * @param room
   * @param assetPath
   * @returns
   */
  static GetAsset(room: Room, assetPath: string, skinId?: string): IAssetConfig
  /**
   * 根据 BomId 获取资产
   * @param room
   * @param bomId
   * @returns
   */
  static GetAssetByBom(room: Room, bomId: string, skinId?: string): IAssetConfig
  static GetAssetsByType(room: Room, type: EAssetTypeName, skinId?: string): IAssetConfig[]
}
```

我们只需要根据需要传入需要检索 Room 实例和查询 ID 就可以实现点位、Path、资产的快速检索。第三个参数是可选参数，如果没传，则使用传入的 Room 的正在使用的皮肤，如果没有设置正在使用的皮肤，则是皮肤配置中的第一项。

查询点位、Path 传入的 ID 都是 Console 中定义的 BomId，这个 ID 一旦生成就不会更换了。同一应用下不同房间如果 BOM 名称一致，那么生成的 BOM Id 也是一致的。资产的查询可以根据 BOMId，也可以根据资产 Path。
