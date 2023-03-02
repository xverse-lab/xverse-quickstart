import { Avatar, Button, Picker } from 'antd-mobile'
import { useState } from 'react'
import { g } from '../global'
import { ISelectProps, Select } from '../select'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ImageQualitySelect {}

export function ScreenFillModeComponent(props: any) {
  if (!g.world) return null

  const options: ISelectProps<string>['options'] = [
    { label: 'cover-保宽', value: 'cover' },
    { label: 'contain-保高', value: 'contain' },
  ]

  return (
    <Select
      options={options}
      title="填充模式"
      defaultValue={options[0].value}
      onConfirm={(value) => {
        g.world?.setObjectFit(value as any)
      }}
    ></Select>
  )
}
