const logLabel = 'matoruru/chrome-extensions-auto-microsoft-2fa: '

const appLog = (...args) => console.log(`${logLabel} `, ...args)

const intervalTime = 50

const checkTitle = () => {
  return new Promise((resolve, reject) => {
    const timerId = setInterval(() => {
      const titleElements = document.getElementsByClassName('row text-title')

      if (titleElements.length == 0) return

      const title = titleElements.item(0)

      clearInterval(timerId)

      if (title.textContent.includes('Verify your identity')) {
        resolve()
      } else {
        reject(`Title is not correct ("${title.textContent}"). This migit be another page!`)
      }
    }, intervalTime)
  })
}

const getButtons = () => {
  return new Promise((resolve, reject) => {
    const timerId = setInterval(() => {
      const buttonsElements = document.getElementsByClassName('table')

      if (buttonsElements.length == 0) return

      const textButton = buttonsElements.item(0)
      const callButton = buttonsElements.item(1)

      clearInterval(timerId)

      if (textButton.textContent.includes('Text +') && callButton.textContent.includes('Call +')) {
        resolve({textButton, callButton})
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

  //callButton.click()
  appLog('Selected button clicked!')
}

const main = (e) => {
  appLog('Microsoft 2FA page detected!')
  app().catch(e => {
    appLog('Something went wrong! Reason: ', e)
  })
};

window.addEventListener("load", main, false);