
export const MOODS = [
  { emoji: '😄', label: 'Amazing', score: 5, color: '#f4a5cb' },
  { emoji: '🙂', label: 'Good', score: 4, color: '#a8d9bc' },
  { emoji: '😐', label: 'Okay', score: 3, color: '#c7b5f4' },
  { emoji: '😔', label: 'Low', score: 2, color: '#a8d1f5' },
  { emoji: '😣', label: 'Stressed', score: 1, color: '#f5aaa8' }
]

export function localDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function entryDateKey(entry) {
  // New entries use ISO timestamps.
  if (entry.createdAt) {
    const date = new Date(entry.createdAt)
    if (!Number.isNaN(date.getTime())) {
      return localDateKey(date)
    }
  }

  // Older entries used locale-formatted date strings.
  // Interpret the original format in the browser's locale.
  if (entry.date) {
    const date = new Date(entry.date)
    if (!Number.isNaN(date.getTime())) {
      return localDateKey(date)
    }
  }

  return null
}

export function entriesForDay(entries, key) {
  return entries.filter(
    (entry) => entryDateKey(entry) === key
  )
}

export function getWeekDays() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))
    return date
  })
}

export function getWeeklyStats(entries) {
  const days = getWeekDays()

  const chart = days.map((date) => {
    const dayEntries = entriesForDay(
      entries,
      localDateKey(date)
    )

    return {
      key: localDateKey(date),
      label: date.toLocaleDateString('en-US', {
        weekday: 'short'
      }),
      count: dayEntries.length
    }
  })

  const weeklyEntries = entries.filter((entry) =>
    chart.some((day) => day.key === entryDateKey(entry))
  )

  const distribution = MOODS.map((mood) => ({
    ...mood,
    count: weeklyEntries.filter(
      (entry) => entry.mood === mood.label
    ).length
  }))

  const total = weeklyEntries.length

  const mostCommon = distribution.reduce(
    (best, item) =>
      item.count > best.count ? item : best,
    distribution[0]
  )

  return {
    chart,
    distribution,
    total,
    activeDays: chart.filter((day) => day.count > 0).length,
    mostCommon: total > 0 ? mostCommon : null
  }
}


export function calculateStreak(entries) {
  const dates = new Set(
    entries.map(entryDateKey).filter(Boolean)
  )

  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  // A streak can remain active if the user checked in yesterday.
  if (!dates.has(localDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0

  while (dates.has(localDateKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}
