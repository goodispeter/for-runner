import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

// 啟用 duration 插件
dayjs.extend(duration)

export interface PaceTime {
  minutes: number
  seconds: number
}

export function usePaceCalculator() {
  // 將配速時間轉換為秒數
  const paceToSeconds = (pace: PaceTime): number => {
    return pace.minutes * 60 + pace.seconds
  }

  // 將秒數轉換為配速時間
  const secondsToPace = (seconds: number): PaceTime => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return { minutes, seconds: remainingSeconds }
  }

  // 將時間字串 (HH:MM:SS 或 MM:SS) 轉換為秒數
  const timeStringToSeconds = (timeString: string): number => {
    // 使用 dayjs 解析時間字串
    let time: dayjs.Dayjs

    if (timeString.includes(':')) {
      const parts = timeString.split(':')
      if (parts.length === 3) {
        // HH:MM:SS 格式
        time = dayjs(`1970-01-01 ${timeString}`)
      } else if (parts.length === 2) {
        // MM:SS 格式，假設為 00:MM:SS
        time = dayjs(`1970-01-01 00:${timeString}`)
      } else {
        return 0
      }
    } else {
      return 0
    }

    return time.diff(dayjs('1970-01-01 00:00:00'), 'seconds')
  }

  // 將秒數轉換為時間字串
  const secondsToTimeString = (seconds: number): string => {
    const duration = dayjs.duration(seconds, 'seconds')
    const hours = Math.floor(duration.asHours())
    const minutes = duration.minutes()
    const secs = duration.seconds()

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
  }

  // 根據距離和目標時間計算配速
  const calculatePaceFromTime = (distance: number, targetTimeSeconds: number): PaceTime => {
    const paceSeconds = targetTimeSeconds / distance
    return secondsToPace(paceSeconds)
  }

  // 根據距離和配速計算完賽時間
  const calculateTimeFromPace = (distance: number, pace: PaceTime): number => {
    const paceSeconds = paceToSeconds(pace)
    return paceSeconds * distance
  }

  // 計算操場單圈距離 (第 n 道，每道增加 6m)
  const calculateTrackDistance = (lane: number): number => {
    return 400 + (lane - 1) * 6
  }

  // 根據操場圈數秒數計算配速
  const calculatePaceFromLapTime = (lane: number, lapTimeSeconds: number): PaceTime => {
    const trackDistance = calculateTrackDistance(lane)
    const distanceInKm = trackDistance / 1000
    const paceSeconds = lapTimeSeconds / distanceInKm
    return secondsToPace(paceSeconds)
  }

  // 根據配速計算操場單圈時間
  const calculateLapTimeFromPace = (lane: number, pace: PaceTime): number => {
    const trackDistance = calculateTrackDistance(lane)
    const distanceInKm = trackDistance / 1000
    const paceSeconds = paceToSeconds(pace)
    return paceSeconds * distanceInKm
  }

  // 將總秒數格式化為時分秒物件
  const formatTime = (
    totalSeconds: number,
  ): { hours: number; minutes: number; seconds: number } => {
    const duration = dayjs.duration(totalSeconds, 'seconds')
    const hours = Math.floor(duration.asHours())
    const minutes = duration.minutes()
    const seconds = duration.seconds()
    return { hours, minutes, seconds }
  }

  return {
    paceToSeconds,
    secondsToPace,
    timeStringToSeconds,
    secondsToTimeString,
    calculatePaceFromTime,
    calculateTimeFromPace,
    calculateTrackDistance,
    calculatePaceFromLapTime,
    calculateLapTimeFromPace,
    formatTime,
  }
}
