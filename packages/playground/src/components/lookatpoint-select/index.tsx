import { g } from '../global'
import { ISelectProps, Select } from '../select'
import { avatarTest } from '../test-util/avatar/avatar-test'
import { AvatarBtnIdForAutomatedTest } from '../test-util/avatar/avatar-btns'
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILookAtComponents {}
export interface ILookAtProps {
  pointConfigs: ISelectProps<string>['options']
  pointId: string | undefined
  avatarTestInstance: avatarTest
  className?: string
}

export function LookAtComponents(props: ILookAtProps) {
  if (!g.world) return null

  const { pointConfigs, pointId, avatarTestInstance, className } = props

  return (
    <Select
      className={className}
      options={pointConfigs}
      defaultValue={pointId || pointConfigs[0]?.label}
      title="面向呼吸点(lookAt)"
      onConfirm={avatarTestInstance.lookAtBreath}
    ></Select>
  )
}
