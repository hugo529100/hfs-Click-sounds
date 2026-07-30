'use strict';{

const cfg = HFS.getPluginConfig()

function getPluginBasePath() {
    // 更可靠的方法：使用当前脚本的路径
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        const src = scripts[i].src;
        // 查找包含 Click-sounds 的脚本
        if (src && src.includes('Click-sounds')) {
            const match = src.match(/(.*\/plugins\/[^/]+)\//);
            if (match) {
                return match[1];
            }
        }
    }
    
    // 备用方案：尝试从当前执行脚本获取
    if (document.currentScript && document.currentScript.src) {
        const src = document.currentScript.src;
        const match = src.match(/(.*\/plugins\/[^/]+)\//);
        if (match) {
            return match[1];
        }
    }
    
    // 最后的备用路径
    return '/~/plugins/Click-sounds';
}

function isTouchDevice() {
    return ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0)
}

const isTouch = isTouchDevice()
const pluginBasePath = getPluginBasePath()
console.log('[Click-sounds] Plugin base path:', pluginBasePath) // 调试日志

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
        console.error('[Click-sounds] audio load failed:', url)
    })

    return audio
}

const hoverSoundPath = getSoundPath(cfg.hoverSound, 'hover.mp3')
const clickSoundPath = getSoundPath(cfg.clickSound, 'click.mp3')
const loadSoundPath = getSoundPath(cfg.loadSound, 'load.mp3')

console.log('[Click-sounds] Sound paths:', {
    hover: hoverSoundPath,
    click: clickSoundPath,
    load: loadSoundPath
}) // 调试日志

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
                console.error('[Click-sounds] play failed:', err)
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