import { app, BrowserWindow, Menu, autoUpdater, ipcMain, MenuItem } from 'electron'
import { friendlyOsName } from './util'
import { template } from './template'

let mainWindow: BrowserWindow | null

function createWindow () {
  app.setName('Nightwatch GUI')
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false
    }
  })

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  mainWindow.loadURL(`http://www.nightwatch.ga`)
  mainWindow.setTitle(`Nightwatch GUI - ${friendlyOsName(process.platform)}`)

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  mainWindow.on('page-title-updated', function (event) {
    event.preventDefault()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  const reopenMenuItem = findReopenMenuItem()
  if (reopenMenuItem) reopenMenuItem.enabled = true

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('open-url', (event, url) => {
  console.log(`Redirected to: ${url}`)
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

const menu = new Menu()
menu.append(new MenuItem({ label: `Nightwatch GUI v${app.getVersion()}`, enabled: false }))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({
  label: 'Copy',
  accelerator: 'CmdOrCtrl+C',
  role: 'copy'
}))
menu.append(new MenuItem({
  label: 'Paste',
  accelerator: 'CmdOrCtrl+V',
  role: 'paste'
}))
menu.append(new MenuItem({
  label: 'Inspect element',
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
}))

app.on('browser-window-created', (event, win) => {
  win.webContents.on('context-menu', (e, params) => {
    menu.popup({ window: win, x: params.x, y: params.y })
  })
})

ipcMain.on('show-context-menu', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  menu.popup({ window: win })
})

function addUpdateMenuItems (items, position) {
  if (process.mas) return

  const version = app.getVersion()
  const updateItems = [{
    label: `Version ${version}`,
    enabled: false
  }, {
    label: 'Checking for Update',
    enabled: false,
    key: 'checkingForUpdate'
  }, {
    label: 'Check for Update',
    visible: false,
    key: 'checkForUpdate',
    click: () => {
      autoUpdater.checkForUpdates()
    }
  }, {
    label: 'Restart and Install Update',
    enabled: true,
    visible: false,
    key: 'restartToUpdate',
    click: () => {
      autoUpdater.quitAndInstall()
    }
  }]

  items.splice.apply(items, [position, 0].concat(updateItems))
}

function findReopenMenuItem () {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  let reopenMenuItem

  menu.items.forEach((item: any) => {
    if (item.submenu) {
      (item.submenu as Menu).items.forEach((item: any) => {
        if (item.key === 'reopenMenuItem') {
          reopenMenuItem = item
        }
      })
    }
  })

  return reopenMenuItem
}

if (process.platform === 'darwin') {
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [{
      label: `About ${name}`,
      role: 'about'
    }, {
      type: 'separator'
    }, {
      label: 'Services',
      role: 'services',
      submenu: []
    }, {
      type: 'separator'
    }, {
      label: `Hide ${name}`,
      accelerator: 'Command+H',
      role: 'hide'
    }, {
      label: 'Hide Others',
      accelerator: 'Command+Alt+H',
      role: 'hideothers'
    }, {
      label: 'Show All',
      role: 'unhide'
    }, {
      type: 'separator'
    }, {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: () => {
        app.quit()
      }
    }]
  })

  template[3].submenu.push({
    type: 'separator'
  }, {
    label: 'Bring All to Front',
    role: 'front'
  })

  addUpdateMenuItems(template[0].submenu, 1)
}

if (process.platform === 'win32') {
  const helpMenu = template[template.length - 1].submenu
  addUpdateMenuItems(helpMenu, 0)
}
