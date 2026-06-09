exports.repo = "Hug3O/Click-sounds"
exports.version = 1.3
exports.apiRequired = 12.0
exports.description = "Mouse hover and click sounds"
exports.frontend_js = "main.js"

exports.config = {
    hoverSound: {
        type: 'vfs_path',
        folders: false,
        files: true,
        fileMask:  '*.mp3;*.wav;*.ogg',
        defaultValue: '',
        label: 'Hover Sound File',
        helperText: 'Select hover sound file. Leave empty to use default sound.',
        frontend: true
    },

    clickSound: {
        type: 'vfs_path',
        folders: false,
        files: true,
        fileMask: '*.mp3;*.wav;*.ogg',
        defaultValue: '',
        label: 'Click Sound File',
        helperText: 'Select click sound file. Leave empty to use default sound.',
        frontend: true
    },

    loadSound: {
        type: 'vfs_path',
        folders: false,
        files: true,
        fileMask: '*.mp3;*.wav;*.ogg',
        defaultValue: '',
        label: 'Page Load Sound File',
        helperText: 'Select page load sound file. Leave empty to use default sound.',
        frontend: true
    },

    volume: {
        type: 'number',
        label: 'Volume',
        defaultValue: 50,
        min: 0,
        max: 100,
        frontend: true
    },

    enableHover: {
        type: 'boolean',
        label: 'Enable Hover Sound',
        defaultValue: true,
        frontend: true
    },

    enableClick: {
        type: 'boolean',
        label: 'Enable Click Sound',
        defaultValue: true,
        frontend: true
    },

    enableLoad: {
        type: 'boolean',
        label: 'Enable Page Load Sound',
        defaultValue: true,
        frontend: true
    }
}