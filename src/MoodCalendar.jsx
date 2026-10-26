
import { useState } from 'react'
import {
  MOODS,
  localDateKey,
  entriesForDay
} from './moodUtils'

export default function MoodCalendar({ entries }) {
  const [viewDate, setViewDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(
    localDateKey(new Date())
  )

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const monthLabel = viewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => index + 1
    )
  ]

  const selectedEntries = entriesForDay(
    entries,
    selectedDate
  )

  function changeMonth(amount) {
    const next = new Date(year, month + amount, 1)
    setViewDate(next)
    setSelectedDate(localDateKey(next))
  }

  return (
    <section className="glass-card calendar-card">
      <div className="section-heading">
        <div>
          <h3>My Mood Calendar 🌷</h3>
          <p>Explore your daily mood journey.</p>
        </div>

        <div className="calendar-navigation">
          <button
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
          >
            ‹
          </button>

          <strong>{monthLabel}</strong>

          <button
            onClick={() => changeMonth(1)}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          .map((day) => (
            <div className="weekday" key={day}>
              {day}
            </div>
          ))}

        {cells.map((day, index) => {
          if (!day) {
            return (
              <div
                className="calendar-empty"
                key={`empty-${index}`}
              />
            )
          }

          const date = new Date(year, month, day)
          const key = localDateKey(date)
          const dayEntries = entriesForDay(entries, key)
          const latestEntry = dayEntries[0]

          const mood = MOODS.find(
            (item) => item.label === latestEntry?.mood
          )

          return (
            <button
              key={key}
              className={
                selectedDate === key
                  ? 'calendar-day active'
                  : 'calendar-day'
              }
              onClick={() => setSelectedDate(key)}
              aria-pressed={selectedDate === key}
              aria-label={`${key}, ${dayEntries.length} entries`}
            >
              <span>{day}</span>
              {mood && (
                <span className="calendar-emoji">
                  {mood.emoji}
                </span>
              )}
              {dayEntries.length > 1 && (
                <small>+{dayEntries.length - 1}</small>
              )}
            </button>
          )
        })}
      </div>

      <div className="selected-day">
        <h4>
          {new Date(`${selectedDate}T12:00:00`)
            .toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
        </h4>

        {selectedEntries.length === 0 ? (
          <p>No mood entries for this day.</p>
        ) : (
          selectedEntries.map((entry) => {
            const mood = MOODS.find(
              (item) => item.label === entry.mood
            )

            return (
              <article className="calendar-entry" key={entry.id}>
                <strong>
                  {mood?.emoji} {entry.mood}
                </strong>
                {entry.journal && <p>{entry.journal}</p>}
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}
