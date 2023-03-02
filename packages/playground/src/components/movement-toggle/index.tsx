import { Button } from 'antd-mobile'
import { useState } from 'react'
import { g } from '../global'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAnimationSelect {
  className?: string
}

export function MoveModeToggle(props: IAnimationSelect) {
  if (!g.world) return null
  const [mode, setMode] = useState(g.world?.movementTriggerMode || 'joystick')
  const { className } = props

  const toggle = () => {
    if (mode === 'joystick') {
      g.world!.movementTriggerMode = 'autoNavigation'
      g.world!.joystick.hide()
    } else {
      g.world!.movementTriggerMode = 'joystick'
      g.world!.joystick.show()
    }

    setMode(g.world!.movementTriggerMode)
  }

  return (
    <Button className={className} size="mini" onClick={toggle}>
      模式：{mode === 'joystick' ? '摇杆' : '点击行进'}
    </Button>
  )
}
