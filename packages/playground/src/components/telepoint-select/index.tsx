import { g } from '../global'
import { ISelectProps, Select } from '../select'
import { avatarTest } from '../test-util/avatar/avatar-test'
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITeleToComponents {}

export interface ITeleToProps {
  pointConfigs: ISelectProps<string>['options']
  pointId: string | undefined
  avatarTestInstance: avatarTest
  className?: string
}

export function TeleToComponents(props: ITeleToProps) {
  if (!g.world) return null

  const { pointConfigs, pointId, avatarTestInstance, className } = props

  return (
    <Select
      className={className}
      options={pointConfigs}
      defaultValue={pointId || pointConfigs[0]?.label}
      title="传送至呼吸点(teleTo)"
      onConfirm={avatarTestInstance.teleInRoom}
    ></Select>
  )
}
