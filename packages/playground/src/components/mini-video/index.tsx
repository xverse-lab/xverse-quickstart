import { Button } from 'antd-mobile'
import { useState } from 'react'
import { g } from '../global'

export interface IMiniVideoProps {
  className?: string
}
export function MiniVideo(props: IMiniVideoProps) {
  if (!g.world) return null
  const [hidden, setHidden] = useState(true)
  const { className } = props

  const toggle = () => {
    g.world?.debug.toggleStreamVideoShow()
    setHidden(!hidden)
  }

  return (
    <Button className={className} size="mini" onClick={toggle}>
      {hidden ? '显示' : '隐藏'} Video
    </Button>
  )
}
