import { Button } from 'antd-mobile'
import { useState } from 'react'
import { g } from '../global'

export interface IPlayerToggle {
  className?: string
}

export function PlayerToggle(props: IPlayerToggle) {
  if (!g.world) return null
  const player = g.world.getPlayer()
  const [hidden, setHidden] = useState(false)
  const { className } = props

  const toggle = () => {
    if (hidden) {
      player.show()
    } else {
      player.hide()
    }

    setHidden(!hidden)
  }

  return (
    <Button className={className} size="mini" onClick={toggle}>
      {hidden ? '显示' : '隐藏'}自身
    </Button>
  )
}
