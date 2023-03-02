import { World } from '@xverse/core'
import { BaseAvatar } from '../../../game-play/avatar'

export class otherTest {
  public static instance: otherTest
  constructor(private worldInstance: World) {}

  public static getInstance(worldInstance: World) {
    if (!this.instance) {
      this.instance = new otherTest(worldInstance)
    }
    return this.instance
  }

  handleTakePhoto = () => {
    this.worldInstance.camera.screenShot({ autoSave: true })
  }
  showRichsurface = () => {
    const avatar = this.worldInstance.getPlayer(BaseAvatar)
    avatar.disposeImage('a0d0e41f233fc00a')
    avatar.setImage({
      bomId: 'a0d0e41f233fc00a',
      meshOption: { width: 120, height: 20 },
    })
  }
  handlePubSubGroup = async (voiceGroupId: string) => {
    await this.worldInstance.voiceGroup.joinGroup(voiceGroupId)
  }

  handleSubGroup = async (voiceGroupId: string) => {
    await this.worldInstance.voiceGroup.joinGroup(voiceGroupId, false)
  }
  handleQuitGroup = async () => {
    await this.worldInstance.voiceGroup.quitGroup()
  }
}
