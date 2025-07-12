import { ref, computed } from 'vue'

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
    const parts = timeString.split(':').map(Number)
    if (parts.length === 3) {
      // HH:MM:SS
      return parts[0] * 3600 + parts[1] * 60 + parts[2]
    } else if (parts.length === 2) {
      // MM:SS
      return parts[0] * 60 + parts[1]
    }
    return 0
  }

  // 將秒數轉換為時間字串
  const secondsToTimeString = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

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
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = Math.floor(totalSeconds % 60)
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
