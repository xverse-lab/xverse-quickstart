import { g } from '../global'
import { ISelectProps, Select } from '../select'
import { avatarTest } from '../test-util/avatar/avatar-test'
import { AvatarBtnIdForAutomatedTest } from '../test-util/avatar/avatar-btns'
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface INavToComponents {}

export interface INavToCProps {
  pointConfigs: ISelectProps<string>['options']
  pointId: string | undefined
  avatarTestInstance: avatarTest
  className?: string
}
export function NavToComponents(props: INavToCProps) {
  if (!g.world) return null

  const { pointConfigs, pointId, avatarTestInstance, className } = props

  return (
    <Select
      className={className}
      options={pointConfigs}
      defaultValue={pointId || pointConfigs[0]?.label}
      title="导航到呼吸点(navTo)"
      onConfirm={avatarTestInstance.navToBreath}
    ></Select>
  )
}
