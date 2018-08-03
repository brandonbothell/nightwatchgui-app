import { BrowserWindow, dialog, shell, app } from 'electron'

export const template: any[] = [{
  label: 'File',
  submenu: [{
    label: 'Go back',
    accelerator: 'CmdOrCtrl+Left',
    click: (item, focusedWindow: BrowserWindow) => {
      if (focusedWindow) {
        focusedWindow.webContents.goBack()
      }
    }
  }, {
    label: 'Go forward',
    accelerator: 'CmdOrCtrl+Right',
    click: (item, focusedWindow: BrowserWindow) => {
      if (focusedWindow) {
        focusedWindow.webContents.goForward()
      }
    }
  }, {
    label: 'Open HTML document',
    accelerator: 'CmdOrCtrl+Shift+O',
    click: (item, focusedWindow: BrowserWindow) => {
      if (focusedWindow) {
        dialog.showOpenDialog(focusedWindow, {
          properties: ['openFile'],
          filters: [{ extensions: ['html'], name: '' }]
        }, (files) => {
          if (!files || files.length === 0) {
            return false
          }

          const file = files[0]

          console.log(file)

          if (file.match(/.*.html$/)) {
            return focusedWindow.loadFile(file)
          }

          const options = {
            type: 'error',
            title: 'Invalid file',
            buttons: ['Ok'],
            message: 'You must choose a .html file.'
          }
          dialog.showMessageBox(focusedWindow, options, function () { return })
        })
      }
    }
  }]
}, {
  label: 'Edit',
  submenu: [{
    label: 'Undo',
    accelerator: 'CmdOrCtrl+Z',
    role: 'undo'
  }, {
    label: 'Redo',
    accelerator: 'Shift+CmdOrCtrl+Z',
    role: 'redo'
  }, {
    type: 'separator'
  }, {
    label: 'Cut',
    accelerator: 'CmdOrCtrl+X',
    role: 'cut'
  }, {
    label: 'Copy',
    accelerator: 'CmdOrCtrl+C',
    role: 'copy'
  }, {
    label: 'Paste',
    accelerator: 'CmdOrCtrl+V',
    role: 'paste'
  }, {
    label: 'Select All',
    accelerator: 'CmdOrCtrl+A',
    role: 'selectall'
  }]
}, {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: (item, focusedWindow: BrowserWindow) => {
      if (focusedWindow) {
        if (focusedWindow.id === 1) {
          BrowserWindow.getAllWindows().forEach(win => {
            if (win.id > 1) win.close()
          })
        }

        focusedWindow.reload()
      }
    }
  }, {
    label: 'Toggle Full Screen',
    accelerator: (() => {
      if (process.platform === 'darwin') {
        return 'Ctrl+Command+F'
      } else {
        return 'F11'
      }
    })(),
    click: (item, focusedWindow: BrowserWindow) => {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
      }
    }
  }, {
    label: 'Toggle Developer Tools',
    accelerator: (() => {
      if (process.platform === 'darwin') {
        return 'Alt+Command+I'
      } else {
        return 'Ctrl+Shift+I'
      }
    })(),
    click: (item, focusedWindow: BrowserWindow) => {
      if (focusedWindow) {
        focusedWindow.webContents.toggleDevTools()
      }
    }
  }, {
    type: 'separator'
  }, {
    label: 'Author',
    click: function (item, focusedWindow: BrowserWindow) {
      if (focusedWindow) {
        const options = {
          type: 'info',
          title: 'Author',
          buttons: ['Ok'],
          message: 'This application was made by jasonhaxstuff, an aspiring developer.'
        }
        dialog.showMessageBox(focusedWindow, options, function () { return })
      }
    }
  }]
}, {
  label: 'Window',
  role: 'window',
  submenu: [{
    label: 'Minimize',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize'
  }, {
    label: 'Close',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  }, {
    type: 'separator'
  }, {
    label: 'Reopen Window',
    accelerator: 'CmdOrCtrl+Shift+T',
    enabled: false,
    key: 'reopenMenuItem',
    click: () => {
      app.emit('activate')
    }
  }]
}, {
  label: 'Help',
  role: 'help',
  submenu: [{
    label: 'Source',
    click: () => {
      shell.openExternal('https://github.com/jasonhaxstuff/nightwatchgui')
    }
  }]
}]
