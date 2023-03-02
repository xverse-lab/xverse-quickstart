# AIChat

智能回复

```ts
import { AIChat } from '@xverse/core'
const params = {
  app: 'XXXX',
  userId: world.getPlayer().userId,
  npcId: 'aIChatNpcId',
}
const aiChat = new AIChat(params)
const res = await AIReplyRef.current.getUtter('self_intro')
```
