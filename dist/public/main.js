'use strict';{

const cfg = HFS.getPluginConfig()
console.log('[mouse-sound] Full config:', JSON.stringify(cfg))

// 獲取當前腳本的路徑，從而推斷插件路徑
function getPluginBasePath() {
    // 從當前腳本標籤獲取路徑
    const scripts = document.getElementsByTagName('script')
    for (let i = scripts.length - 1; i >= 0; i--) {
        const src = scripts[i].src
        if (src && src.includes('/plugins/')) {
            // 提取到 plugins/插件名/ 的路徑
            const match = src.match(/(.*\/plugins\/[^/]+)\//)
            if (match) {
                return match[1]
            }
        }
    }
    // 備用方案：使用 document.currentScript
    if (document.currentScript && document.currentScript.src) {
        const src = document.currentScript.src
        const match = src.match(/(.*\/plugins\/[^/]+)\//)
        if (match) {
            return match[1]
        }
    }
    // 最後備用方案
    console.warn('[mouse-sound] Could not determine plugin path, using fallback')
    return '/~/plugins/Click-sounds'
}

// 檢測是否為觸屏設備
function isTouchDevice() {
    return ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0)
}

const isTouch = isTouchDevice()
console.log('[mouse-sound] Touch device detected:', isTouch)

const pluginBasePath = getPluginBasePath()
console.log('[mouse-sound] Plugin base path:', pluginBasePath)

// 獲取聲音文件路徑，如果配置為空則使用默認文件
function getSoundPath(configPath, defaultFile) {
    if (configPath && configPath.trim() !== '') {
        return configPath
    }
    // 返回插件內置的默認聲音文件路徑
    return pluginBasePath + '/' + defaultFile
}

function createPlayer(url) {
    if (!url)
        return null

    console.log('[mouse-sound] loading:', url)

    const audio = new Audio(url)

    audio.preload = 'auto'
    audio.volume = (Number(cfg.volume || 80) / 100)

    audio.addEventListener('error', () => {
        console.error(
            '[mouse-sound] audio load failed:',
            url
        )
    })

    audio.addEventListener('canplaythrough', () => {
        console.log('[mouse-sound] audio loaded successfully:', url)
    })

    return audio
}

// 使用修改後的邏輯獲取聲音文件路徑
const hoverSoundPath = getSoundPath(cfg.hoverSound, 'hover.mp3')
const clickSoundPath = getSoundPath(cfg.clickSound, 'click.mp3')
const loadSoundPath = getSoundPath(cfg.loadSound, 'load.mp3')

console.log('[mouse-sound] Sound paths:', {
    hover: hoverSoundPath,
    click: clickSoundPath,
    load: loadSoundPath
})

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
                console.error(
                    '[mouse-sound] play failed:',
                    err
                )
            )
    }
    catch(err) {
        console.error(err)
    }
}

// 頁面加載時播放聲音
if (cfg.enableLoad !== false) {
    // 等待頁面完全加載後再播放
    window.addEventListener('load', () => {
        // 稍微延遲一下，確保用戶體驗更好
        setTimeout(() => {
            play(loadAudio)
        }, 500)
    })
    
    // 如果頁面已經加載完成，立即播放
    if (document.readyState === 'complete') {
        setTimeout(() => {
            play(loadAudio)
        }, 500)
    }
}

// 只在非觸屏設備上啟用 hover 聲效
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
} else {
    console.log('[mouse-sound] Hover sounds disabled on touch device')
}

document.addEventListener('click', () => {

    if (!cfg.enableClick)
        return

    play(clickAudio)

}, true)

console.log('[mouse-sound] loaded')

}