const logLabel = 'matoruru/chrome-extensions-auto-microsoft-2fa: '

const appLog = (...args) => console.log(`${logLabel} `, ...args)

const intervalTime = 50

const hasText = (elem, s) => elem.textContent.includes(s)

const pickElement = (elems, s) => elems.filter(elem => hasText(elem, s))[0]

const checkTitle = () => {
  return new Promise((resolve, reject) => {
    const timerId = setInterval(() => {
      const title = document.querySelector('[role=heading]')

      if (!title) return

      clearInterval(timerId)

      if (hasText(title, 'Verify your identity')) {
        resolve()
      } else {
        reject(`Title is not correct (Expected "Verify your identity" but "${title.textContent}"). This migit be another page!`)
      }
    }, intervalTime)
  })
}

const getButtons = () => {
  return new Promise((resolve, reject) => {
    const timerId = setInterval(() => {
      const buttonsElements = Array.from(document.querySelectorAll('div.table[role=button]'))

      if (buttonsElements.length == 0) return

      const textButton = pickElement(buttonsElements, 'Text +')
      const callButton = pickElement(buttonsElements, 'Call +')

      clearInterval(timerId)

      if (textButton || callButton) {
        resolve({ textButton, callButton })
      } else {
        reject('Buttons are not existing as expected!')
      }
    }, intervalTime)
  })
}

const app = async () => {
  // Check if the title is "Verify your identity".
  await checkTitle()

  // Expecting the UI that looks like:
  //
  // Verify your identity
  //   Text +XX XXXXXXX92   <--- textButton
  //   Call +XX XXXXXXX92   <--- callButton
  //
  const { textButton, callButton } = await getButtons()

  const priorityOrderButtons = [
    callButton,
    textButton
  ]

  for (const button of priorityOrderButtons) {
    if (button) {
      button.click()
      appLog(`Selected button clicked!`)
      return
    }
  }
}

const main = (e) => {
  appLog('Microsoft 2FA page detected!')
  app().catch(e => {
    appLog('Something went wrong! Reason: ', e)
  })
};

window.addEventListener("load", main, false);