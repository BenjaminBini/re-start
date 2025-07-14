<script>
    import { onMount, onDestroy } from 'svelte'
    import Todoist from './lib/components/Todoist.svelte'
    import Weather from './lib/components/Weather.svelte'
    import Links from './lib/components/Links.svelte'
    import Settings from './lib/components/Settings.svelte'
    import { settings } from './lib/settings-store.svelte.js'

    let showSettings = $state(false)

    let loadTime = $state(0)
    let latency = $state(null)
    let viewportSize = $state('')
    let fps = $state(0)

    let currentHrs = $state('')
    let currentMin = $state('')
    let currentSec = $state('')
    let currentAmPm = $state('')
    let currentDate = $state('')
    let clockInterval = null

    let weatherComponent
    let todoistComponent

    let frameCount = 0
    let lastTime = 0
    let fpsAnimationId = null

    function updateFPS() {
        frameCount++
        const currentTime = performance.now()

        if (currentTime >= lastTime + 1000) {
            fps = frameCount
            frameCount = 0
            lastTime = currentTime
        }

        fpsAnimationId = requestAnimationFrame(updateFPS)
    }

    function startFPS() {
        if (!fpsAnimationId) {
            frameCount = 0
            lastTime = performance.now()
            updateFPS()
        }
    }

    function stopFPS() {
        if (fpsAnimationId) {
            cancelAnimationFrame(fpsAnimationId)
            fpsAnimationId = null
            fps = 0
        }
    }

    function updateTime() {
        const now = new Date()

        let hours = now.getHours()

        if (settings.timeFormat === '12hr') {
            currentAmPm = hours >= 12 ? 'pm' : 'am'
            hours = hours % 12
            if (hours === 0) hours = 12
        } else {
            currentAmPm = ''
        }

        currentHrs = hours.toString().padStart(2, '0')
        currentMin = now.getMinutes().toString().padStart(2, '0')
        currentSec = now.getSeconds().toString().padStart(2, '0')

        currentDate = now
            .toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
            .toLowerCase()
    }

    function startClock() {
        updateTime()

        const now = new Date()
        const msUntilNextSecond = 1000 - now.getMilliseconds()

        setTimeout(() => {
            updateTime()
            clockInterval = setInterval(updateTime, 1000)
        }, msUntilNextSecond)
    }

    function closeSettings() {
        showSettings = false
    }

    function handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            if (weatherComponent) {
                weatherComponent.loadWeather()
            }
            if (todoistComponent) {
                todoistComponent.loadTasks()
            }
            startFPS()
        } else {
            stopFPS()
        }
    }

    async function measurePing() {
        const start = performance.now()

        try {
            await fetch('https://www.google.com/generate_204', {
                method: 'GET',
                mode: 'no-cors',
                cache: 'no-cache',
            })
            latency = Math.round(performance.now() - start)
        } catch (error) {
            latency = null
        }
    }

    function updateViewportSize() {
        viewportSize = `${window.innerWidth} x ${window.innerHeight}`
    }

    onMount(() => {
        startClock()
        measurePing()
        updateViewportSize()
        startFPS()

        const perfObserver = new PerformanceObserver((list) => {
            const entry = list.getEntries()[0].toJSON()
            loadTime = Math.round(entry.duration)
        })
        perfObserver.observe({ type: 'navigation', buffered: true })

        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('resize', updateViewportSize)
    })

    onDestroy(() => {
        if (clockInterval) {
            clearInterval(clockInterval)
        }
        stopFPS()
        window.removeEventListener('resize', updateViewportSize)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
    })
</script>

<main>
    <div class="clock">
        {currentHrs}:{currentMin}:{currentSec}
        {#if settings.timeFormat === '12hr'}
            <span class="clock-ampm">{currentAmPm}</span>
        {/if}
    </div>
    <div class="date">{currentDate}</div>
    <br />
    <br />
    <div class="widgets">
        <Weather bind:this={weatherComponent} />
        <Todoist bind:this={todoistComponent} />
    </div>
    <br />
    <br />
    <Links />
    <br />
    <br />
    <div class="load-stats">
        load: {loadTime} ms | ping: {latency || '?'} ms
    </div>

    <button
        class="settings-btn"
        onclick={() => (showSettings = true)}
        aria-label="Open settings"
    >
        settings
    </button>

    <Settings {showSettings} {closeSettings} />
    <div class="display-stats">{fps} fps | {viewportSize}</div>
</main>

<style>
    main {
        margin: 1.5rem;
    }
    .clock {
        margin: 0;
        font-size: 3rem;
        font-weight: 300;
        color: var(--txt-1);
        line-height: normal;
    }
    .date {
        margin: 0;
        font-size: 1.5rem;
        color: var(--txt-3);
        line-height: normal;
    }
    .widgets {
        display: flex;
        gap: 6rem;
    }
    .load-stats {
        position: fixed;
        bottom: 0;
        left: 0;
        padding: 1rem 1.5rem;
        color: var(--txt-3);
    }
    .settings-btn {
        position: fixed;
        top: 0;
        right: 0;
        padding: 1rem 1.5rem;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 100;
        color: var(--txt-3);
    }
    .settings-btn:hover {
        opacity: 1;
    }
    .display-stats {
        position: fixed;
        bottom: 0;
        right: 0;
        padding: 1rem 1.5rem;
        color: var(--txt-3);
    }
</style>
