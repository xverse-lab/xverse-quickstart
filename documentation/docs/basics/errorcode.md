# 错误码

错误码设计采用二级分类，6 位数字设计。
前 2 位代表一级分类，后 4 位代表具体错误码。

## 一级分类

| 前 2 位 |   说明   |
| :-----: | :------: |
|   10    | 基础分类 |
|   11    |  传输层  |
|   12    | 后端错误 |
|   13    | 业务错误 |
|   14    | 解码错误 |

## 错误码一览

### 10 基础分类

| 错误码 |     名字      |        说明         |
| :----: | :-----------: | :-----------------: |
| 100000 |    Unknown    |      未知错误       |
| 100001 |     Param     |      参数错误       |
| 100002 |  UnSupported  |    不支持的机型     |
| 100003 | JSONStringify | JSON Stringify 错误 |
| 100004 |   JSONParse   |   JSON Parse 错误   |
| 100005 |      DB       |       DB 异常       |

### 11 传输层

| 错误码 |          名字           |          说明          |
| :----: | :---------------------: | :--------------------: |
| 110001 |          HTTP           |     HTTP 请求错误      |
| 110002 |     WSUrlGetFailed      | Websocket Url 获取失败 |
| 110003 |      WSOpenTimeout      |  Websocket Open 超时   |
| 110004 |     WSConnectFailed     |   Websocket 连接失败   |
| 110005 |     WSCloseAbnormal     |   Websocket 意外关闭   |
| 110006 |    RTCConnectTimeout    |      RTC 连接超时      |
| 110007 |     RTCCreateOffer      |   RTC Offer 创建失败   |
| 110008 | RTCSetLocalDescription  | RTC 设置本地 SDP 失败  |
| 110009 |     RTCCreateAnswer     |  RTC Answer 创建失败   |
| 110010 | RTCSetRemoteDescription | RTC 设置远端 SDP 失败  |
| 110011 | RTCDisconnectedAbnormal |      RTC 连接失败      |
| 110012 |     DoActionTimeout     |    Action 请求超时     |

### 12 后端错误

| 错误码 |             名字              |               说明                |
| :----: | :---------------------------: | :-------------------------------: |
| 122000 |       NoAvailableWorker       |            服务器异常             |
| 122001 |        ServerUserLimit        |            服务器异常             |
| 122002 |          ServerParam          |            服务器异常             |
| 122003 |          LackOfToken          |            服务器异常             |
| 122004 |          LoginFailed          |            服务器异常             |
| 122005 |       VerifyServiceDown       |            服务器异常             |
| 122006 |      CreateSessionFailed      |            服务器异常             |
| 122008 |         RtcConnection         |            服务器异常             |
| 122009 |        DoActionFailed         |            服务器异常             |
| 122010 |        StateSyncFailed        |            服务器异常             |
| 122011 |        BroadcastFailed        |            服务器异常             |
| 122012 |         DataAbnormal          |            服务器异常             |
| 122015 |         GetOnVehicle          |            服务器异常             |
| 122016 |      ServerInternalError      |            服务器异常             |
| 122017 |          RepeatLogin          |            服务器异常             |
| 122018 |       RoomDoesNotExist        |            服务器异常             |
| 122019 |         TicketExpire          |            服务器异常             |
| 122020 |        ServerRateLimit        |            服务器异常             |
| 122022 |          UserKicked           |            服务器异常             |
| 122023 |      EnterWorldNotInTime      |            服务器异常             |
| 122333 |        DoActionBlocked        |            服务器异常             |
| 122334 |       ActionMaybeDelay        |            服务器异常             |
| 122335 |          UnReachable          |            服务器异常             |
| 123001 |      VGCodeTokenInvalid       |       voice group 鉴权失败        |
| 123002 |   VGCodeInternalMysqlError    |  voice group 查询 mysql 数据错误  |
| 123003 |   VGCodeInternalRedisError    |  voice group 查询 redis 数据错误  |
| 123004 |  VGCodeGroupPubSetFullError   |     voice group pub 人数已满      |
| 123005 |       VGCodeParamError        |   voice group 请求传递参数错误    |
| 123006 |   VGCodeGroupNotExistError    | voice group 请求的 groupId 不存在 |
| 123110 |   VGCodeHostPermissionError   |    voice group 无法授权主持人     |
| 123111 |   VGCodePubPermissionError    |     voice group 开麦权限不足      |
| 123112 |   VGCodeSubPermissionError    |     voice group 收听权限不足      |
| 123113 | VGCodeApprovalPermissionError |     voice group 踢人权限不足      |
| 123114 |   VGCodeKickPermissionError   |     voice group 审批权限不足      |
| 123115 |     VGCodePermissionError     |       voice group 权限不足        |
| 123116 |     VGCodeUserLogOutError     |      voice group 用户已登出       |

### 13 业务错误

| 错误码 |         名字          |          说明          |
| :----: | :-------------------: | :--------------------: |
| 130001 |      ConfigFetch      |      配置拉取失败      |
| 130002 |      DecoderInit      |    解码器初始化错误    |
| 130003 |  DecoderInitTimeout   |    解码器初始化超时    |
| 130004 |        LoadLPM        |      粗模加载失败      |
| 130005 |    RepeatInitWorld    |   重复初始化世界错误   |
| 130006 | RepeatConstructWorld  |   只允许构建一个世界   |
| 130007 |   WorldInitTimeout    |     初始化世界超时     |
| 130008 |   WorldEnterTimeout   |      进入世界超时      |
| 130009 | EnterWorldWithoutInit |     未初始化就进房     |
| 130010 |   RepeatEnterWorld    |   进房过程中再次进房   |
| 130011 |   ExcutionAbnormal    | 切换房间/皮肤/路线异常 |
| 130012 |    ExcutionTimeout    | 切换房间/皮肤/路线超时 |
