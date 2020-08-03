import React, { useState } from 'react'
import Split from 'react-split'
import { client } from './api/client'
import { CodePanel, RightPanel } from './components'

import styles from './App.module.scss'

const App = () => {

  const name = 'name' in localStorage ? localStorage.name : (() => {
    const name = prompt('What\'s your name?')
    localStorage.name = name
    return name
  })()

  const [programOutput, setProgramOutput] = useState()
  const runProgram = async code => {
    const response = await client.post('/api/check_length', { code })
    setProgramOutput(response.status)
  }

  const [innerWidth, setInnerWidth] = useState(window.innerWidth)
  window.onresize = () => {
    const newWidth = window.innerWidth
    if ( innerWidth > 640 && newWidth < 640 ) setInnerWidth(newWidth)  // re-render when hit <640
    if ( innerWidth < 640 && newWidth > 640 ) setInnerWidth(newWidth)  // re-render when hit >640
    Array.from(document.getElementsByClassName(styles.split)).forEach(item => {
      item.removeAttribute('style')  // also clear inner styling
    })
  }
  const directionVertical = innerWidth <= 640

  return (
    <>
      <Split
        direction={directionVertical ? 'vertical' : 'horizontal'}
        minSize={directionVertical ? 200 : 315}
        snapOffset={0}
        className={styles.workspace}
        gutter={() => {
          const gutter = document.createElement('div')
          gutter.className = styles.gutter
          return gutter
        }}
      >
        <div className={styles.split}>
          <CodePanel runProgram={runProgram}/>
        </div>
        <div className={styles.split}>
          <RightPanel output={programOutput}/>
        </div>
      </Split>
      <div className={styles.footer}>
        {name}
      </div>
    </>
  );
}

export default App
