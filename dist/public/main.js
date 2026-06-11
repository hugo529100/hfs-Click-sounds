'use strict';{

const cfg = HFS.getPluginConfig()

function getPluginBasePath() {
    const scripts = document.getElementsByTagName('script')
    for (let i = scripts.length - 1; i >= 0; i--) {
        const src = scripts[i].src
        if (src && src.includes('/plugins/')) {
            const match = src.match(/(.*\/plugins\/[^/]+)\//)
            if (match) {
                return match[1]
            }
        }
    }
    if (document.currentScript && document.currentScript.src) {
        const src = document.currentScript.src
        const match = src.match(/(.*\/plugins\/[^/]+)\//)
        if (match) {
            return match[1]
        }
    }
    return '/~/plugins/Click-sounds'
}

function isTouchDevice() {
    return ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0)
}

const isTouch = isTouchDevice()
const pluginBasePath = getPluginBasePath()

function getSoundPath(configPath, defaultFile) {
    if (configPath && configPath.trim() !== '') {
        return configPath
    }
    return pluginBasePath + '/' + defaultFile
}

function createPlayer(url) {
    if (!url)
        return null

    const audio = new Audio(url)
    audio.preload = 'auto'
    audio.volume = (Number(cfg.volume || 80) / 100)

    audio.addEventListener('error', () => {
        console.error('[mouse-sound] audio load failed:', url)
    })

    return audio
}

const hoverSoundPath = getSoundPath(cfg.hoverSound, 'hover.mp3')
const clickSoundPath = getSoundPath(cfg.clickSound, 'click.mp3')
const loadSoundPath = getSoundPath(cfg.loadSound, 'load.mp3')

const hoverAudio = createPlayer(hoverSoundPath)
const clickAudio = createPlayer(clickSoundPath)
const loadAudio = createPlayer(loadSoundPath)

function play(audio) {
    if (!audio)
        return

    try {
        audio.pause()
        audio.currentTime = 0

        const p = audio.play()

        if (p?.catch)
            p.catch(err =>
                console.error('[mouse-sound] play failed:', err)
            )
    }
    catch(err) {
        console.error(err)
    }
}

if (cfg.enableLoad !== false) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            play(loadAudio)
        }, 500)
    })
    
    if (document.readyState === 'complete') {
        setTimeout(() => {
            play(loadAudio)
        }, 500)
    }
}

if (!isTouch) {
    document.addEventListener('mouseover', e => {
        if (!cfg.enableHover)
            return

        const el = e.target.closest(
            'a,button,[role="button"],.item,.entry'
        )

        if (!el)
            return

        play(hoverAudio)
    }, true)
}

document.addEventListener('click', () => {
    if (!cfg.enableClick)
        return

    play(clickAudio)
}, true)

}