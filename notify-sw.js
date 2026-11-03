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