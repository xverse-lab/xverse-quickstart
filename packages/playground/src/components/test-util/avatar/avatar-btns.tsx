import {
  Broadcast,
  ConfigTools,
  EBillboardMode,
  EDefaultMeshType,
  EMediaSourceType,
  IConductorDestUpdate,
  ILodSettings,
  IPosition,
  IRotation,
  IScaling,
  NpcManager,
  RichSurface,
  World,
} from '@xverse/core'
import { Button, Grid, Input, Modal, Toast } from 'antd-mobile'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimationSelect } from '../../animation-select'
import { CollapseBtn } from '../../collapse-btn'
import { ComponentsPanel } from '../../components-panel'
import { EffectSelect } from '../../effect-select'
import { EffectPanel } from '../../effect-panel'
import { LookAtComponents } from '../../lookatpoint-select'
import { MoveModeToggle } from '../../movement-toggle'
import { NavToComponents } from '../../navtopoint-select'
import { PlayerToggle } from '../../player-toggle'
import { ISelectProps, Select } from '../../select'
import { TeleToComponents } from '../../telepoint-select'
import { avatarTest } from './avatar-test'
import { BaseAvatar } from '../../../game-play/avatar'
import { BreathPoint } from '../../../game-play/rich-surface/breath-point'
import { sleep } from '../../../utils/index'
import configJson from '../../../assets/talkingFace.json'
import { AIAvatarId } from '../../../app'

export interface IAvatarBts {
  worldInstance: World
  userId: string | undefined
  pointConfigs: ISelectProps<string>['options']
  pointId: string | undefined
  avatarId: string | undefined
  backMainPage: boolean
  hideBtnList: (open: boolean) => void
}

export enum AvatarBtnIdForAutomatedTest {
  avatarClone = 'avatarClone',
  emitListener = 'emitListener',
  zoomIn = 'zoomIn',
  zoomOut = 'zoomOut',
  modeSwitch = 'modeSwitch',
  teleTo = 'teleTo',
  navTo = 'navTo',
  lookAt = 'lookAt',
  pointPreview = 'pointPreview',
  keepMoving = 'keepMoving',
  shortMoving = 'shortMoving',
  specialEffect = 'specialEffect',
  hideSelf = 'hideSelf',
  hideOthers = 'hideOthers',
  hideOthersData = 'hideOthersData',
  changeDress = 'changeDress',
  Animation = 'Animation',
  usePendant = 'usePendant',
  createNpc = 'createNpc',
  startNpcConduct = 'startNpcConduct',
  cancelNpcConduct = 'cancelNpcConduct',
  destroyNpcConductor = 'destroyNpcConductor',
  startFlowConductor = 'startFlowConductor',
  effectPanel = 'effectPanel',
}

export function AvatarBtns(props: IAvatarBts) {
  const { worldInstance, userId, pointConfigs, pointId, avatarId, backMainPage, hideBtnList } = props
  const [isAutoMoving, setAutoMoving] = useState(false)
  const [isShowingOthers, setshowingOthers] = useState(false)

  const [isBlockOthers, setBlockOthers] = useState(false)
  const [preview, setPreview] = useState(false)
  const [newPreview, setNewPreview] = useState(false)
  const [newPointList, setNewPointList] = useState<RichSurface[]>([])
  const [scale, setScale] = useState(0)
  const avatarTestInstance = useMemo(() => avatarTest.getInstance(worldInstance), [worldInstance])
  const [allPendants, setAllPendants] = useState<ISelectProps<string>['options']>([])
  const [usedPendants, setUsedPendants] = useState<ISelectProps<string>['options']>([])
  const [pointList, setPointList] = useState<BreathPoint[]>([])
  const [allPendantsVisibility, setAllPendantsVisibility] = useState(true)
  const [showConfirmNickname, setShowConfirmNickname] = useState(false)
  const [showAISayText, setShowAISayText] = useState(false)
  const [listenKeyboard, setListenKeyboard] = useState(false)

  const [isChangeBg, setIsChangeBg] = useState(false)
  const [tempAvatarPose, setTempAvatarPose] = useState<{ position: IPosition; rotation: IRotation } | undefined>(
    undefined,
  )
  const [tempCameraPose, setTempCameraPose] = useState<{ position: IPosition; rotation: IRotation } | undefined>(
    undefined,
  )
  const [tempAvatarScale, setTempAvatarScale] = useState<IScaling | undefined>(undefined)
  const lodRef = useRef(null)
  const nickNameRef = useRef(null)
  const npcManagerRef = useRef<NpcManager | null>(null)
  const aiSayRef = useRef(null)
  const aiAvatarRef = useRef<any>()

  const BackgroundImg = 'https://static.xverse.cn/components/face-diy-img/dress-up-background.jpg'

  useEffect(() => {
    updatePendants()
    npcManagerRef.current = new NpcManager(worldInstance)
  }, [worldInstance])

  useEffect(() => {
    if (!backMainPage) {
      return
    }
    backToMainPage()
  }, [backMainPage])

  const startFlowConductor = () => {
    if (Broadcast.handlers['conductorDestUpdate']) return
    new Broadcast(worldInstance, 'conductorDestUpdate', async (data: IConductorDestUpdate) => {
      const { angle, position } = data.avatarPos
      await sleep(2000)
      worldInstance.getJoystick().hide()
      worldInstance.getCamera().disableRotation()
      worldInstance.movementTriggerMode = 'autoNavigation'
      worldInstance.getPlayer().navigateTo(position, {
        endCallback: (isArrived) => {
          if (isArrived) {
            worldInstance.getCamera().pose = {
              position,
              rotation: angle,
            }
            worldInstance.getJoystick().show()
            worldInstance.getCamera().enableRotation()
            worldInstance.movementTriggerMode = 'joystick'
          }
        },
      })
    })
  }

  const changeLod = (lod: Pick<ILodSettings, 'quota' | 'maxRange'>[]) => {
    if (!Array.isArray(lod)) throw new Error('请输入JSON格式的Range数组')
    console.log(lod)
    worldInstance.setLod(lod as any)
    console.log('同屏人数设置成功')
  }
  const onChangeLod = (e: any) => {
    if (e.key !== 'Enter') return
    const inputElem: any = lodRef.current
    if (!inputElem) return
    const value: string = inputElem.nativeElement.value.trim()
    if (!value) return Promise.reject('value is empty')
    try {
      const input: ILodSettings[] = JSON.parse(value)
      changeLod(input)
    } catch (e) {
      console.log('请输入JSON格式的Range数组')
      console.log('E.g.[{"maxRange":1000,"quota":5},{"maxRange":2000,"quota":5},{"maxRange":3000,"quota":5}]')
    }
    inputElem.blur()
    inputElem.clear()
    return Promise.resolve('value is empty')
  }

  const changeNickName = (e: any) => {
    e.stopPropagation()
    if (e.type === 'keydown' && e.key !== 'Enter') {
      setTimeout(() => {
        setShowConfirmNickname(e.target.value.trim().length > 0)
      }, 0)
      return
    }
    const inputElem: any = nickNameRef.current
    const value: string = inputElem.nativeElement.value.trim()
    if (!value) return Promise.reject('value is empty')
    const avatar = worldInstance.getPlayer(BaseAvatar)
    avatar.setNickName(value)
    inputElem.blur()
    inputElem.clear()
    setShowConfirmNickname(false)
    return Promise.resolve('value is empty')
  }

  const addAINpc = async () => {
    aiAvatarRef.current = await avatarTestInstance.addAINpc(AIAvatarId)
    if (!aiAvatarRef.current) {
      console.error('cant find assistanceUserId')
      return
    }

    aiAvatarRef.current.setScaling({ x: 2.0, y: 2.0, z: 2.0 })
    aiAvatarRef.current.position = {
      x: worldInstance.getPlayer(BaseAvatar).position.x + 40,
      y: worldInstance.getPlayer(BaseAvatar).position.y + 40,
      z: worldInstance.getPlayer(BaseAvatar).position.z,
    }

    aiAvatarRef.current.rotation = {
      pitch: 0,
      roll: 0,
      yaw: worldInstance.getCamera().rotation.yaw + 180,
    }
    aiAvatarRef.current.initAISay({ configJson: JSON.stringify(configJson) })
  }

  const changeAiSayText = (e: any) => {
    e.stopPropagation()
    if (e.type === 'keydown' && e.key !== 'Enter') {
      setTimeout(() => {
        setShowAISayText(e.target.value.trim().length > 0)
      }, 0)
      return
    }
    const inputElem: any = aiSayRef.current
    const value: string = inputElem.nativeElement.value.trim()
    if (!value) return Promise.reject('value is empty')
    const avatar = aiAvatarRef.current
    avatar.aiSay(value)
    inputElem.blur()
    inputElem.clear()
    setShowAISayText(false)
    return Promise.resolve('value is empty')
  }

  const updatePendants = () => {
    const avatar = worldInstance._configs.avatarList.find((item: any) => item.id === avatarId)
    const obj = avatar?.componentList.find((item: any) => item.type == 'PENDANT')
    if (!obj) return

    const allPendants = obj.unitList.map((item: any, index: number) => {
      return {
        label: item.name,
        value: item.id,
      }
    })
    setAllPendants(allPendants)
    updateUsedPendants()
  }

  const setPendantVisibility = (path: string) => {
    if (path === '无') return
    Modal.show({
      content: '显示/隐藏挂件' + path,
      closeOnAction: true,
      actions: [
        {
          key: '显示',
          text: '显示',
          primary: true,
          onClick: () => {
            worldInstance.getPlayer().setPendantVisibility(path, true)
          },
        },
        {
          key: '隐藏',
          text: '隐藏',
          onClick: () => {
            worldInstance.getPlayer().setPendantVisibility(path, false)
          },
        },
      ],
    })
  }

  const updateUsedPendants = () => {
    const usedPendants = worldInstance
      .getPlayer()
      .getCurrentPendents()
      .map((item: string, index: number) => {
        return {
          label: item,
          value: item,
        }
      })
    setUsedPendants(usedPendants)
  }

  const setAllPendantVisibility = () => {
    worldInstance.getPlayer().allPendantsVisibility = !allPendantsVisibility
    setAllPendantsVisibility(!allPendantsVisibility)
  }

  const previewPoint = () => {
    if (preview && pointList) {
      pointList.forEach((item) => {
        item.dispose()
      })
      setPreview(false)
      setPointList([])
      return
    }

    setPreview(true)

    const list: BreathPoint[] = []
    pointConfigs.forEach((pointItem) => {
      const currentPreviewPoint = worldInstance.spawn(BreathPoint)
      currentPreviewPoint.init(
        pointItem.value,
        'https://console-appasset-1258211750.file.myqcloud.com/1/image/293c7e744f1b46e9a96982af445bf0bd/Edit2.png',
        worldInstance,
      )
      list.push(currentPreviewPoint)
    })
    setPointList(list)
  }

  const newPreviewPoint = () => {
    if (newPreview && newPointList) {
      newPointList.forEach((item) => {
        item.dispose()
      })
      setNewPreview(false)
      setNewPointList([])
      return
    }

    setNewPreview(true)

    const list: RichSurface[] = []
    pointConfigs.forEach((pointItem) => {
      const currentPreviewPoint = worldInstance.spawn(RichSurface)
      const point = ConfigTools.GetPoint(worldInstance.getCurrentRoom()!, pointItem.value)
      const fps = 15
      const lifeTime = 1
      const spriteWidthNumber = 1
      const spriteHeightNumber = 1
      currentPreviewPoint.create({
        type: EMediaSourceType.XSpriteImgSource,
        mediaData:
          'https://console-appasset-1258211750.file.myqcloud.com/1/image/293c7e744f1b46e9a96982af445bf0bd/Edit2.png',
        addMeshOption: {
          defaultMeshOption: {
            type: EDefaultMeshType.Plane,
            position: point?.point.position,
            rotation: point?.point.rotation,
            width: 2 * 100,
            height: 2 * 100,
          },
        },
        mediaOptions: {
          fps: fps,
          lifeTime: lifeTime,
          spriteWidthNumber: spriteWidthNumber,
          spriteHeightNumber: spriteHeightNumber,
        },
        billboardMode: EBillboardMode.All,
      })
      setTimeout(() => {
        currentPreviewPoint.change(
          'https://console-appasset-1258211750.file.myqcloud.com/1/image/1f284e5883c945c292a596e7d0542677/pasue-1.png',
        )
      }, 3000)
      list.push(currentPreviewPoint)
    })
    setNewPointList(list)
  }

  const setPendant = (path: string) => {
    worldInstance.getPlayer().addPendant(path)
    const has = usedPendants.find((item) => item.value === path)
    const label = allPendants.find((item) => item.value === path)
    if (has) return
    usedPendants.push({
      label: label?.label || path,
      value: path,
    })
    setUsedPendants([...usedPendants])
  }

  const removePendant = (path: string) => {
    worldInstance.getPlayer().removePendant(path)

    const removePendantsIdx = usedPendants.findIndex((ele) => {
      return ele.value === path
    })
    if (removePendantsIdx === -1) {
      console.error('did not find pendants in List')
      return
    }
    usedPendants.splice(removePendantsIdx, 1)
    setUsedPendants([...usedPendants])
  }
  const handleListenKeyboard = () => {
    const keyboard = worldInstance.getKeyboard()
    if (listenKeyboard === false) {
      keyboard.on('keydown', () => {
        Toast.show('keydown')
      })
      keyboard.on('keyup', () => {
        Toast.show('keyup')
      })
      keyboard.on('move', () => {
        Toast.show('move')
      })
    } else {
      keyboard.off('keydown')
      keyboard.off('keyup')
      keyboard.off('move')
    }
    setListenKeyboard(!listenKeyboard)
  }

  const changeBackground = async () => {
    if (isChangeBg) {
      return
    }
    const avatar = worldInstance.getPlayer(BaseAvatar)

    setIsChangeBg(true)
    setTempAvatarPose({
      position: avatar.position,
      rotation: avatar.rotation,
    })
    setTempAvatarScale(avatar.scaling)
    setTempCameraPose({
      position: worldInstance.getCamera().position,
      rotation: worldInstance.getCamera().rotation,
    })
    await worldInstance.setBackgroundImage(BackgroundImg)

    avatar.position = { x: -400, y: 103, z: 10000 }
    avatar.rotation = { yaw: 160, pitch: 0, roll: 0 }
    avatar.setScaling({ x: 1, y: 1, z: 1 })
    //将相机旋转重置
    worldInstance.getCamera().pose = {
      position: { x: -505, y: 140, z: 10110 },
      rotation: { pitch: 0, yaw: 0, roll: 0 },
    }
    // 隐藏摇杆
    worldInstance.getJoystick().hide()
    // 增加返回按钮
    worldInstance.getCamera().disableRotation()
    hideBtnList(true)
  }

  const backToMainPage = () => {
    if (!backMainPage && !isChangeBg) {
      return
    }
    const avatar = worldInstance.getPlayer(BaseAvatar)
    avatar.position = tempAvatarPose ? tempAvatarPose.position : avatar.position
    avatar.rotation = tempAvatarPose ? tempAvatarPose.rotation : avatar.rotation
    worldInstance.getCamera().pose = tempCameraPose ? tempCameraPose : worldInstance.getCamera().pose
    if (tempAvatarScale) {
      avatar.setScaling(tempAvatarScale)
    }

    worldInstance.setBackgroundImage(false)
    // 隐藏摇杆
    worldInstance.getJoystick().show()

    // 增加返回按钮
    worldInstance.getCamera().enableRotation()
    setIsChangeBg(false)
    hideBtnList(false)
  }

  return (
    <>
      <div className="block-title">
        <strong>Avatar相关</strong>
      </div>
      <Grid columns={1} gap={3}>
        <Button
          className={AvatarBtnIdForAutomatedTest.avatarClone}
          size="mini"
          style={{ zIndex: 500 }}
          onClick={() => {
            if (!userId) Toast.show('cant find userID')
            avatarTestInstance.clonedAvatar(userId!)
          }}
        >
          克隆Avatar
        </Button>
        <Button
          className={AvatarBtnIdForAutomatedTest.emitListener}
          size="mini"
          onClick={() => {
            handleListenKeyboard()
          }}
        >
          {listenKeyboard ? '取消监听' : '监听'}键盘emit事件
        </Button>
        <Button
          className={AvatarBtnIdForAutomatedTest.zoomIn}
          size="mini"
          style={{ zIndex: 500 }}
          onClick={() => {
            const { x, y, z } = worldInstance.getPlayer().scaling
            const times = {
              x: x + 0.2,
              y: y + 0.2,
              z: z + 0.2,
            }
            avatarTestInstance.enlargeAvatar(times)
            setScale(scale + 0.2)
          }}
        >
          放大Avatar
        </Button>
        <Button
          className={AvatarBtnIdForAutomatedTest.zoomOut}
          size="mini"
          style={{ zIndex: 500 }}
          onClick={() => {
            const { x, y, z } = worldInstance.getPlayer().scaling
            const times = {
              x: x - 0.2,
              y: y - 0.2,
              z: z - 0.2,
            }
            avatarTestInstance.shrinkAvatar(times)
            if (scale <= 0) return
            setScale(scale - 0.2)
          }}
        >
          缩小Avatar
        </Button>
        <MoveModeToggle className={AvatarBtnIdForAutomatedTest.modeSwitch}></MoveModeToggle>
        <TeleToComponents
          className={AvatarBtnIdForAutomatedTest.teleTo}
          pointConfigs={pointConfigs}
          pointId={pointId}
          avatarTestInstance={avatarTestInstance}
        ></TeleToComponents>

        <NavToComponents
          className={AvatarBtnIdForAutomatedTest.navTo}
          pointConfigs={pointConfigs}
          pointId={pointId}
          avatarTestInstance={avatarTestInstance}
        ></NavToComponents>
        <LookAtComponents
          className={AvatarBtnIdForAutomatedTest.lookAt}
          pointConfigs={pointConfigs}
          pointId={pointId}
          avatarTestInstance={avatarTestInstance}
        ></LookAtComponents>
        {!newPreview && (
          <Button className={AvatarBtnIdForAutomatedTest.pointPreview} size="mini" onClick={previewPoint}>
            {preview ? '取消预览' : '预览所有呼吸点'}
          </Button>
        )}
        {!preview && (
          <Button className={AvatarBtnIdForAutomatedTest.pointPreview} size="mini" onClick={newPreviewPoint}>
            {newPreview ? '取消预览(新)' : '预览所有呼吸点(3s后替换资源)'}
          </Button>
        )}
        <Button
          className={AvatarBtnIdForAutomatedTest.keepMoving}
          size="mini"
          style={{ zIndex: 500 }}
          onClick={() => {
            setAutoMoving(!isAutoMoving)
            worldInstance.debug.autoMoveLoop()
          }}
        >
          {isAutoMoving ? '关闭' : '开启'}持续走动
        </Button>
        <CollapseBtn className={AvatarBtnIdForAutomatedTest.shortMoving} worldInstance={worldInstance} />
        <EffectSelect className={AvatarBtnIdForAutomatedTest.specialEffect}></EffectSelect>
        <EffectPanel className={AvatarBtnIdForAutomatedTest.effectPanel}></EffectPanel>
        <ComponentsPanel className={AvatarBtnIdForAutomatedTest.changeDress}></ComponentsPanel>
        <Button size="mini" onClick={changeBackground}>
          切换背景
        </Button>
        <PlayerToggle className={AvatarBtnIdForAutomatedTest.hideSelf}></PlayerToggle>
        <Button
          className={AvatarBtnIdForAutomatedTest.hideOthers}
          size="mini"
          onClick={() => {
            avatarTestInstance.toggleOthers(isShowingOthers)
            setshowingOthers(!isShowingOthers)
          }}
        >
          {isShowingOthers ? '显示' : '隐藏'}其他玩家
        </Button>
        <Button
          className={AvatarBtnIdForAutomatedTest.hideOthersData}
          size="mini"
          onClick={() => {
            avatarTestInstance.toggleBlockOther()
            setBlockOthers(!isBlockOthers)
          }}
        >
          {isBlockOthers ? '接收' : '屏蔽'}其他玩家信息
        </Button>
        {/* <Button
          className={AvatarBtnIdForAutomatedTest.createNpc}
          size="mini"
          style={{ zIndex: 500 }}
          onClick={() => {
            npcManagerRef.current?.create()
          }}
        >
          创建Npc
        </Button>
        <Button
          className={AvatarBtnIdForAutomatedTest.startNpcConduct}
          size="mini"
          style={{ zIndex: 500 }}
          onClick={() => {
            Modal.show({
              content: '开启npc导航',
              closeOnAction: true,
              actions: [
                {
                  key: '自动跟随',
                  text: '自动跟随',
                  primary: true,
                  onClick: () => {
                    startFlowConductor()
                    npcManagerRef.current?.startConduct(npcManagerRef.current.npcInfos[0].userId)
                  },
                },
                {
                  key: '不跟随',
                  text: '不跟随',
                  onClick: () => {
                    npcManagerRef.current?.startConduct(npcManagerRef.current.npcInfos[0].userId)
                  },
                },
              ],
            })
          }}
        >
          Npc导航
        </Button>
        <Button
          className={AvatarBtnIdForAutomatedTest.cancelNpcConduct}
          size="mini"
          style={{ zIndex: 500 }}
          onClick={() => {
            npcManagerRef.current?.stopConduct(npcManagerRef.current.npcInfos[0].userId)
          }}
        >
          Npc取消
        </Button>
        <Button
          className={AvatarBtnIdForAutomatedTest.destroyNpcConductor}
          size="mini"
          style={{ zIndex: 500 }}
          onClick={() => {
            npcManagerRef.current?.destroy(npcManagerRef.current.npcInfos[0].userId)
          }}
        >
          Npc卸载
        </Button> */}
        <AnimationSelect className={AvatarBtnIdForAutomatedTest.Animation}></AnimationSelect>
        <Select
          className={AvatarBtnIdForAutomatedTest.usePendant}
          options={allPendants.length ? allPendants : [{ label: '无可用挂件', value: '无可用挂件' }]}
          defaultValue={allPendants[0]?.label || '无可用挂件'}
          title="使用挂件"
          onConfirm={setPendant}
          disabled={allPendants.length > 0 ? false : true}
        ></Select>

        <Select
          options={usedPendants.length ? usedPendants : [{ label: '无', value: '无' }]}
          defaultValue={usedPendants[0]?.label || '无'}
          title="移除挂件"
          onConfirm={removePendant}
          disabled={usedPendants.length > 0 ? false : true}
        ></Select>

        <Button size="mini" onClick={setAllPendantVisibility} disabled={usedPendants.length > 0 ? false : true}>
          {allPendantsVisibility ? '隐藏所有挂件' : '显示所有挂件'}
        </Button>

        <Select
          options={usedPendants.length ? usedPendants : [{ label: '无', value: '无' }]}
          defaultValue={usedPendants[0]?.label || '无'}
          title="显示/隐藏单个挂件"
          onConfirm={setPendantVisibility}
          disabled={usedPendants.length > 0 ? false : true}
        ></Select>
        {/* {allPendants.length > 0 && <></>} */}
        <Grid.Item span={1}>
          <Input
            enterKeyHint="enter"
            ref={lodRef}
            onKeyDown={onChangeLod}
            placeholder="同屏人数,输入JSON格式Range数组"
            className="input"
            id="lod-input"
          ></Input>
        </Grid.Item>
        <Grid.Item span={1}>
          <Input
            enterKeyHint="enter"
            ref={nickNameRef}
            onKeyDown={changeNickName}
            placeholder="请输入昵称修改昵称"
            className="input"
            id="name-input"
          ></Input>
        </Grid.Item>
        <Button size="mini" onClick={changeNickName} disabled={!showConfirmNickname}>
          确认修改
        </Button>

        <Button size="mini" onClick={addAINpc} disabled={aiAvatarRef.current ? true : false}>
          {'添加智能语音能力'}
        </Button>
        <Grid.Item span={1}>
          <Input
            enterKeyHint="enter"
            ref={aiSayRef}
            onKeyDown={changeAiSayText}
            placeholder={aiAvatarRef.current ? '请输入你要说的智能语音内容' : '请点击上方按钮初始化语音能力'}
            className="input"
            id="name-input"
          ></Input>
        </Grid.Item>
        <Button size="mini" onClick={changeAiSayText} disabled={!showAISayText || !aiAvatarRef.current}>
          智能语音
        </Button>
      </Grid>
    </>
  )
}
