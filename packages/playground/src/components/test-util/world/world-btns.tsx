import { Button, Space, Input, Toast, Grid, Popover } from 'antd-mobile'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ImageQualitySelect } from '../../imagequality-select'
import { ScreenFillModeComponent } from '../../screenfillmode-component'
import { ISelectProps, Select } from '../../select'
import { Room, World } from '@xverse/core'
import { worldTest } from './world-test'
const TechnologyExhibitionAppId = '11016'
const SandRoom = '10172'

export let visRuleId = ''
const VisibilityRuleRoom = '11022'

export enum WorldBtnIdForAutomatedTest {
  firstPerson = 'firstPerson',
  reEnterWorld = 'reEnterWorld',
  switchRoom = 'switchRoom',
  switchSkin = 'switchSkin',
  switchPath = 'switchPath',
  explicitRule = 'explicitRule',
  pictureQuality = 'pictureQuality',
  localTexture = 'localTexture',
  panoramaLimitation = 'panoramaLimitation',
}

export function WorldBtns(props: {
  appId: string
  releaseId: string
  avatarId: string
  viewMode: string
  from_console: boolean | undefined
  worldInstance: World
  skinId: string | undefined
  pathId: string | undefined
  roomId: string | undefined
  roomsConfigs: ISelectProps<string>['options']
  skinConfigs: ISelectProps<string>['options']
  viewModesConfig: ISelectProps<string>['options']
  pathConfigs: ISelectProps<string>['options']
  updateSkinConfigs: () => void
  setViewMode: React.Dispatch<React.SetStateAction<string>>
  panoramaActived: boolean
}) {
  const {
    appId,
    releaseId,
    avatarId,
    roomsConfigs,
    roomId,
    skinConfigs,
    viewModesConfig,
    pathConfigs,
    skinId,
    pathId,
    viewMode,
    updateSkinConfigs,
    worldInstance,
    setViewMode,
    from_console,
    panoramaActived,
  } = props
  const intensityRef = useRef(null)
  const RotationLimitRef = useRef(null)
  const [rotationLimit, setRotationLimit] = useState({
    maxPitchDiff: 360,
    maxYawDiff: 360,
  })
  const visibilityRuleRef = useRef(null)
  const [panoramaLimitationToggle, setPanoramaLimitationToggle] = useState(false)
  const worldTestInstance = useMemo(() => {
    return worldTest.getInstance(worldInstance)
  }, [worldInstance])
  const [localTexture, setLocalTexture] = useState(true)
  const changeRoom = async (roomId: string) => {
    if (viewMode === 'serverless') {
      Toast.show({
        content: '请先退出无网模式',
      })
      return
    }

    const RoomClass = Room
    const targetRoom = worldInstance.getRoomInstance(roomId, RoomClass)
    if (!targetRoom) return
    try {
      const defaultSKin = targetRoom.getRoomConfig().skinList[0]
      targetRoom.setSkinInfo({
        skinId: defaultSKin.id,
        pathId: defaultSKin.pathList[0].id,
        combinationId: visRuleId,
      })
      await targetRoom.enter()
    } catch (error) {
      console.error(error)
      Toast.show({
        content: String(error),
      })
      return
    }
    localStorage.setItem('viewMode', '')
    console.debug('切换房间成功')
    updateSkinConfigs()
  }
  const changePath = async (pathId: string) => {
    //TODO: 观察者模式需要传一张图片
    let imgPath = undefined
    const localTexturePath = {
      17: 'https://project-asset.xverse.cn/1/image/a0a70d33124b4111874fdb702ea4df8b/VRZJ-nightview.jpg',
      18: 'https://project-asset.xverse.cn/1/image/e0f0400e41424f59bff48b07bc1f5dec/VRZJ-luhanview.jpg',
    }
    if (pathId === '86e51c6c3f6166b6') {
      imgPath = (localTexturePath as any)[worldInstance.getCurrentRoom()!.roomId]
    }
    await worldInstance.getCurrentRoom()?.setSkinInfo(
      {
        pathId,
        localTextureBomId: imgPath,
        dynamicPathRotateLimit: rotationLimit,
      },
      {
        endCallback: () => {
          console.log('载具路线播放完毕')
          Toast.show('载具路线播放完毕')
        },
      },
    )
    console.debug('切换 Path 成功')
  }
  const changeSkin = async (skinId: string) => {
    await worldTestInstance.changeSkin(skinId)
    updateSkinConfigs()
  }

  const changeViewMode = (val: string) => {
    const skinId = worldInstance.getCurrentRoom()?.skinInfo.skinId
    const roomId = worldInstance.getCurrentRoom()?.roomId
    if (skinId !== '15156' && val === 'serverless') {
      Toast.show('请先切换到出生大厅，其余房间未支持')
      return
    }

    setViewMode(val)
    localStorage.setItem('viewMode', val || '')
    localStorage.setItem('roomId', roomId || ('' as string))
    location.reload()
  }

  const setIntensity = (e: any) => {
    if (e.key !== 'Enter') return
    const inputElem: any = intensityRef.current
    if (!inputElem) return
    const value: string = inputElem.nativeElement.value.trim()
    if (!value) return Promise.reject('value is empty')
    worldInstance.setEnvLightIntensity(parseInt(value))
    inputElem.blur()
    inputElem.clear()
    return Promise.resolve('value is empty')
  }
  const setRotateLimitation = (e: any) => {
    if (e.key !== 'Enter') return
    // const inputElem = document.getElementById('intensity-input') as HTMLInputElement
    const inputElem: any = RotationLimitRef.current
    if (!inputElem) return
    const str: string = inputElem.nativeElement.value.trim()
    if (!str) return Promise.reject('value is empty')
    const [maxPitchDiff, maxYawDiff] = str.split(',')
    const pitchDiff = parseInt(maxPitchDiff)
    const yawDiff = parseInt(maxYawDiff)
    setRotationLimit({
      maxPitchDiff: pitchDiff,
      maxYawDiff: yawDiff,
    })
    inputElem.blur()
    inputElem.clear()
    return Promise.resolve('value is empty')
  }
  const panoramaCameraLimitation = () => {
    if (!panoramaLimitationToggle) {
      worldInstance
        .getCamera()
        .setMainCameraRotationLimit({ yaw: 0, pitch: 0, roll: 0 }, { yaw: 90, pitch: 90, roll: 90 })
    } else {
      worldInstance.getCamera().removeMainCameraRotationLimit()
    }
  }
  const setVisRuleId = (e: any) => {
    if (e.key !== 'Enter') return

    const inputElem: any = visibilityRuleRef.current
    if (!inputElem) return
    const value: string = inputElem.nativeElement.value.trim()
    if (!value) {
      visRuleId = ''
      return Promise.reject('value is empty')
    }
    if (isNaN(parseInt(value))) return Promise.reject('value is NaN')
    visRuleId = value

    inputElem.blur()
    inputElem.clear()
    return Promise.resolve('ok')
  }

  return (
    <>
      {' '}
      <div className="function-list-block">
        <div className="block-title">
          <strong>World/Room相关</strong>
        </div>
        <Grid columns={1} gap={3}>
          {!from_console && (
            <Button
              className={WorldBtnIdForAutomatedTest.firstPerson}
              size="mini"
              onClick={() => worldTestInstance.switchPersonTest(appId, releaseId, avatarId)}
            >
              {appId === TechnologyExhibitionAppId ? '第三人称' : '第一人称'}
            </Button>
          )}

          <Button
            className={WorldBtnIdForAutomatedTest.reEnterWorld}
            size="mini"
            onClick={() => worldTestInstance.reEnterWorld()}
          >
            重进世界
          </Button>

          <Select
            className={WorldBtnIdForAutomatedTest.switchRoom}
            options={roomsConfigs}
            defaultValue={roomId || roomsConfigs[0]?.label}
            title="切换房间"
            onConfirm={changeRoom}
          ></Select>
          {/* <Select
            options={viewModesConfig}
            defaultValue={viewMode}
            title="切换观景模式"
            onConfirm={changeViewMode}
          ></Select> */}
          <Select
            className={WorldBtnIdForAutomatedTest.switchSkin}
            options={skinConfigs}
            defaultValue={skinId || skinConfigs[0]?.label}
            title="切换皮肤"
            onConfirm={changeSkin}
          ></Select>
          <Select
            className={WorldBtnIdForAutomatedTest.switchPath}
            options={pathConfigs}
            defaultValue={pathId || pathConfigs[0]?.label}
            title="切换Path"
            onConfirm={changePath}
          ></Select>

          {panoramaActived && (
            <Button
              className={WorldBtnIdForAutomatedTest.panoramaLimitation}
              size="mini"
              onClick={() => {
                panoramaCameraLimitation()
                setPanoramaLimitationToggle(!panoramaLimitationToggle)
              }}
            >
              {panoramaLimitationToggle ? '取消' : '点击'}限制全景图90度
            </Button>
          )}

          {worldInstance.getCurrentRoom()?.getRoomId() == SandRoom && (
            <Popover
              content="切试驾路线前,输入两个数字可限制转向 格式: pitch, yaw"
              trigger="click"
              placement="right"
              defaultVisible={false}
            >
              <Input
                enterKeyHint="enter"
                onKeyDown={setRotateLimitation}
                ref={RotationLimitRef}
                placeholder="限制试驾转向 eg: 45, 150"
                className="input"
              ></Input>
            </Popover>
          )}

          <Button
            className={WorldBtnIdForAutomatedTest.explicitRule}
            size="mini"
            onClick={() => worldTestInstance.switchAppId(appId, releaseId)}
          >
            显隐规则测试(再次点击退出)
          </Button>
          {appId === VisibilityRuleRoom && (
            <Input
              enterKeyHint="enter"
              onKeyDown={setVisRuleId}
              ref={visibilityRuleRef}
              placeholder="请输入显隐规则id(按Enter触发)"
              className="input"
            ></Input>
          )}
          <ImageQualitySelect></ImageQualitySelect>
          {worldInstance.getCurrentRoom()?.skinInfo.skinId === '15156' && (
            <Button
              className={WorldBtnIdForAutomatedTest.localTexture}
              onClick={() => {
                worldTestInstance.localTexture(localTexture)
                setLocalTexture(!localTexture)
              }}
              size="mini"
            >
              使用本地贴图(再次点击退出)
            </Button>
          )}
          <Grid.Item span={1}>
            {' '}
            <Input
              enterKeyHint="enter"
              onKeyDown={setIntensity}
              ref={intensityRef}
              placeholder="请输入环境光强度(按Enter触发)"
              className="input"
            ></Input>
          </Grid.Item>
        </Grid>
        <Space wrap align="center"></Space>
      </div>
    </>
  )
}
