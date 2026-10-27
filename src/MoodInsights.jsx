import { getWeeklyStats } from './moodUtils'

export default function MoodInsights({ entries }) {
  const stats = getWeeklyStats(entries)
  const maxCount = Math.max(1, ...stats.chart.map((day) => day.count))

  return (
    <section className="glass-card insights-card holographic-insights">
      <div className="section-heading">
        <div>
          <span className="section-kicker">✦ YOUR MOOD UNIVERSE</span>
          <h3>Weekly Mood Insights ✨</h3>
          <p>Your last seven days, including today.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card insight-stat insight-stat-pink">
          <span>Total Check-Ins</span>
          <strong>{stats.total}</strong>
          <small>Moments you've recorded</small>
        </div>
        <div className="stat-card insight-stat insight-stat-lavender">
          <span>Days Tracked</span>
          <strong>{stats.activeDays}/7</strong>
          <small>Days with at least one check-in</small>
        </div>
        <div className="stat-card insight-stat insight-stat-mint">
          <span>Most Common Mood</span>
          <strong className="insight-mood-value">
            {stats.mostCommon
              ? `${stats.mostCommon.emoji} ${stats.mostCommon.label}`
              : '—'}
          </strong>
          <small>{stats.mostCommon ? 'Your most frequent feeling' : 'No moods logged yet'}</small>
        </div>
      </div>

      <div className="insight-panel">
        <div className="insight-panel-heading">
          <h4>Daily Check-In Activity</h4>
          <span className="insight-panel-hint">Last 7 days</span>
        </div>
        <div className="weekly-chart insight-weekly-chart" role="img" aria-label={`Daily check-ins over the last seven days: ${stats.chart.map((day) => `${day.label}: ${day.count}`).join(', ')}`}>
          {stats.chart.map((day, index) => (
            <div className="chart-column" key={day.key}>
              <span className="chart-count">{day.count}</span>
              <div className="chart-track">
                <div
                  className={`chart-bar insight-chart-bar insight-bar-${index % 3}`}
                  style={{ height: `${(day.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="chart-label">{day.label}</span>
            </div>
          ))}
        </div>
        {stats.total === 0 && (
          <p className="insight-empty">Your first check-in will bring this chart to life. 🌷</p>
        )}
      </div>

      <div className="insight-panel">
        <div className="insight-panel-heading">
          <h4>Mood Distribution</h4>
          <span className="insight-panel-hint">{stats.total} check-ins</span>
        </div>
        <div className="distribution-list insight-distribution-list">
          {stats.distribution.map((mood) => {
            const percentage = stats.total ? (mood.count / stats.total) * 100 : 0
            return (
              <div className="distribution-row insight-distribution-row" key={mood.label}>
                <span className="insight-distribution-name">{mood.emoji} {mood.label}</span>
                <div
                  className="distribution-track"
                  role="progressbar"
                  aria-label={`${mood.label} share`}
                  aria-valuenow={Math.round(percentage)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="distribution-fill insight-distribution-fill"
                    style={{ width: `${percentage}%`, background: mood.color }}
                  />
                </div>
                <strong className="insight-distribution-count">{mood.count}</strong>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
