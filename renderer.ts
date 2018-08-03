import { ipcRenderer } from 'electron'

const discordLoginButton = document.getElementById('discordLoginButton')
const newLoginButton = discordLoginButton.cloneNode(true)
discordLoginButton.parentNode.replaceChild(newLoginButton, discordLoginButton)

discordLoginButton.addEventListener('click', () => {
  const reply = ipcRenderer.sendSync('sync', 'login')
  const message = `Synchronous message reply: ${reply}`

  console.log(message)
})
