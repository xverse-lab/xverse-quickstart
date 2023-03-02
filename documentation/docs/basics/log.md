# 日志上报

开发者可以使用 SDK 提供的日志上报功能。

```ts
import { appLog } '@xverse/core'

// 上报info，标准格式为 event + payload
appLog.info({ event: 'key', payload: 'value' })

// 上报warn，标准格式为 event + payload
appLog.warn({ event: 'key', payload: 'key' })

// 上报err，标准格式为 event + error
appLog.error({ event: 'key', error: 'error' })
```
