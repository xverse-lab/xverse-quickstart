import { Button, Grid, Input } from 'antd-mobile'
import { useMemo, useRef, useState } from 'react'
import { MiniVideo } from '../../mini-video'
import { RecordingVideo } from '../../video-dump'
import { otherTest } from './other-test'
import { BaseAvatar } from '../../../game-play/avatar'
import { World } from '@xverse/core'
import { TestVolume } from '../../volume'
import { XSceneManager, XverseEngine, EngineDebugMode } from '../../../../../core/src/gameplay/exports'

const urlParam = new window.URLSearchParams(location.search)
const voiceGroupId = urlParam.get('groupId') || 'groupId1111'

export interface IOtherBtns {
  worldInstance: World
  isInGroup: boolean
  setIsInGroup: React.Dispatch<React.SetStateAction<boolean>>
}

export enum OtherBtnIdForAutomatedTest {
  mvBtn = 'mvBtn',
  Snapshot = 'Snapshot',
  showPicture = 'showPicture',
  showVideo = 'showVideo',
  showNavMesh = 'showNavMesh',
  ToggleShading = 'ToggleShading',
  createVolume = 'createVolume',
  Record = 'Record',
  speakerJoinsGroup = 'speakerJoinsGroup',
  listenersJoinGroup = 'listenersJoinGroup',
}

export function OtherBtns(props: IOtherBtns) {
  const { worldInstance, isInGroup, setIsInGroup } = props
  const otherTestInstance = useMemo(() => otherTest.getInstance(worldInstance), [worldInstance])
  const [isShowNav, setIsShowNav] = useState(false)
  const chatRef = useRef(null)

  const sendChart = (e: any) => {
    if (e.key !== 'Enter') return
    const inputElem: any = chatRef.current
    if (!inputElem) return
    const value: string = inputElem.nativeElement.value.trim()
    if (!value) return Promise.reject('value is empty')
    const avatar = worldInstance.getPlayer(BaseAvatar)
    avatar.say(value)
    inputElem.blur()
    inputElem.clear()
    return Promise.resolve('value is empty')
  }

  const showNavMesh = () => {
    XverseEngine.Instance.setDebugMode(EngineDebugMode.EnableDebugTools)

    if (isShowNav) {
      XSceneManager.Instance.playerController.navMeshHidden()
    } else {
      XSceneManager.Instance.playerController.navMeshShow()
    }
    setIsShowNav(!isShowNav)
  }

  return (
    <>
      <div className="function-list-block">
        <div className="block-title">其他</div>
        <Grid columns={1} gap={3}>
          <Button
            className={OtherBtnIdForAutomatedTest.mvBtn}
            size="mini"
            onClick={() => worldInstance.debug.toggleMV()}
          >
            开启/关闭MV
          </Button>

          <Button
            className={OtherBtnIdForAutomatedTest.Snapshot}
            size="mini"
            style={{ zIndex: 1000 }}
            onClick={() => otherTestInstance.handleTakePhoto()}
          >
            拍照
          </Button>

          <Button
            className={OtherBtnIdForAutomatedTest.showPicture}
            size="mini"
            style={{ zIndex: 1000 }}
            onClick={() => otherTestInstance.showRichsurface()}
          >
            展示头顶图片或按钮
          </Button>

          <MiniVideo className={OtherBtnIdForAutomatedTest.showVideo}></MiniVideo>

          <Button
            className={OtherBtnIdForAutomatedTest.showNavMesh}
            size="mini"
            style={{ zIndex: 1000 }}
            onClick={showNavMesh}
          >
            {isShowNav ? '隐藏' : '显示'} navMesh
          </Button>

          <Button
            className={OtherBtnIdForAutomatedTest.ToggleShading}
            size="mini"
            onClick={() => worldInstance.debug.toggleSceneshading()}
          >
            切换着色
          </Button>

          <TestVolume className={OtherBtnIdForAutomatedTest.createVolume}></TestVolume>

          <RecordingVideo className={OtherBtnIdForAutomatedTest.Record}></RecordingVideo>
          <Button
            className={OtherBtnIdForAutomatedTest.speakerJoinsGroup}
            disabled={isInGroup}
            size="mini"
            onClick={() => {
              otherTestInstance.handlePubSubGroup(voiceGroupId)
              setIsInGroup(true)
            }}
          >
            演讲者加入群组
          </Button>
          <Button
            className={OtherBtnIdForAutomatedTest.listenersJoinGroup}
            disabled={isInGroup}
            size="mini"
            onClick={() => {
              otherTestInstance.handleSubGroup(voiceGroupId)
              setIsInGroup(true)
            }}
          >
            听众加入群组
          </Button>
          <Button
            disabled={!isInGroup}
            size="mini"
            onClick={() => {
              otherTestInstance.handleQuitGroup()
              setIsInGroup(false)
            }}
          >
            退出群组
          </Button>

          <Grid.Item span={1}>
            <Input
              enterKeyHint="enter"
              ref={chatRef}
              onKeyDown={sendChart}
              placeholder="输入聊天内容"
              className="input"
              id="chart-input"
            ></Input>
          </Grid.Item>
        </Grid>
      </div>
    </>
  )
}
