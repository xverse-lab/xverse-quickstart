import { g } from '../global'
import { ISelectProps, Select } from '../select'
import { avatarId } from '../../app'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAnimationSelect {
  className?: string
}

export function AnimationSelect(props: IAnimationSelect) {
  if (!g.world) return null
  const player = g.world.getPlayer()
  const { className } = props

  // TODO: 临时处理
  // todo: 指定avatar
  const avatarConfig = g.world._configs.avatarList.filter((item: { id: string }) => item.id === avatarId)
  if (!avatarConfig || !avatarConfig[0]) return null
  const animations = avatarConfig[0].componentList.find((item: any) => item.type === 'ANIMATION').unitList
  const animations_new = animations.filter((item: any) => item.name !== 'VAT')
  const options: ISelectProps<string>['options'] = animations_new.map((item: any) => {
    return {
      label: item.name,
      value: item.id,
    }
  })

  return (
    <Select
      className={className}
      options={options}
      title="动作"
      defaultValue={options[0]?.value}
      onConfirm={(value) => {
        player.playAnimation(value, true)
      }}
    ></Select>
  )
}
