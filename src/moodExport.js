
function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}

function csvCell(value) {
  const text = String(value ?? '')

  // Prevent spreadsheet applications from treating
  // journal text as formulas.
  const safeText = /^[\s]*[=+\-@]/.test(text)
    ? `'${text}`
    : text

  return `"${safeText.replace(/"/g, '""')}"`
}

export function exportMoodJSON(entries) {
  const content = JSON.stringify(
    {
      app: 'MoodBloom',
      version: '0.7',
      exportedAt: new Date().toISOString(),
      entries
    },
    null,
    2
  )

  downloadFile(
    content,
    'moodbloom-backup.json',
    'application/json'
  )
}

export function exportMoodCSV(entries) {
  const headers = [
    'Date',
    'Mood',
    'Journal'
  ]

  const rows = entries.map((entry) => [
    entry.date || entry.createdAt || '',
    entry.mood || '',
    entry.journal || ''
  ])

  const content = [
    headers.map(csvCell).join(','),
    ...rows.map((row) => row.map(csvCell).join(','))
  ].join('\r\n')

  downloadFile(
    '\uFEFF' + content,
    'moodbloom-journal.csv',
    'text/csv;charset=utf-8'
  )
}
