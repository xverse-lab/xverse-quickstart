import { Button, Picker, Toast } from 'antd-mobile'
import React, { useEffect, useRef, useState } from 'react'

export interface ISelectProps<T> {
  defaultValue: T
  options: { label: string; value: T }[]
  title: string
  disabled?: boolean
  style?: string
  className?: string
  onConfirm: (value: string) => any
}

export function Select<T>(props: ISelectProps<T>) {
  const { defaultValue, options, onConfirm, title, disabled = false, style = 'width:100%', className } = props
  const [current, setCurrent] = useState<[T]>([defaultValue])
  const [visible, setVisible] = useState(false)
  const ref: any = useRef(null)
  useEffect(() => {
    if (style && ref.current) ref.current.nativeElement.style = style
  })

  if (!options.length) return null

  return (
    <div>
      <Button className={className} size="mini" disabled={disabled} onClick={() => setVisible(true)} ref={ref}>
        {title}
      </Button>
      {visible ? (
        <Picker
          columns={[options as any]}
          visible={visible}
          onClose={() => {
            setVisible(false)
          }}
          value={current as any}
          onConfirm={async (v) => {
            const value = v[0]
            try {
              await onConfirm(value as any)
              setCurrent([value as any])
            } catch (error) {
              Toast.show(String(error))
              console.error(error)
              setCurrent(current)
            }
          }}
        />
      ) : (
        ''
      )}
    </div>
  )
}
