# ts-logger

A lightweight, zero-dependency logger for TypeScript.
Includes levels, styled output, timing utilities, and JSON logs. Ideal for debugging small to medium projects.

## ✨ Features

- ✅ Log levels: `debug`, `info`, `warn`, `error`
- 🎨 Styled output via `console.log` (browser DevTools)
- ⏱ Timers and performance measurement (sync/async)
- 📦 JSON output for structured logging
- 🧩 Context-aware child loggers
- 📁 No dependencies, easy to use anywhere

- ------

## 🚀 Installation

```console
npm install github:95yoel/ts-logger

```

Or clone it directly 

```console
git clone https://github.com/95yoel/ts-logger
```

## 📦 Example usage

```ts
import { Logger } from 'ts-logger/src/logger'

const log = Logger.create('App')

log.info('App started')
log.debug('Fetching data...')

Logger.measure('Expensive Task', () => {
  // Do something CPU-intensive
})

await Logger.measureAsync('Async Fetch', async () => {
  await fetch('/api/data')
})

Logger.group('Auth')
log.info('User logged in')
Logger.groupEnd()

---

## 📄 Notes

This README is still a work in progress. More examples,   

usage details, and contribution guidelines will be added soon.
