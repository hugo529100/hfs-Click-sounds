'use strict';{
    const cfg = HFS.getPluginConfig()
    
    function getPluginBasePath() {
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const src = scripts[i].src;
            if (src && src.includes('Click-sounds')) {
                const match = src.match(/(.*\/plugins\/[^/]+)\//);
                if (match) {
                    return match[1];
                }
            }
        }
        
        if (document.currentScript && document.currentScript.src) {
            const src = document.currentScript.src;
            const match = src.match(/(.*\/plugins\/[^/]+)\//);
            if (match) {
                return match[1];
            }
        }
        
        return '/~/plugins/Click-sounds';
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
        
        // 靜默處理錯誤，避免干擾用戶體驗
        audio.addEventListener('error', () => {})
        
        return audio
    }
    
    const hoverSoundPath = getSoundPath(cfg.hoverSound, 'hover.mp3')
    const clickSoundPath = getSoundPath(cfg.clickSound, 'click.mp3')
    const loadSoundPath = getSoundPath(cfg.loadSound, 'load.mp3')
    
    const hoverAudio = createPlayer(hoverSoundPath)
    const clickAudio = createPlayer(clickSoundPath)
    const loadAudio = createPlayer(loadSoundPath)
    
    // 用於防抖的計時器
    let playTimeout = null
    
    function play(audio) {
        if (!audio)
            return
    
        try {
            // 清除之前的計時器，防止堆積
            if (playTimeout) {
                clearTimeout(playTimeout)
                playTimeout = null
            }
            
            audio.pause()
            audio.currentTime = 0
            
            // 使用微小的延遲避免觸發瀏覽器的自動播放策略限制
            playTimeout = setTimeout(() => {
                const p = audio.play()
                if (p?.catch) {
                    p.catch(() => {}) // 靜默處理播放失敗
                }
                playTimeout = null
            }, 10)
        }
        catch(err) {
            // 靜默處理錯誤
        }
    }
    
    // 立即播放（用於加載音效）
    function playImmediate(audio) {
        if (!audio)
            return
    
        try {
            audio.pause()
            audio.currentTime = 0
            const p = audio.play()
            if (p?.catch) {
                p.catch(() => {})
            }
        }
        catch(err) {
            // 靜默處理錯誤
        }
    }
    
    if (cfg.enableLoad !== false) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                playImmediate(loadAudio)
            }, 500)
        })
        
        if (document.readyState === 'complete') {
            setTimeout(() => {
                playImmediate(loadAudio)
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
    
    // 使用事件監聽的節流，避免快速點擊時過度觸發
    let clickThrottleTimer = null
    
    document.addEventListener('click', () => {
        if (!cfg.enableClick)
            return
        
        // 節流：在短時間內重複點擊只播放一次
        if (clickThrottleTimer) {
            clearTimeout(clickThrottleTimer)
            clickThrottleTimer = null
        }
        
        // 先重置音頻再播放
        if (clickAudio) {
            try {
                clickAudio.pause()
                clickAudio.currentTime = 0
            } catch(e) {}
        }
        
        clickThrottleTimer = setTimeout(() => {
            if (clickAudio) {
                const p = clickAudio.play()
                if (p?.catch) {
                    p.catch(() => {})
                }
            }
            clickThrottleTimer = null
        }, 30)
    }, true)
}