
/**
 * Log levels available.
 * @category Types
 */
export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

/**
 * Level order for filtering.
 * @category Constants
 */
const levelOrder: LogLevel[] = ['debug', 'info', 'warn', 'error']

/**
 * Default CSS styles for each log level.
 * @category Constants
 */
const defaultStyles: Record<LogLevel, string> = {
    info: 'color: #2196f3; font-weight: bold;',
    warn: 'color: orange; font-weight: bold;',
    error: 'color: red; font-weight: bold;',
    debug: 'color: gray; font-style: italic;',
}

/**
 * Configuration options for the logger.
 * @category Configuration
 */
export type LoggerConfig = {
    /** Enable or disable all logs */
    enabled: boolean
    /** Minimum log level to display */
    minLevel: LogLevel
    /** Show or hide the timestamp in logs */
    showTimestamp: boolean
}

/**
 * Static Logger for browser debugging.
 * Supports levels, contexts, CSS styles, JSON output,
 * timers, and log grouping.
 *
 * @example
 * import { Logger } from './logger'
 * const log = Logger.create('MyModule')
 * log.info('Hello!')
 * 
 */
export class Logger {

    // Dynamic configuration
    private static _config: LoggerConfig = {
        enabled: true,
        minLevel: 'debug',
        showTimestamp: true,
    }

    /**  Current CSS styles, initially cloned from defaultStyles */
    private static _styles = { ...defaultStyles }
    /** Access current CSS styles by level */
    static get styles() { return this._styles }

    // Internal map for timers (label -> start time)
    private static _timers = new Map<string, number>()

    // Set of disabled contexts
    private static _disabledContexts = new Set<string>()

    // ----------------------------
    // Global configuration methods
    // ----------------------------

    /** Enable all logs */
    static enable() { this._config.enabled = true }
    /** Disable all logs */
    static disable() { this._config.enabled = false }
    /** Set the minimum log level */
    static setLevel(level: LogLevel) { this._config.minLevel = level }
    /** Show timestamps in log messages */
    static showTimestamp() { this._config.showTimestamp = true }
    /** Hide timestamps in log messages */
    static hideTimestamp() { this._config.showTimestamp = false }
    /** Disable logs for a specific context */
    static disableContext(ctx: string) { this._disabledContexts.add(ctx) }
    /** Enable logs for a specific context */
    static enableContext(ctx: string) { this._disabledContexts.delete(ctx) }
    /** Customize CSS styles by level */
    static configureStyles(newStyles: Partial<Record<LogLevel, string>>) {
        this._styles = { ...this._styles, ...newStyles }
    }

    // ----------------------------
    // Create child loggers with fixed context
    // ----------------------------

    /**
     * Create a logger for a specific context.
     * @param ctx Context or module name for log messages
     * @returns An object with logging methods and utilities
     */
    static create(ctx: string) {
        return {
            info: (msg: string, ...d: unknown[]) => this.info(msg, ctx, ...d),
            warn: (msg: string, ...d: unknown[]) => this.warn(msg, ctx, ...d),
            error: (msg: string, ...d: unknown[]) => this.error(msg, ctx, ...d),
            debug: (msg: string, ...d: unknown[]) => this.debug(msg, ctx, ...d),
            data: (d: unknown) => this.data(ctx, d),
            start: (label: string) => this.start(label, ctx),
            end: (label: string) => this.end(label, ctx),
            measure: <T>(label: string, fn: () => T) => this.measure(label, fn, ctx),
            measureAsync: <T>(label: string, fn: () => Promise<T>) => this.measureAsync(label, fn, ctx),
            group: (label: string, style?: string, collapsed?: boolean) =>
                this.group(label, ctx, style, collapsed),
        }
    }

    // ----------------------------
    // Timer methods
    // ----------------------------

    /**
     * Start a timer with a given label.
     * @param label Identifier for the timer
     * @param ctx Optional context
     */
    static start(label: string, ctx?: string) {
        this._timers.set(label, performance.now())
        this.log('debug', `Timer '${label}' started`, ctx)
    }

    /**
   * End a timer and log the elapsed time.
   * @param label Identifier for the timer
   * @param ctx Optional context
   * @returns Elapsed time in milliseconds, or 0 if not found
   */
    static end(label: string, ctx?: string) {
        const time0 = this._timers.get(label)
        if (time0 != null) {
            const ms = performance.now() - time0
            this.log('info', `Timer '${label}' ended: ${ms.toFixed(2)}ms`, ctx)
            this._timers.delete(label)
            return ms
        }
        this.log('warn', `No timer found for '${label}'`, ctx)
        return 0
    }

    // ----------------------------
    // Measure helpers
    // ----------------------------

    /**
   * Measure synchronous function execution time.
   * @param label Descriptive label
   * @param fn Function to measure
   * @param ctx Optional context
   * @returns Duration in ms
   * 
   * @example
   * const time = Logger.measure('heavyCalc',()=>{*heavy work*})
   * console.log(`It took ${time} ms.`)
   */
    static measure(label: string, fn: () => void, ctx?: string): number {
        const t0 = performance.now()
        this.log('debug', `⏱ ${label} start`, ctx)
        fn()
        const ms = performance.now() - t0
        this.log('info', `⏱ ${label} end: ${ms.toFixed(2)}ms`, ctx)
        return Number(ms.toFixed(2))
    }

    /**
   * Measure asynchronous function execution time.
   * @param label Descriptive label
   * @param fn Async function to measure
   * @param ctx Optional context
   * @returns Duration in ms (two decimals)
   */
    static async measureAsync<T>(
        label: string,
        fn: () => Promise<T>,
        ctx?: string
    ): Promise<number> {
        const time0 = performance.now()
        this.log('debug', `⏱ ${label} start`, ctx)
        await fn()
        const ms = performance.now() - time0
        this.log('info', `⏱ ${label} end: ${ms.toFixed(2)}ms`, ctx)
        return Number(ms.toFixed(2))
    }

    // ----------------------------
    // Log grouping
    // ----------------------------

    /**
     * Start a log group (collapsible or not) with optional style.
     * @param label Group label
     * @param ctx Optional context
     * @param style CSS style for the group header
     * @param collapsed Whether the group should start collapsed
     */
    static group(
        label: string,
        ctx?: string,
        style: string = defaultStyles.info,
        collapsed = false
    ) {
        if (!this._config.enabled) return
        if (ctx && this._disabledContexts.has(ctx)) return
        const prefix = `%c[GROUP: ${label}]${ctx ? ` [${ctx}]` : ''}`
        
        const fn = collapsed ? console.groupCollapsed : console.group
        fn(prefix, style)
    }

    /**
   * Close the current log group.
   */
    static groupEnd() {
        console.groupEnd()
    }

    // ----------------------------
    // JSON output
    // ----------------------------

    /**
    * Emit a log event in JSON format.
    * @param level Log level
    * @param msg Descriptive message
    * @param ctx Optional context
    * @param data Additional payload
    */
    static json(
        level: LogLevel,
        msg: string,
        ctx?: string,
        data?: unknown
    ) {
        if (!this._config.enabled) return
        if (levelOrder.indexOf(level) < levelOrder.indexOf(this._config.minLevel)) return
        if (ctx && this._disabledContexts.has(ctx)) return
        const ev = {
            level,
            message: msg,
            context: ctx,
            data,
            timestamp: this._config.showTimestamp ? new Date().toISOString() : undefined,
        }
        this.log(level, JSON.stringify(ev), ctx)
    }


    // ----------------------------
    // Internal logging implementation
    // ----------------------------

    /**
     * Internal method for filtering, formatting, and routing to console.
     * @param level Log level
     * @param msg Message to display
     * @param context Optional context
     * @param data Additional data to include
     */
    private static log(
        level: LogLevel,
        msg: string,
        context?: string,
        ...data: unknown[]
    ) {
        if (!this._config.enabled) return
        if (levelOrder.indexOf(level) < levelOrder.indexOf(this._config.minLevel)) return
        if (context && this._disabledContexts.has(context)) return

        const ts = new Date().toISOString()
        const ctxStr = context ? ` [${context}]` : ''
        const prefix = `%c[${level.toUpperCase()}]%c${ctxStr}`
        const style = this._styles[level]

        const parts: unknown[] = [prefix, style, '', msg, ...data]
        if (this._config.showTimestamp) parts.push(`@${ts}`)

        switch (level) {
            case 'error':
                console.error(...parts)
                break
            case 'warn':
                console.warn(...parts)
                break
            case 'info':
                console.info(...parts)
                break
            case 'debug':
                console.debug(...parts)
                break
        }

    }

    // -------------
    // Level shortcuts
    // -------------

    /**
     * Shortcut for Logger.log('info', ...)
     */
    static info(msg: string, ctx?: string, ...data: unknown[]) {
        this.log('info', msg, ctx, ...data)
    }

    /**
   * Shortcut for Logger.log('warn', ...)
   */
    static warn(msg: string, ctx?: string, ...data: unknown[]) {
        this.log('warn', msg, ctx, ...data)
    }

    /**
   * Shortcut for Logger.log('error', ...)
   */
    static error(msg: string, ctx?: string, ...data: unknown[]) {
        this.log('error', msg, ctx, ...data)
    }

    /**
   * Shortcut for Logger.log('debug', ...)
   */
    static debug(msg: string, ctx?: string, ...data: unknown[]) {
        this.log('debug', msg, ctx, ...data)
    }

    /**
   * Log data at 'info' level.
   * @param ctx Context or module associated with the data
   * @param data The data structure to log
   */
    static data(ctx: string, data: unknown) {
        this.log('info', 'DATA:', ctx, data)
    }


}