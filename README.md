# ts-logger

[CI](https://github.com/95yoel/ts-logger/actions/workflows/pipeline.yml/badge.svg)

A lightweight, zero-dependency logger for TypeScript.
Includes levels, styled output, timing utilities, and JSON logs. Ideal for debugging small to medium projects.

## 📚 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Recommended Setup](#-recommended-setup)
- [Usage](#usage)
  - [Basic Logging](#basic-logging)
  - [Performance Measurement](#performance-measurement)
  - [Grouped Logs](#grouped-logs)
  - [JSON Logs](#json-logs)
  - [Manual Timers](#manual-timers)
  - [Data Logging](#data-logging)
  - [Toggle Timestamps](#toggle-timestamps)
  - [Custom Styles](#custom-styles)
- [Configuration](#configuration)
- [API Overview](#api-overview)


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

> ⚠️ Since this package is installed from GitHub (not NPM), make sure to import it like this:

```ts
import { Logger } from 'ts-logger/src/logger'
```

## 🛠 Recommended Setup

For best maintainability, it's recommended to configure the logger once in your application's entry point (e.g., `main.ts`, `index.ts`, etc.).

```ts
// src/main.ts or similar
import { Logger } from 'ts-logger'

Logger.setLevel('info')          // Only show 'info', 'warn', 'error'
Logger.showTimestamp()           // Optional: show timestamps (enabled by default)
Logger.configureStyles({
  info: 'color: #2196f3; font-weight: bold;',
  warn: 'color: orange; font-weight: bold;',
})

```
------

## Usage

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

### Performance Measurement

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


### Grouped Logs

```ts
Logger.group('Authentication Flow', undefined, true)
log.info('Attempting login for user: admin')
log.debug('Checking credentials...')
Logger.groupEnd()

```
---

### JSON Logs

```ts
Logger.json('info', 'User details', 'AuthModule', { user: 'admin', role: 'editor' })
```
---




### Measure time

```ts
// Manual timer control
Logger.start('Init')
// ... some work ...
Logger.end('Init')

```
---

### Print data structures

```ts
log.data({ userId: 123, action: 'login' })

```
---

### Custom Styles

Configure styles:
```ts

Logger.configureStyles({
  info: 'color: #4caf50; font-weight: bold;',
  debug: 'color: #607d8b; font-style: italic;',
})

```
Print current styles:

```ts
console.log(Logger.styles)
```
---



### Toggle-timestamps

You can hide timestamps in all logs if you want cleaner output:
```ts
Logger.hideTimestamp()
```
And re-enable them with:
```ts
Logger.showTimestamp()
```
---

### Configuration

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

## API Overview 

| Method                               | Description                                   |
|--------------------------------------|-----------------------------------------------|
| `Logger.info(msg, ctx?, ...data)`   | Logs an info message                           |
| `Logger.warn(msg, ctx?, ...data)`   | Logs a warning message                         |
| `Logger.error(msg, ctx?, ...data)`  | Logs an error message                          |
| `Logger.debug(msg, ctx?, ...data)`  | Logs a debug message                           |
| `Logger.create(ctx)`                 | Creates a context-aware logger                |
| `Logger.enable()`                    | Enables all logging globally                  |
| `Logger.disable()`                   | Disables all logging globally                 |
| `Logger.setLevel(level)`             | Sets minimum log level to output              |
| `Logger.measure(label, fn)`          | Measures synchronous function execution time  |
| `Logger.measureAsync(label, fn)`     | Measures asynchronous function execution time |
| `Logger.group(label)`                | Creates a log group                           |
| `Logger.groupEnd()`                  | Ends the current log group                    |
| `Logger.json(level, msg, ctx, data)` | Outputs structured JSON logs                  |
| `Logger.start(label)`                | Starts a custom performance timer             |
| `Logger.end(label)`                  | Ends the timer and logs duration              |
| `Logger.data(ctx, data)`             | Logs a data structure at info level           |
| `Logger.styles`                      | Returns the current CSS styles by level       |


## 📄 License

MIT © [95yoel](https://github.com/95yoel)