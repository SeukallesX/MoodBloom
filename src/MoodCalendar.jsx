import { useState } from 'react'
import { MOODS, localDateKey, entriesForDay } from './moodUtils'

export default function MoodCalendar({ entries }) {
  const [viewDate, setViewDate] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const todayKey = localDateKey(new Date())
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthLabel = viewDate.toLocaleDateString('en-US', {
    month: 'long', year: 'numeric'
  })

  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1)
  ]
  const selectedEntries = selectedDate ? entriesForDay(entries, selectedDate) : []

  function changeMonth(amount) {
    setViewDate(new Date(year, month + amount, 1))
    setSelectedDate(null)
  }

  return (
    <section className="glass-card calendar-card holo-calendar">
      <div className="section-heading">
        <div>
          <span className="section-kicker">✦ YOUR DAYS IN COLOR</span>
          <h3>My Mood Calendar 🌷</h3>
          <p>Explore your daily mood journey. Select a date to see its memories.</p>
        </div>
        <div className="calendar-navigation">
          <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">‹</button>
          <strong>{monthLabel}</strong>
          <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">›</button>
        </div>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div className="weekday" key={day}>{day}</div>
        ))}

        {cells.map((day, index) => {
          if (!day) return <div className="calendar-empty" key={`empty-${index}`} />

          const date = new Date(year, month, day)
          const key = localDateKey(date)
          const dayEntries = entriesForDay(entries, key)
          const latestEntry = dayEntries[0]
          const mood = MOODS.find((item) => item.label === latestEntry?.mood)
          const isSelected = selectedDate === key
          const isToday = key === todayKey

          return (
            <button
              type="button"
              key={key}
              className={[
                'calendar-day',
                isSelected ? 'active' : '',
                isToday ? 'is-today' : '',
                mood ? 'has-mood' : ''
              ].filter(Boolean).join(' ')}
              style={mood ? { '--day-mood': mood.color } : undefined}
              onClick={() => setSelectedDate((previous) => previous === key ? null : key)}
              aria-pressed={isSelected}
              aria-label={`${key}, ${dayEntries.length} ${dayEntries.length === 1 ? 'entry' : 'entries'}${isToday ? ', today' : ''}`}
            >
              <span className="calendar-date-number">{day}</span>
              {mood && <span className="calendar-emoji" aria-hidden="true">{mood.emoji}</span>}
              {dayEntries.length > 1 && <small>+{dayEntries.length - 1}</small>}
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <div className="selected-day" aria-live="polite">
          <h4>
            {new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric'
            })}
          </h4>
          {selectedEntries.length === 0 ? (
            <p>No mood entries for this day.</p>
          ) : (
            selectedEntries.map((entry) => {
              const mood = MOODS.find((item) => item.label === entry.mood)
              return (
                <article className="calendar-entry" key={entry.id}>
                  <strong>{mood?.emoji} {entry.mood}</strong>
                  {entry.journal && <p>{entry.journal}</p>}
                </article>
              )
            })
          )}
        </div>
      )}
    </section>
  )
}
