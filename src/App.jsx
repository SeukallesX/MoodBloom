
import { useEffect, useRef, useState } from 'react'
import Hologram from './Hologram'
import MoodCalendar from './MoodCalendar'
import MoodInsights from './MoodInsights'
import MoodSettings from './MoodSettings'
import { MOODS, calculateStreak } from './moodUtils'
import { exportMoodJSON, exportMoodCSV } from './moodExport'
import './App.css'

const moodMessages = {
  Amazing: {
    title: 'Your world is glowing today! ✨',
    message: "What's making your day feel so bright?",
    affirmation: 'Let yourself enjoy this moment.'
  },
  Good: {
    title: 'A little sunshine is blooming. 🌷',
    message: "What's been going well for you?",
    affirmation: 'The little things count, too.'
  },
  Okay: {
    title: 'A gentle day is still a meaningful day. 🌿',
    message: "What's on your mind right now?",
    affirmation: 'You can take today as it comes.'
  },
  Low: {
    title: 'Some days need a softer glow. 💙',
    message: 'Would writing a little help you reflect?',
    affirmation: 'Every feeling has room here.'
  },
  Stressed: {
    title: 'Your mind deserves a moment of quiet. 💜',
    message: "What's taking up space in your thoughts?",
    affirmation: 'Share as much or as little as you like.'
  }
}

const welcomeWords = [
  'Every',
  'feeling',
  'deserves',
  'space',
  'to',
  'bloom.'
]

const THEMES = ['blush', 'lavender', 'mint']

function readPreference(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

function readEntries() {
  try {
    const parsed = JSON.parse(
      localStorage.getItem('moodbloom-entries') || '[]'
    )

    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Unable to load mood entries:', error)
    return []
  }
}

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) return 'Good morning, little bloom ☀️'
  if (hour < 17) return 'Good afternoon, little bloom 🌷'
  if (hour < 21) return 'Good evening, little bloom 🌙'

  return 'A quiet moment just for you ✨'
}

function entryTime(entry) {
  const time = new Date(
    entry.createdAt || entry.date || 0
  ).getTime()

  return Number.isFinite(time) ? time : 0
}

function AnimatedWords({ words }) {
  return (
    <span className="animated-words">
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="word-reveal"
          style={{ '--word-index': index }}
        >
          {word}
        </span>
      ))}
    </span>
  )
}

function BloomPetals() {
  return (
    <div className="bloom-petals" aria-hidden="true">
      {Array.from({ length: 12 }, (_, index) => (
        <span
          key={index}
          className="bloom-petal"
          style={{
            '--petal-index': index,
            '--petal-delay': `${-index * 1.3}s`
          }}
        >
          ✿
        </span>
      ))}
    </div>
  )
}

function SaveBloom({ active }) {
  if (!active) return null

  return (
    <div className="save-bloom" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <span
          key={index}
          style={{ '--spark-index': index }}
        >
          ✿
        </span>
      ))}
    </div>
  )
}

export default function App() {
  const [exploring, setExploring] = useState(false)
  const [enteringUniverse, setEnteringUniverse] = useState(false)
  const [activePage, setActivePage] = useState('home')

  const transitionTimer = useRef(null)
  const celebrationTimer = useRef(null)

  const [theme, setTheme] = useState(() => {
    const saved = readPreference('moodbloom-theme', 'blush')
    return THEMES.includes(saved) ? saved : 'blush'
  })

  const [animationsEnabled, setAnimationsEnabled] = useState(
    () => readPreference('moodbloom-animations', 'true') === 'true'
  )

  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
  )

  const [entries, setEntries] = useState(readEntries)
  const [selectedMood, setSelectedMood] = useState('')
  const [journal, setJournal] = useState('')
  const [saveNotice, setSaveNotice] = useState('')
  const [celebrating, setCelebrating] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editMood, setEditMood] = useState('')
  const [editJournal, setEditJournal] = useState('')

  const [searchQuery, setSearchQuery] = useState('')
  const [moodFilter, setMoodFilter] = useState('All')
  const [greeting, setGreeting] = useState(getGreeting)

  useEffect(() => {
    try {
      localStorage.setItem(
        'moodbloom-entries',
        JSON.stringify(entries)
      )
    } catch (error) {
      console.error('Unable to save mood entries:', error)
    }
  }, [entries])

  useEffect(() => {
    try {
      localStorage.setItem('moodbloom-theme', theme)
      localStorage.setItem(
        'moodbloom-animations',
        String(animationsEnabled)
      )
    } catch (error) {
      console.error('Unable to save preferences:', error)
    }
  }, [theme, animationsEnabled])

  useEffect(() => {
    const media = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    )

    const updateMotion = (event) => {
      setReducedMotion(event.matches)
    }

    media.addEventListener('change', updateMotion)

    return () => {
      media.removeEventListener('change', updateMotion)
    }
  }, [])

  useEffect(() => {
    const interval = window.setInterval(
      () => setGreeting(getGreeting()),
      60000
    )

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    return () => {
      window.clearTimeout(transitionTimer.current)
      window.clearTimeout(celebrationTimer.current)
    }
  }, [])

  const shouldAnimate = animationsEnabled && !reducedMotion

  const latestEntry = [...entries].sort(
    (a, b) => entryTime(b) - entryTime(a)
  )[0]

  const latestMood = latestEntry?.mood || ''

  // Only the currently selected mood controls the dashboard
  // hologram. When deselected, it returns to its default colors.
  const previewMood = selectedMood

  const currentMood = MOODS.find(
    (mood) => mood.label === previewMood
  )

  const latestEmoji =
    MOODS.find(
      (mood) => mood.label === latestMood
    )?.emoji || '🌸'

  const message = moodMessages[previewMood]
  const streak = calculateStreak(entries)

  const filteredEntries = entries
    .filter((entry) => {
      const query = searchQuery.trim().toLowerCase()

      const matchesMood =
        moodFilter === 'All' ||
        entry.mood === moodFilter

      const matchesSearch =
        !query ||
        [
          entry.journal,
          entry.mood,
          entry.date
        ].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(query)
        )

      return matchesMood && matchesSearch
    })
    .sort((a, b) => entryTime(b) - entryTime(a))

  function openDashboard() {
    if (enteringUniverse) return

    if (!shouldAnimate) {
      setActivePage('home')
      setExploring(true)
      return
    }

    setEnteringUniverse(true)

    transitionTimer.current = window.setTimeout(() => {
      setActivePage('home')
      setExploring(true)
      setEnteringUniverse(false)
    }, 650)
  }

  function backToHologram() {
    window.clearTimeout(transitionTimer.current)

    setEnteringUniverse(false)
    setActivePage('home')
    setExploring(false)
  }

  function selectMood(label) {
    // Clicking the selected mood again deselects it.
    setSelectedMood((previous) =>
      previous === label ? '' : label
    )

    setSaveNotice('')
  }

  function saveMood() {
    if (!selectedMood) return

    const now = new Date()
    const savedMood = selectedMood

    const entry = {
      id: crypto.randomUUID(),
      mood: savedMood,
      journal: journal.trim(),
      date: now.toLocaleString(),
      createdAt: now.toISOString()
    }

    setEntries((previous) => [
      entry,
      ...previous
    ])

    setSelectedMood('')
    setJournal('')

    setSaveNotice(
      `Your ${savedMood.toLowerCase()} moment is blooming in your journal! 🌸`
    )

    window.clearTimeout(celebrationTimer.current)
    setCelebrating(false)

    if (shouldAnimate) {
      window.requestAnimationFrame(() => {
        setCelebrating(true)
      })

      celebrationTimer.current = window.setTimeout(() => {
        setCelebrating(false)
      }, 1200)
    }
  }

  function startEditing(entry) {
    setEditingId(entry.id)
    setEditMood(entry.mood)
    setEditJournal(entry.journal || '')
  }

  function cancelEditing() {
    setEditingId(null)
    setEditMood('')
    setEditJournal('')
  }

  function saveEdit() {
    if (!editingId || !editMood) return

    setEntries((previous) =>
      previous.map((entry) =>
        entry.id === editingId
          ? {
              ...entry,
              mood: editMood,
              journal: editJournal.trim()
            }
          : entry
      )
    )

    cancelEditing()
  }

  function deleteEntry(id) {
    const confirmed = window.confirm(
      'Delete this mood entry? This cannot be undone.'
    )

    if (!confirmed) return

    setEntries((previous) =>
      previous.filter((entry) => entry.id !== id)
    )

    if (editingId === id) {
      cancelEditing()
    }
  }

  function importEntries(imported) {
    if (!Array.isArray(imported)) return

    setEntries((previous) => {
      const ids = new Set(
        previous.map((entry) => entry.id)
      )

      const additions = []

      for (const entry of imported) {
        if (
          !entry ||
          typeof entry !== 'object' ||
          !MOODS.some(
            (mood) => mood.label === entry.mood
          )
        ) {
          continue
        }

        const id =
          typeof entry.id === 'string' && entry.id
            ? entry.id
            : crypto.randomUUID()

        if (ids.has(id)) continue
        ids.add(id)

        additions.push({
          ...entry,
          id,
          journal:
            typeof entry.journal === 'string'
              ? entry.journal
              : ''
        })
      }

      return [
        ...previous,
        ...additions
      ].sort(
        (a, b) => entryTime(b) - entryTime(a)
      )
    })
  }

  function clearEntries() {
    setEntries([])
    cancelEditing()
    setSaveNotice('')
    setSearchQuery('')
    setMoodFilter('All')
  }

  return (
    <main
      className={`moodbloom theme-${theme} ${
        shouldAnimate ? 'motion-on' : 'motion-off'
      }`}
      style={{
        '--active-mood':
          currentMood?.color || '#f4a5cb'
      }}
    >
      <div
        className="glow glow-pink"
        aria-hidden="true"
      />

      <div
        className="glow glow-purple"
        aria-hidden="true"
      />

      <div className="holo-atmosphere" aria-hidden="true">
        <span className="holo-orb holo-orb-one" />
        <span className="holo-orb holo-orb-two" />
        <span className="holo-orb holo-orb-three" />
      </div>

      {!exploring ? (
        <section
          className={`welcome ${
            enteringUniverse
              ? 'universe-entering'
              : ''
          }`}
        >
          <BloomPetals />

          <span className="eyebrow">
            ✦ A HOLOGRAPHIC SPACE FOR YOU ✦
          </span>

          <div className="title-perspective">
            <h1 className="holographic-title">
              ✿ MoodBloom
            </h1>
          </div>

          <h2 className="welcome-message">
            <AnimatedWords words={welcomeWords} />
          </h2>

          <p className="welcome-subtitle">
            Your little universe of thoughts,
            colors, and feelings.
          </p>

          <p className="bloom-greeting">
            {greeting}
          </p>

          <div className="hologram-container">
            <Hologram
              mood={latestMood}
              animate={shouldAnimate}
            />
          </div>

          <p className="bloom-interaction-hint">
            ✦ Click the flower to watch it glow ✦
          </p>

          {latestMood && (
            <div className="landing-mood-capsule">
              <span className="capsule-glow" />
              <span>{latestEmoji}</span>
              <span>Feeling {latestMood}</span>
              <span>✨</span>
            </div>
          )}

          <button
            className="explore-btn shimmer-button"
            onClick={openDashboard}
            disabled={enteringUniverse}
          >
            {enteringUniverse
              ? 'Your universe is blooming... ✨'
              : 'Step Into Your Universe ✨'}
          </button>
        </section>
      ) : (
        <section className="dashboard">
          <nav
            className="dashboard-nav"
            aria-label="Dashboard navigation"
          >
            <div className="nav-brand">
              <span className="holo-brand-mark" aria-hidden="true">✿</span> MoodBloom
              <span className="holo-brand-spark" aria-hidden="true"> ✧</span>
            </div>

            <div className="nav-links">
              {[
                ['home', '🏠 Home'],
                ['calendar', '📅 Calendar'],
                ['insights', '📊 Weekly Insights'],
                ['settings', '⚙️ Settings']
              ].map(([page, label]) => (
                <button
                  key={page}
                  className={
                    activePage === page
                      ? 'nav-active'
                      : ''
                  }
                  onClick={() => {
                    setActivePage(page)
                  }}
                  aria-current={
                    activePage === page
                      ? 'page'
                      : undefined
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>

          <button
            className="back-btn"
            onClick={backToHologram}
          >
            ← Back to Hologram
          </button>

          {activePage === 'home' && (
            <div className="page-content">
              <header className="dashboard-header">
                <span className="eyebrow">
                  ✿ YOUR LITTLE CORNER OF CALM
                </span>

                <h2 className="animated-heading">
                  How is your heart feeling today? 🌷
                </h2>

                <p>
                  Every feeling deserves a little
                  space to bloom. Whatever today
                  brings, you're welcome here.
                </p>
              </header>

              <div className="summary-grid">
                <div className="summary-card animated-card holo-metric">
                  <span className="metric-spark" aria-hidden="true">✧</span>
                  <span>🌸 Moments Saved</span>
                  <strong>{entries.length}</strong>
                  <small>Pieces of your journey</small>
                </div>

                <div className="summary-card animated-card holo-metric">
                  <span className="metric-spark" aria-hidden="true">✦</span>
                  <span>🔥 Your Bloom Streak</span>

                  <strong>
                    {streak}{' '}
                    {streak === 1 ? 'day' : 'days'}
                  </strong>

                  <small>One day at a time</small>
                </div>

                <div className="summary-card animated-card holo-metric">
                  <span className="metric-spark" aria-hidden="true">✧</span>
                  <span>💗 Latest Feeling</span>

                  <strong>
                    {latestMood || 'A fresh start'}
                  </strong>

                  <small>
                    Your most recent check-in
                  </small>
                </div>
              </div>

              <section className="glass-card checkin-card animated-card holo-panel">
                <div className="section-intro">
                  <span className="section-kicker">
                    ✦ TODAY'S LITTLE MOMENT
                  </span>

                  <h3>
                    Choose today's little bloom 🌸
                  </h3>

                  <p>
                    Choose the feeling that fits
                    this moment. There's no right
                    or wrong way to feel.
                  </p>
                </div>

                <div
                  className="mood-options"
                  role="group"
                  aria-label="Choose today's mood"
                >
                  {MOODS.map((mood) => (
                    <button
                      key={mood.label}
                      type="button"
                      className={`mood-option ${
                        selectedMood === mood.label
                          ? 'selected'
                          : ''
                      }`}
                      style={{
                        '--mood-color': mood.color
                      }}
                      onClick={() =>
                        selectMood(mood.label)
                      }
                      aria-pressed={
                        selectedMood === mood.label
                      }
                    >
                      <span className="mood-emoji">
                        {mood.emoji}
                      </span>

                      <small>{mood.label}</small>
                    </button>
                  ))}
                </div>

                <div
                  className="mood-preview"
                  style={{
                    '--preview-mood':
                      currentMood?.color ||
                      '#f4a5cb'
                  }}
                >
                  <div className="mood-preview-heading">
                  <span className="holo-panel-spark" aria-hidden="true">✧ ✦ ✧</span>
                    <span className="section-kicker">
                      ✦ YOUR EMOTIONAL UNIVERSE
                    </span>

                    <h3>Your Mood Hologram</h3>

                    <p>
                      A little reflection of
                      how you're feeling.
                    </p>
                  </div>

                  <div className="mood-preview-layout">
                    {/* Keep the Canvas mounted so
                        colors transition smoothly. */}
                    <div className="preview-hologram">
                      <Hologram
                        mood={previewMood}
                        animate={shouldAnimate}
                      />
                    </div>

                    <div
                      className="mood-message"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      <div
                        className="mood-message-content"
                        key={previewMood || 'empty'}
                      >
                        <span
                          className="mood-message-icon"
                          aria-hidden="true"
                        >
                          {currentMood?.emoji || '🌸'}
                        </span>

                        <h4>
                          {message?.title ||
                            'Your universe is waiting to bloom. ✨'}
                        </h4>

                        <p>
                          {message?.message ||
                            'Select a mood to bring your hologram to life.'}
                        </p>

                        <small>
                          {message?.affirmation ||
                            'Every moment can be a fresh beginning.'}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="journal-area">
                  <label
                    className="journal-label"
                    htmlFor="journal"
                  >
                    Dear MoodBloom, here's what's
                    on my mind...
                  </label>

                  <p className="journal-helper">
                    You don't need the perfect words.
                    Just start wherever you are.
                  </p>

                  <textarea
                    id="journal"
                    placeholder="Today I felt... because..."
                    value={journal}
                    onChange={(event) => {
                      setJournal(event.target.value)
                    }}
                    rows={4}
                  />

                  <div className="save-action">
                    <button
                      className="save-btn shimmer-button"
                      onClick={saveMood}
                      disabled={!selectedMood}
                    >
                      Save This Little Moment ✨
                    </button>

                    {shouldAnimate && (
                      <SaveBloom active={celebrating} />
                    )}
                  </div>

                  {saveNotice && (
                    <p
                      className={`save-notice ${
                        celebrating
                          ? 'celebrating'
                          : ''
                      }`}
                      role="status"
                    >
                      {saveNotice}
                    </p>
                  )}
                </div>
              </section>

              <section className="glass-card history-card animated-card holo-panel">
                <div className="section-intro">
                  <span className="section-kicker">
                    ✦ YOUR PERSONAL STORY
                  </span>

                  <h3>Your Bloom Journal 📖</h3>

                  <p>
                    A collection of moments,
                    thoughts, and feelings
                    that make your story yours.
                  </p>
                </div>

                <div className="history-toolbar">
                  <input
                    type="search"
                    aria-label="Search mood history"
                    placeholder="🔎 Search your memories..."
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value)
                    }}
                  />

                  <select
                    aria-label="Filter entries by mood"
                    value={moodFilter}
                    onChange={(event) => {
                      setMoodFilter(event.target.value)
                    }}
                  >
                    <option value="All">
                      All Feelings
                    </option>

                    {MOODS.map((mood) => (
                      <option
                        key={mood.label}
                        value={mood.label}
                      >
                        {mood.emoji} {mood.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="history-meta">
                  <span>
                    Showing {filteredEntries.length}
                    {' '}of {entries.length}
                    {' '}saved moments
                  </span>

                  <div className="export-actions">
                    <button
                      onClick={() =>
                        exportMoodJSON(entries)
                      }
                      disabled={!entries.length}
                    >
                      ↓ Export JSON
                    </button>

                    <button
                      onClick={() =>
                        exportMoodCSV(entries)
                      }
                      disabled={!entries.length}
                    >
                      ↓ Export CSV
                    </button>
                  </div>
                </div>

                {!entries.length ? (
                  <p className="empty-state">
                    Your first memory is waiting
                    to bloom. 🌱
                  </p>
                ) : !filteredEntries.length ? (
                  <p className="empty-state">
                    No matching memories yet.
                    Try another search or feeling.
                  </p>
                ) : (
                  <div className="entries">
                    {filteredEntries.map((entry) => {
                      const mood = MOODS.find(
                        (item) =>
                          item.label === entry.mood
                      )

                      return (
                        <article
                          className="entry holo-memory"
                          key={entry.id}
                          style={{ '--entry-mood': mood?.color || '#f4a5cb' }}
                        >
                          {editingId === entry.id ? (
                            <div className="edit-form">
                              <h4>Edit Your Moment</h4>

                              <label
                                htmlFor={`mood-${entry.id}`}
                              >
                                Feeling
                              </label>

                              <select
                                id={`mood-${entry.id}`}
                                value={editMood}
                                onChange={(event) => {
                                  setEditMood(
                                    event.target.value
                                  )
                                }}
                              >
                                {MOODS.map((item) => (
                                  <option
                                    key={item.label}
                                    value={item.label}
                                  >
                                    {item.emoji}
                                    {' '}{item.label}
                                  </option>
                                ))}
                              </select>

                              <label
                                htmlFor={`journal-${entry.id}`}
                              >
                                Your thoughts
                              </label>

                              <textarea
                                id={`journal-${entry.id}`}
                                value={editJournal}
                                onChange={(event) => {
                                  setEditJournal(
                                    event.target.value
                                  )
                                }}
                                rows={3}
                              />

                              <div className="entry-actions">
                                <button onClick={saveEdit}>
                                  💾 Save Changes
                                </button>

                                <button
                                  onClick={cancelEditing}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="entry-heading">
                                <strong>
                                  {mood?.emoji}
                                  {' '}{entry.mood}
                                </strong>

                                <small>{entry.date}</small>
                              </div>

                              {entry.journal && (
                                <p>{entry.journal}</p>
                              )}

                              <div className="entry-actions">
                                <button
                                  onClick={() =>
                                    startEditing(entry)
                                  }
                                >
                                  ✏️ Edit
                                </button>

                                <button
                                  className="delete-btn"
                                  onClick={() =>
                                    deleteEntry(entry.id)
                                  }
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </>
                          )}
                        </article>
                      )
                    })}
                  </div>
                )}
              </section>
            </div>
          )}

          {activePage === 'calendar' && (
            <div className="page-content">
              <header className="page-header">
                <span className="eyebrow">
                  ✦ A GARDEN OF MEMORIES
                </span>

                <h2>
                  Your Garden of Memories 🌷
                </h2>

                <p>
                  Every day holds a story.
                  Revisit your moments,
                  one bloom at a time.
                </p>
              </header>

              <div className="animated-card holo-feature-shell">
                <MoodCalendar entries={entries} />
              </div>
            </div>
          )}

          {activePage === 'insights' && (
            <div className="page-content">
              <header className="page-header">
                <span className="eyebrow">
                  ✦ YOUR EMOTIONAL SEASONS
                </span>

                <h2>
                  Your Emotional Seasons ✨
                </h2>

                <p>
                  Feelings change, and that's
                  part of being human.
                  Here's a gentle look at your week.
                </p>
              </header>

              <div className="animated-card holo-feature-shell">
                <MoodInsights entries={entries} />
              </div>
            </div>
          )}

          {activePage === 'settings' && (
            <div className="page-content">
              <header className="page-header">
                <span className="eyebrow">
                  ✦ YOUR UNIVERSE, YOUR WAY
                </span>

                <h2>
                  Make This Space Yours ⚙️
                </h2>

                <p>
                  Personalize your atmosphere
                  and take care of your
                  saved memories.
                </p>
              </header>

              <div className="holo-feature-shell">
              <MoodSettings
                theme={theme}
                onThemeChange={setTheme}
                animationsEnabled={
                  animationsEnabled
                }
                onAnimationsChange={
                  setAnimationsEnabled
                }
                entries={entries}
                onImportEntries={importEntries}
                onClearEntries={clearEntries}
              />
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  )
}
