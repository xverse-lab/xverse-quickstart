import { IPosition, Volume } from '@xverse/core'
import { Button, Toast } from 'antd-mobile'
import { useState } from 'react'
import { BaseAvatar } from '../../game-play/avatar'
import { g } from '../global'

let volumeInstance: Volume
Toast.config({
  duration: 3000,
  position: 'top',
})

export interface ITestVolumeProps {
  className?: string
}
export function TestVolume(props: ITestVolumeProps) {
  if (!g.world) return null
  const [volumeOpen, setVolumeOpen] = useState(false)
  const { className } = props

  const createVolume = (pos: IPosition) => {
    if (!g.world) return
    volumeInstance = g.world.spawn(Volume)
    volumeInstance.position = pos
    volumeInstance.radius = 300
    volumeInstance.addIntersectActor(g.world.getPlayer(BaseAvatar))
    volumeInstance.registerOnOverlapBegin(() => {
      Toast.show('进入Volumn')
    })
    volumeInstance.registerOnOverlapEnd(() => {
      Toast.show('离开Volume')
    })

    volumeInstance.debug = true
  }

  const destroyVolumn = () => {
    if (volumeInstance) {
      volumeInstance.dispose()
    }
  }

  const toggle = () => {
    if (!volumeOpen) {
      const pos = g.world?.getPlayer(BaseAvatar).position
      if (pos) {
        createVolume(pos)
      }
      setVolumeOpen(true)
    } else {
      destroyVolumn()
      setVolumeOpen(false)
    }
  }

  return (
    <Button className={className} size="mini" onClick={toggle}>
      {volumeOpen ? '销毁Volume' : '创建Volume'}
    </Button>
  )
}
