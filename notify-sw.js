// Imported by the generated service worker. Clicking a reminder notification brings Orchestra forward and opens the task.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const id = event.notification.data && event.notification.data.taskId
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      for (const w of windows) {
        if ('focus' in w) {
          await w.focus()
          if (id) w.postMessage({ type: 'open-task', id })
          return
        }
      }
      await self.clients.openWindow(self.registration.scope + (id ? '#task=' + encodeURIComponent(id) : ''))
    })(),
  )
})

// A reminder pushed from the server (works while the app is closed). iOS and other browsers require that every push
// shows a notification, so this always does, even if the message could not be read.
self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (e) {
    data = { body: event.data ? event.data.text() : '' }
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'Orchestra reminder', {
      body: data.body || '',
      tag: data.tag || undefined, // same task + moment replaces itself instead of stacking
      data: { taskId: data.taskId || '' },
      icon: 'icon-192.png',
      badge: 'icon-192.png',
    }),
  )
})