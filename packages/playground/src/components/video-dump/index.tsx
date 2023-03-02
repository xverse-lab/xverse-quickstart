import { Button, Toast } from 'antd-mobile'
import { useRef, useState } from 'react'
import { g } from '../global'

let mediaRecorder: MediaRecorder
let chunks: Blob[] = []
let stopTimer: number
let timer: number
export interface IRecordingVideoProps {
  className?: string
}
export function RecordingVideo(props: IRecordingVideoProps) {
  if (!g.world) return null
  const [isRecording, setRecording] = useState(false)
  const [time, setTime] = useState(0)
  const { className } = props

  const stopRecording = () => {
    mediaRecorder.stop()
  }

  const startRecoding = (video: HTMLVideoElement) => {
    // 开启录制
    if (!mediaRecorder) {
      mediaRecorder = new MediaRecorder(video.srcObject as MediaStream)
      mediaRecorder.addEventListener('dataavailable', (event) => {
        console.log('dataAva', event.data)
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      })
      mediaRecorder.addEventListener('stop', () => {
        Toast.show('Recording Stopped')
        window.clearInterval(timer)
        window.clearTimeout(stopTimer)
        setTime(0)
        setRecording(false)

        const blob = new Blob(chunks, { type: 'video/webm' })
        console.log('chunks=', chunks)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = 'dump'
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
          chunks = []
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
        }, 100)
      })
    }
    mediaRecorder.start(10)

    timer = window.setInterval(() => {
      setTime((val) => val + 1)
    }, 1000)

    stopTimer = window.setTimeout(() => {
      mediaRecorder.stop()
    }, 60 * 1000)
  }

  const toggle = () => {
    const video = document.getElementById('xv-stream') as HTMLVideoElement
    if (!video || !video.srcObject) return
    if (!isRecording) {
      startRecoding(video)
      Toast.show('请配合摇杆或滑屏使用')
    } else {
      stopRecording()
    }
    setRecording(!isRecording)
  }

  return (
    <Button className={className} size="mini" onClick={toggle}>
      {isRecording ? '暂停录制' + `(${time}s)` : '录制'}
    </Button>
  )
}
