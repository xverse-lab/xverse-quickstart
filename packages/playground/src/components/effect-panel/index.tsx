// import { ChangeComponentsMode, IAvatarAsset, IAvatarComponentData, Person } from '@xverse/core'
import {
  SubSequence,
  ConfigTools,
  IPosition,
  IAssetConfig,
  RichSurface,
  EMediaSourceType,
  EDefaultMeshType,
  EBillboardMode,
} from '@xverse/core'
import { Button, TreeSelect, TreeSelectOption } from 'antd-mobile'
import { TV } from '../../game-play/rich-surface/tv'
import { Image } from '../../game-play/rich-surface/image'
import { useCallback, useEffect, useState } from 'react'
import { g } from '../global'
import './style.less'

export interface IEffectPanel {
  className?: string
}

const enum ActorType {
  IMAGE = 'IMAGE',
  EFFECTS = 'EFFECTS',
  TV = 'TV',
  DECAL = 'DECAL',
}

const titleMap = new Map([
  [ActorType.IMAGE, '呼吸点-点击场景渲染'],
  [ActorType.EFFECTS, '特效-点击场景渲染'],
  [ActorType.TV, 'TV'],
  [ActorType.DECAL, '贴图'],
])

const DEFAULT_TV_URL =
  'https://console-appasset-1258211750.file.myqcloud.com/1/media/018bc85ef6c044ffaa317b7777b613ab/dianxin.mp4'

const DEFAULT_DECAL_URL =
  'https://console-appasset-1258211750.file.myqcloud.com/1/image/b1604d9c9f6f439b9b2c3a73a41fbc17/1102DZborn_view01.jpg'

export function EffectPanel(props: IEffectPanel) {
  if (!g.world) return null
  const world = g.world

  const [visible, setVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>({})
  const [actor, setActor] = useState<any>()

  const [treeData, setTreeData] = useState<TreeSelectOption[]>([])

  const { className } = props

  useEffect(() => {
    if (visible) {
      loadSources()
    }
  }, [visible])

  const clickEvent = useCallback(
    (pos: IPosition) => {
      if (selectedItem.type === ActorType.IMAGE) {
        textureToggle(pos, selectedItem.url)
        return
      }
      if (selectedItem.type === ActorType.EFFECTS) {
        effectToggle(pos, selectedItem.id)
      }
    },
    [selectedItem, actor],
  )

  useEffect(() => {
    world.getClickingEvent()?.off('click', clickEvent)

    if (visible && selectedItem && (selectedItem.type === ActorType.EFFECTS || selectedItem.type === ActorType.IMAGE)) {
      world.getClickingEvent().on('click', clickEvent)
    }
  }, [visible, selectedItem, actor])

  const loadSources = async () => {
    const _moduleList = world?.getCurrentRoom()?.currentSkinConfig?.moduleList

    const tempList =
      _moduleList
        ?.map((item) => {
          const a = item.assetList.map((item2) => {
            return {
              label: item2.id,
              value: item2.id,
            }
          })
          return {
            label: titleMap.get(item.name as unknown as ActorType),
            value: item.name,
            children: a,
          } as TreeSelectOption
        })
        .filter((x) => [...titleMap.keys()].includes(x.value)) || []
    setTreeData(tempList)
  }

  const handleClosePanel = () => {
    world.getClickingEvent().off('click', clickEvent)
    disposeActor()
    setVisible(false)
  }

  const onSelectChange = (value: string[]) => {
    const selectedAsset = ConfigTools.GetAssetByBom(world.getCurrentRoom()!, value[1])
    disposeActor()
    setSelectedItem(selectedAsset)
    if (value.length === 1) {
      return
    }
    switch (value[0]) {
      case 'TV':
        tvToggle(selectedAsset)
        break
      case 'DECAL':
        decalToggle(selectedAsset)
        break
      default:
        break
    }
  }

  const effectToggle = async (pos: IPosition, val: string) => {
    if (!g?.world) return
    const player = g.world.getPlayer()

    const effectPos = pos
    effectPos.z += player.height ? player.height / 2 : 80
    if (actor) {
      actor.position = effectPos
      actor.play(true)
      return
    }

    const effectInstance = g.world.spawn(SubSequence)
    const assetInfo = ConfigTools.GetAssetByBom(world.getCurrentRoom()!, val || selectedItem)
    effectInstance.id = selectedItem

    if (assetInfo?.url) {
      await effectInstance.init(assetInfo?.url)
    }
    effectInstance.position = effectPos
    effectInstance.rotation = {
      pitch: 0,
      yaw: player.rotation.yaw - 180,
      roll: 0,
    }
    effectInstance.play(true)
    setActor(effectInstance)
  }

  const textureToggle = (pos: IPosition, val: string) => {
    if (actor) {
      actor.position = pos
    } else {
      if (!g.world) {
        return
      }
      const breathPoint = g.world?.spawn(RichSurface)

      const fps = 15
      const lifeTime = 1
      const spriteWidthNumber = 1
      const spriteHeightNumber = 1
      breathPoint.create({
        type: EMediaSourceType.XSpriteImgSource,
        mediaData: val,
        addMeshOption: {
          defaultMeshOption: {
            type: EDefaultMeshType.Plane,
            position: pos,
            rotation: { pitch: 0, yaw: 0, roll: 0 },
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
      setActor(breathPoint)
    }
  }

  const tvToggle = async (val: IAssetConfig | undefined) => {
    if (!val) {
      return
    }
    const tvInstance = world.spawn(TV)
    await tvInstance.init(val.id, DEFAULT_TV_URL)
    setActor(tvInstance)
  }

  const decalToggle = async (val: IAssetConfig | undefined) => {
    if (!val) {
      return
    }

    const imageInstance = world.spawn(RichSurface)

    const asset = ConfigTools.GetAssetByBom(world.getCurrentRoom()!, val.id)

    await imageInstance.create({
      type: EMediaSourceType.XStaticTextureSource,
      mediaData: DEFAULT_DECAL_URL,
      addMeshOption: {
        url: asset?.url,
      },
    })

    setActor(imageInstance)
  }

  function disposeActor() {
    actor && actor.dispose()
    setActor(null)
  }

  const renderTree = () => {
    return (
      <div>
        <TreeSelect defaultValue={[ActorType.EFFECTS]} options={treeData} onChange={onSelectChange} />
      </div>
    )
  }
  return (
    <div>
      <Button className={className} onClick={() => setVisible(true)} style={{ width: '100%' }} size="mini">
        资源预览面板
      </Button>
      {visible && (
        <div className="effect_list">
          <div className="effect_title"> 预览资源选择 </div>
          <div className="effect_list-swiper">{renderTree()}</div>
          <Button
            size="mini"
            style={{
              position: 'absolute',
              bottom: '10px',
              width: '80%',
              left: '50%',
              transform: 'translate(-50%)',
            }}
            onClick={handleClosePanel}
          >
            关闭面板
          </Button>
        </div>
      )}
    </div>
  )
}
