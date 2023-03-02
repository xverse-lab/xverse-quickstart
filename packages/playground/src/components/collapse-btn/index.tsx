import { World } from '@xverse/core'
import { Button } from 'antd-mobile'
import { useState } from 'react'
import './style.less'
export interface ICollapseProps {
  worldInstance: World
  className?: string
}
export function CollapseBtn(props: ICollapseProps) {
  const [visible, setVisible] = useState(false)
  const { worldInstance, className } = props

  return (
    <div>
      <Button
        className={className}
        onClick={() => setVisible(!visible)}
        style={{ width: '100%', zIndex: 1000 }}
        size="mini"
      >
        运动5秒({visible ? '点击隐藏面板' : '点击选择方向'})
      </Button>

      {visible && (
        <div className="direction_panel">
          <Button style={{ width: '100%' }} size="mini" onClick={() => worldInstance.debug.moveHorizonLeft2Right()}>
            左到右
          </Button>
          <Button style={{ width: '100%' }} size="mini" onClick={() => worldInstance.debug.moveHorizonRight2Left()}>
            右到左
          </Button>
          <Button style={{ width: '100%' }} size="mini" onClick={() => worldInstance.debug.moveVerticalUp2Down()}>
            前到后
          </Button>
          <Button style={{ width: '100%' }} size="mini" onClick={() => worldInstance.debug.moveVerticalDown2Up()}>
            后到前
          </Button>
        </div>
      )}
    </div>
  )
}
