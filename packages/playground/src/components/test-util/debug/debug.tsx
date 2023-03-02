import { World } from '@xverse/core'
import { Button, Grid, Input } from 'antd-mobile'
import { useState, useRef } from 'react'

export interface IDebugBtnsProps {
  worldInstance: World
  setIsShowFpsStatus: React.Dispatch<React.SetStateAction<boolean>>
}

export enum DebugBtnIdForAutomatedTest {
  toggleStats = 'toggleStats',
  showClickPosition = 'showClickPosition',
  dropFrameDisplay = 'dropFrameDisplay',
}

export function DebugBtns(props: IDebugBtnsProps) {
  const { worldInstance, setIsShowFpsStatus } = props
  const [isShowClickPoint, setIsShowClickPoint] = useState(false)
  const [isDropShow, setDropShow] = useState(false)
  const [isAutoMoveWithLog, setAutoMoveWithLog] = useState(false)

  const dropFrameRef = useRef(null)
  const sendDropFrame = (e: any) => {
    if (e.key !== 'Enter') return
    const inputElem: any = dropFrameRef.current
    if (!inputElem) return
    const value: string = inputElem.nativeElement.value.trim()
    if (!value) return Promise.reject('value is empty')
    worldInstance.d_dropFrameTarget = parseInt(value)
    inputElem.blur()
    // inputElem.clear()
    return Promise.resolve('value is empty')
  }

  return (
    <>
      {' '}
      <div className="function-list-block">
        <div className="block-title">
          <strong>调试</strong>
        </div>
        <Grid columns={1} gap={3}>
          <Button
            className={DebugBtnIdForAutomatedTest.toggleStats}
            size="mini"
            style={{ zIndex: 1000 }}
            onClick={() => {
              worldInstance.debug.toggleStats()
              setIsShowFpsStatus(!worldInstance.getStats().showStatus)
            }}
          >
            Toggle Stats
          </Button>

          <Button
            className={DebugBtnIdForAutomatedTest.showClickPosition}
            size="mini"
            onClick={() => {
              worldInstance.debug.toggleDebugBreathPoint()
              setIsShowClickPoint(!isShowClickPoint)
            }}
          >
            {isShowClickPoint ? '隐藏' : '显示'}点击位置
          </Button>
          <Grid.Item>
            <Button
              className={DebugBtnIdForAutomatedTest.dropFrameDisplay}
              size="mini"
              style={{ zIndex: 500, width: '100%' }}
              onClick={() => {
                // worldInstance.debug.toggleDropShow()
                worldInstance.d_allowDropFrame = !isDropShow
                setDropShow(!isDropShow)
              }}
            >
              {isDropShow ? '关闭' : '开启'}丢帧
            </Button>
          </Grid.Item>
          <Grid.Item span={1}>
            <Input
              enterKeyHint="enter"
              ref={dropFrameRef}
              onKeyDown={sendDropFrame}
              placeholder="输入每秒连续丢帧数量(PC\安卓有效)"
              className="input"
              id="dropFrame-input"
            ></Input>
          </Grid.Item>
          <Grid.Item>
            <Button
              size="mini"
              style={{ zIndex: 500, width: '100%' }}
              onClick={() => {
                worldInstance.debug.startMoveLoop(!isAutoMoveWithLog)
                setAutoMoveWithLog(!isAutoMoveWithLog)
              }}
            >
              {isAutoMoveWithLog ? '关闭' : '开启'}左右随机走动并打log
            </Button>
          </Grid.Item>
        </Grid>
      </div>
    </>
  )
}
