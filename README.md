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

# Basic logging

```ts
import { Logger } from 'ts-logger/src/logger'

const log = Logger.create('App')

log.info('Application started 🚀')
log.debug('Debugging details here...')
log.warn('Potential issue detected.')
log.error('Something went wrong!')


```
---

## 📄 Notes

This README is still a work in progress. More examples and usage details will be added soon.
