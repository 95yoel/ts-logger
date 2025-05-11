# ts-logger

A lightweight, zero-dependency logger for TypeScript.
Includes levels, styled output, timing utilities, and JSON logs. Ideal for debugging small to medium projects.

## ✨ Features

- ✅ Log levels: `debug`, `info`, `warn`, `error`
- 🎨 Styled output with customizable CSS via browser DevTools
- ⏱  Timers and performance measurement (sync/async)
- 📦 JSON output for structured logging
- 🧩 Context-aware child loggers
- 🚧 Enable/disable logs globally or per context
- 📁 Zero dependencies, easy to use anywhere

- ------

## 🚀 Installation

```console
npm install github:95yoel/ts-logger

```

## 📦 Example usage

### Basic logging

```ts
import { Logger } from 'ts-logger/src/logger'

const log = Logger.create('App')

log.info('Application started 🚀')
log.debug('Debugging details here...')
log.warn('Potential issue detected.')
log.error('Something went wrong!')


```
---

### Measuring performance

```ts
// Synchronous task
Logger.measure('Heavy Calculation', () => {
  // Expensive synchronous code
})

// Asynchronous task
await Logger.measureAsync('Data Fetch', async () => {
  await fetch('/api/data')
})


```
---


### Using groups for structured logs

```ts
Logger.group('Authentication Flow', undefined, true)
log.info('Attempting login for user: admin')
log.debug('Checking credentials...')
Logger.groupEnd()

```
---

### JSON formatted logs

```ts
Logger.json('info', 'User details', 'AuthModule', { user: 'admin', role: 'editor' })
```
---

### Global and context-based configuration

```ts
// Disable all logs
Logger.disable()

// Re-enable logs and set minimum level
Logger.enable()
Logger.setLevel('warn')

// Disable logs for specific context
Logger.disableContext('App')

// Enable logs for previously disabled context
Logger.enableContext('App')

```
---

### Customize log styles

```ts

Logger.configureStyles({
  info: 'color: #4caf50; font-weight: bold;',
  debug: 'color: #607d8b; font-style: italic;',
})

```
---

