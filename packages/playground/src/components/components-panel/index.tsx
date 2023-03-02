// import { ChangeComponentsMode, IAvatarAsset, IAvatarComponentData, Person } from '@xverse/core'
import { IAvatarComponent, EAvatarComponentType } from '@xverse/core'
import { Button, Picker } from 'antd-mobile'
import { useEffect, useRef, useState } from 'react'
import { setFingerprint, avatarId } from '../../app'
import { g } from '../global'
import './style.less'

const deepClone = (v: any) => JSON.parse(JSON.stringify(v))
export interface IComponentsPanel {
  className?: string
}
export function ComponentsPanel(props: IComponentsPanel) {
  if (!g.world) return null
  const world = g.world
  const [visible, setVisible] = useState(false)
  const [clothesList, setClothesList] = useState<any[]>([])
  const originComponents = useRef<IAvatarComponent[]>([])
  const originSyncFlag = useRef<boolean>(false)
  const [previewingComponents, setPreviewingComponents] = useState<IAvatarComponent[]>([])

  const { className } = props
  // TODO: 换装面板
  useEffect(() => {
    if (visible) {
      loadClothes()
      // room.userAvatar?.startChangeComponentsMode()
    } else {
      // room.userAvatar?.exitChangeComponentsMode()
    }
  }, [visible])
  const loadClothes = async () => {
    const config = await world.configManager.getConfig()
    const avatarConfig = config.config.avatarList.filter((item: { id: string }) => item.id === avatarId)
    if (!avatarConfig || !avatarConfig[0]) return
    const clothesList = avatarConfig[0].componentList.filter(
      (item: { type: string }) =>
        // TODO: 枚举
        item.type != 'ANIMATION' && item.type != 'SKELETON' && item.type != 'BODY' && item.type != 'PENDANT',
    )
    setClothesList(clothesList || [])
    originComponents.current = deepClone(world.getPlayer().getCurrentComponents()) as any[]
    setPreviewingComponents(deepClone(world.getPlayer().getCurrentComponents()) || [])
    originSyncFlag.current = world.getPlayer().syncFlag
    world.getPlayer().syncFlag = false
  }

  const changeDress = (type: EAvatarComponentType, path: string) => {
    world
      .getPlayer()
      .changeComponents({ type, path })
      .then(() => {
        //补充缺少的衣服
        afterChangeDressHook()
      })
  }

  /**
   * 换装完需要补充缺省的衣服或裤子
   * @returns
   */
  const afterChangeDressHook = () => {
    const current_components = deepClone(world.getPlayer().getCurrentComponents()) || []
    const suit = current_components.find((item: IAvatarComponent) => item.type === EAvatarComponentType.Suit)
    if (!suit) {
      const clothe = current_components.find((item: IAvatarComponent) => item.type === EAvatarComponentType.Clothes)
      const pant = current_components.find((item: IAvatarComponent) => item.type === EAvatarComponentType.Pants)
      if (clothe && !pant) {
        //补充裤子
        const pants = clothesList.find((item) => {
          return item.type === EAvatarComponentType.Pants
        })?.unitList
        if (!(pants && pants.length)) return
        const defaultPant = pants.find((item: { isDefault: boolean }) => {
          return item.isDefault
        })
        const component = {
          type: EAvatarComponentType.Pants,
          path: defaultPant ? defaultPant.id : pants[0].id,
        }
        current_components.push(component)
        world.getPlayer().changeComponents(component)
      }
      if (!clothe && pant) {
        //补充衣服
        const clothes = clothesList.find((item) => {
          return item.type === EAvatarComponentType.Clothes
        })?.unitList
        if (!(clothes && clothes.length)) return
        const defaultClothe = clothes.find((item: { isDefault: boolean }) => {
          return item.isDefault
        })

        const component = {
          type: EAvatarComponentType.Clothes,
          path: defaultClothe ? defaultClothe.id : clothes[0].id,
        }
        current_components.push(component)
        world.getPlayer().changeComponents(component)
      }
    }

    setPreviewingComponents(current_components)
  }

  const changeAvatarComponentsConfirm = () => {
    world.getPlayer().syncFlag = true
    world
      .getPlayer()
      .changeComponents(previewingComponents)
      .then(() => {
        world.getPlayer().syncFlag = originSyncFlag.current
        localStorage.setItem(setFingerprint(), JSON.stringify(previewingComponents))
      })

    setVisible(false)
  }

  const changeAvatarComponentsCancle = () => {
    world
      .getPlayer()
      .changeComponents(originComponents.current)
      .then(() => {
        world.getPlayer().syncFlag = originSyncFlag.current
      })
    setVisible(false)
  }

  const isComponentActive = (type: EAvatarComponentType, id: string) => {
    return !!previewingComponents.find(
      (avatarComponent) => avatarComponent.type === type && avatarComponent.path === id,
    )
  }

  return (
    <div>
      <Button className={className} onClick={() => setVisible(true)} style={{ width: '100%' }} size="mini">
        打开换装面板
      </Button>

      {visible && (
        <div className="dress_list">
          <div className="dress_list-swiper">
            {clothesList.map((item) => (
              <div className="dress_list-item" key={item.type}>
                <span>{item.type}</span>
                {item.unitList.map((unit: any) => (
                  <div
                    key={unit.id}
                    className={isComponentActive(item.type, unit.id) ? 'active' : ''}
                    onClick={() => {
                      changeDress(item.type, unit.id)
                    }}
                  >
                    {unit.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <Button size="mini" style={{ marginBottom: '10px' }} onClick={changeAvatarComponentsConfirm}>
            确认切换
          </Button>
          <Button size="mini" onClick={changeAvatarComponentsCancle}>
            取消切换
          </Button>
        </div>
      )}
    </div>
  )
}
