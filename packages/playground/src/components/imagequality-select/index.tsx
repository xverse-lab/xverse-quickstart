import { Avatar, Button, Picker } from 'antd-mobile'
import { IPictureQualityLevel } from '@xverse/core'
import { useState } from 'react'
import { g } from '../global'
import { ISelectProps, Select } from '../select'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ImageQualitySelect {}

export function ImageQualitySelect(props: ImageQualitySelect) {
  if (!g.world) return null

  const options: ISelectProps<string>['options'] = [
    { label: 'high', value: 'high' },
    { label: 'average', value: 'average' },
    { label: 'low', value: 'low' },
  ]

  return (
    <Select
      options={options}
      title="画质选择"
      defaultValue={options[0].value}
      onConfirm={(value) => {
        g.world?.setPictureQualityLevel(value as IPictureQualityLevel)
      }}
    ></Select>
  )
}
