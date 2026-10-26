
import { useRef, useState } from 'react'
import { MOODS } from './moodUtils'
import { exportMoodJSON, exportMoodCSV } from './moodExport'

const themes = [
  {
    id: 'blush',
    name: 'Blush Pink',
    emoji: '🌸',
    description: 'Soft and romantic'
  },
  {
    id: 'lavender',
    name: 'Dreamy Lavender',
    emoji: '💜',
    description: 'Calm and magical'
  },
  {
    id: 'mint',
    name: 'Soft Mint',
    emoji: '🌿',
    description: 'Fresh and peaceful'
  }
]

const validMoods = new Set(MOODS.map((mood) => mood.label))

function normalizeEntry(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    return null
  }

  if (!validMoods.has(entry.mood)) return null

  if (
    typeof entry.journal !== 'undefined' &&
    typeof entry.journal !== 'string'
  ) {
    return null
  }

  const dateSource =
    typeof entry.createdAt === 'string'
      ? entry.createdAt
      : entry.date

  if (
    typeof dateSource !== 'string' ||
    Number.isNaN(new Date(dateSource).getTime())
  ) {
    return null
  }

  const parsedDate = new Date(dateSource)

  return {
    id:
      typeof entry.id === 'string' && entry.id.trim()
        ? entry.id
        : crypto.randomUUID(),
    mood: entry.mood,
    journal: entry.journal || '',
    date:
      typeof entry.date === 'string'
        ? entry.date
        : parsedDate.toLocaleString(),
    createdAt: parsedDate.toISOString()
  }
}

export default function MoodSettings({
  theme,
  onThemeChange,
  animationsEnabled,
  onAnimationsChange,
  entries,
  onImportEntries,
  onClearEntries
}) {
  const fileInputRef = useRef(null)
  const [importMessage, setImportMessage] = useState('')

  async function handleImport(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setImportMessage('')

    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Please select a JSON file under 5 MB.')
      }

      const content = await file.text()
      const parsed = JSON.parse(content)

      if (
        !parsed ||
        typeof parsed !== 'object' ||
        Array.isArray(parsed) ||
        parsed.app !== 'MoodBloom' ||
        !Array.isArray(parsed.entries)
      ) {
        throw new Error(
          'This does not look like a valid MoodBloom backup.'
        )
      }

      if (parsed.entries.length > 10000) {
        throw new Error('This backup contains too many entries.')
      }

      const normalized = parsed.entries.map(normalizeEntry)

      if (normalized.some((entry) => entry === null)) {
        throw new Error(
          'Some entries are invalid. No data was imported.'
        )
      }

      const existingIds = new Set(entries.map((entry) => entry.id))
      const uniqueEntries = normalized.filter((entry) => {
        if (existingIds.has(entry.id)) return false
        existingIds.add(entry.id)
        return true
      })

      if (uniqueEntries.length === 0) {
        setImportMessage(
          'No new entries found. Your existing journal is unchanged.'
        )
        return
      }

      const confirmed = window.confirm(
        `Import ${uniqueEntries.length} new mood entries? ` +
        'Your existing entries will be kept.'
      )

      if (!confirmed) return

      onImportEntries(uniqueEntries)

      setImportMessage(
        `${uniqueEntries.length} mood entries imported successfully! 🌸`
      )
    } catch (error) {
      setImportMessage(error.message || 'Unable to read backup.')
    } finally {
      event.target.value = ''
    }
  }

  function handleClear() {
    if (entries.length === 0) return

    const confirmed = window.confirm(
      'Permanently delete ALL saved mood entries from this browser? ' +
      'This cannot be undone. Export a backup first.'
    )

    if (!confirmed) return

    onClearEntries()
    setImportMessage('Your saved mood entries have been cleared.')
  }

  return (
    <section className="settings-page">
      <div className="glass-card settings-section animated-card">
        <span className="section-kicker">
          ✦ MAKE IT YOURS
        </span>

        <h3>Choose Your Atmosphere 🎨</h3>

        <p>
          Pick the colors that make your little universe
          feel most like home.
        </p>

        <div className="theme-grid">
          {themes.map((item) => (
            <button
              key={item.id}
              className={
                theme === item.id
                  ? `theme-choice theme-${item.id} active`
                  : `theme-choice theme-${item.id}`
              }
              onClick={() => onThemeChange(item.id)}
              aria-pressed={theme === item.id}
            >
              <span className="theme-emoji">{item.emoji}</span>
              <strong>{item.name}</strong>
              <small>{item.description}</small>
              {theme === item.id && (
                <span className="theme-selected">✓ Selected</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card settings-section animated-card">
        <span className="section-kicker">
          ✦ THE MAGIC OF MOTION
        </span>

        <h3>Holographic Animations ✨</h3>

        <p>
          Choose whether your universe gently floats,
          shimmers, and moves.
        </p>

        <label className="setting-toggle-row">
          <span>
            <strong>Enable animations</strong>
            <small>
              Floating typography, glowing effects,
              moving hologram, and transitions
            </small>
          </span>

          <input
            type="checkbox"
            checked={animationsEnabled}
            onChange={(event) =>
              onAnimationsChange(event.target.checked)
            }
          />
        </label>

        <p className="settings-note">
          Your device's reduced-motion accessibility
          preference is respected automatically.
        </p>
      </div>

      <div className="glass-card settings-section animated-card">
        <span className="section-kicker">
          ✦ YOUR SAVED MEMORIES
        </span>

        <h3>Backup & Restore 📦</h3>

        <p>
          Keep a copy of your mood journal or restore
          your memories from a previous backup.
        </p>

        <div className="settings-actions">
          <button
            onClick={() => exportMoodJSON(entries)}
            disabled={entries.length === 0}
          >
            ↓ Export JSON Backup
          </button>

          <button
            onClick={() => exportMoodCSV(entries)}
            disabled={entries.length === 0}
          >
            ↓ Export CSV
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
          >
            ↑ Import JSON Backup
          </button>
        </div>

        <input
          ref={fileInputRef}
          className="visually-hidden"
          type="file"
          accept=".json,application/json"
          onChange={handleImport}
          aria-label="Select MoodBloom JSON backup"
        />

        {importMessage && (
          <p className="settings-feedback" role="status">
            {importMessage}
          </p>
        )}

        <p className="settings-note">
          Imports add new entries without replacing your
          existing journal. Matching entry IDs are skipped.
        </p>
      </div>

      <div className="glass-card settings-section animated-card">
        <span className="section-kicker">
          ✦ YOUR PRIVACY MATTERS
        </span>

        <h3>Your Data, Your Choice 🔒</h3>

        <p>
          MoodBloom currently stores your entries in this
          browser using localStorage. Your journal is not
          automatically synchronized to another device.
        </p>

        <div className="data-summary">
          <strong>{entries.length}</strong>
          <span>saved mood entries in this browser</span>
        </div>

        <button
          className="danger-button"
          onClick={handleClear}
          disabled={entries.length === 0}
        >
          🗑️ Clear All Mood Entries
        </button>

        <p className="settings-note">
          Clearing entries is permanent unless you have
          exported a backup.
        </p>
      </div>
    </section>
  )
}
