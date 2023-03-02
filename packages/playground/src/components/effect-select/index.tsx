import { ConfigTools, SubSequence } from '@xverse/core'
import { useEffect, useState } from 'react'
import { g } from '../global'
import { ISelectProps, Select } from '../select'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IEffectSelect {
  className?: string
}

export function EffectSelect(props: IEffectSelect) {
  if (!g?.world) return null

  const [currentEffect, setCurrentEffect] = useState<any>()
  const { className } = props
  const player = g.world.getPlayer()
  const _moduleList = g.world?.getCurrentRoom()?.currentSkinConfig?.moduleList
  const options: ISelectProps<string>['options'] = []
  const _effectList = (_moduleList || []).find((item) => item.name === 'EFFECTS')

  _effectList?.assetList &&
    _effectList.assetList.forEach((val) => {
      options.push({ label: val.id, value: val.id })
    })
  const toggle = async (val: string) => {
    if (!g?.world) return

    if (currentEffect) {
      currentEffect.dispose()
    }
    const assetInfo = ConfigTools.GetAssetByBom(g.world.getCurrentRoom()!, val)
    if (assetInfo?.url) {
      if (assetInfo?.url.indexOf('Group_') > -1) {
        // const effect = g.world.spawn(Sequence)
        // await effect.init()
        // effPosition && (effect.position = effPosition)
        // effRotation && (effect.rotation = effRotation)
      } else {
        const effect = g.world.spawn(SubSequence)
        const effectPos = player.position
        effectPos.z += player.height ? player.height / 2 : 80
        await effect.init(assetInfo.url)
        effect.position = effectPos
        console.error(effect.position)
        effect.rotation = { pitch: 0, yaw: player.rotation.yaw - 180, roll: 0 }
        effect.play(true)
        setCurrentEffect(effect)
      }
    }
  }
  return (
    <>
      {/* <Button>特效</Button> */}
      <Select
        className={className}
        options={options.length ? options : [{ label: '无', value: '无' }]}
        title="特效"
        defaultValue={options?.[0]?.value}
        onConfirm={(value) => {
          toggle(value)
        }}
      ></Select>
    </>
  )
}
