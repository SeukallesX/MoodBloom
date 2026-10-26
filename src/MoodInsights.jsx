
import { getWeeklyStats } from './moodUtils'

export default function MoodInsights({ entries }) {
  const stats = getWeeklyStats(entries)

  const maxCount = Math.max(
    1,
    ...stats.chart.map((day) => day.count)
  )

  return (
    <section className="glass-card insights-card">
      <div className="section-heading">
        <div>
          <h3>Weekly Mood Insights ✨</h3>
          <p>Your last seven days, including today.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Check-Ins</span>
          <strong>{stats.total}</strong>
        </div>

        <div className="stat-card">
          <span>Days Tracked</span>
          <strong>{stats.activeDays}/7</strong>
        </div>

        <div className="stat-card">
          <span>Most Common Mood</span>
          <strong>
            {stats.mostCommon
              ? `${stats.mostCommon.emoji} ${stats.mostCommon.label}`
              : '—'}
          </strong>
        </div>
      </div>

      <h4>Daily Check-In Activity</h4>

      <div className="weekly-chart">
        {stats.chart.map((day) => (
          <div className="chart-column" key={day.key}>
            <span className="chart-count">{day.count}</span>

            <div className="chart-track">
              <div
                className="chart-bar"
                style={{
                  height: `${(day.count / maxCount) * 100}%`
                }}
              />
            </div>

            <span className="chart-label">{day.label}</span>
          </div>
        ))}
      </div>

      <h4>Mood Distribution</h4>

      <div className="distribution-list">
        {stats.distribution.map((mood) => {
          const percentage = stats.total
            ? (mood.count / stats.total) * 100
            : 0

          return (
            <div className="distribution-row" key={mood.label}>
              <span>{mood.emoji} {mood.label}</span>

              <div className="distribution-track">
                <div
                  className="distribution-fill"
                  style={{
                    width: `${percentage}%`,
                    background: mood.color
                  }}
                />
              </div>

              <strong>{mood.count}</strong>
            </div>
          )
        })}
      </div>
    </section>
  )
}
