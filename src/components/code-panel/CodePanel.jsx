import React, { useCallback, useEffect, useState } from 'react'
import { CodeEditor } from '..';
import { twilight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { SelectPopup } from './components'

import styles from './CodePanel.module.scss'
import { ReactComponent as ArrowSVG } from './media/arrow.svg'


const languages = {
  ids: ['cpp', 'go', 'java', 'javascript', 'plain_text', 'python'],
  entities: {
    python: { name: 'Python', commentToken: '#' },
    javascript: { name: 'JavaScript', commentSymbol: '//' },
    java: { name: 'Java', commentToken: '//' },
    cpp: { name: 'C++', commentToken: '//' },
    plain_text: { name: 'Plain Text', commentToken: '' },
    go: { name: 'Go', commentToken: '//' }
  }
}

let editorInstance = undefined

export const CodePanel = ({ runProgram }) => {
  const getCodeByLang = lang => lang in localStorage ? localStorage[lang] : (() => {
    localStorage[lang] = ''
    return ''
  })()

  const [currentLang, setCurrentLang] = useState('plain_text')
  const [currentCode, setCurrentCode] = useState(getCodeByLang(currentLang))

  const selectLang = lang => {
    setCurrentLang(lang)
    const newCode = getCodeByLang(lang)
    setCurrentCode(newCode)
  }

  const changeCode = useCallback(value => {
    localStorage[currentLang] = value
    setCurrentCode(value)
  }, [currentLang])

  const commentCode = useCallback(e => {
    if ( e.ctrlKey && (e.key === 'k' || e.key === 'л') ) {
      e.preventDefault()
      const { commentToken } = languages.entities[currentLang]
      const { selectionStart, selectionEnd } = editorInstance
      const startRow = Array.from(currentCode).slice(0, selectionStart).filter(c => c === '\n').length
      const endRow = Array.from(currentCode).slice(0, selectionEnd).filter(c => c === '\n').length
      const commentedCode = currentCode.split('\n').map((item, index) => {
        if ( startRow <= index && index <= endRow && commentToken ) {
          if ( item.startsWith(commentToken) ) {
            return item.replace(`${commentToken} `, '')
          }
          return `${commentToken} ${item}`
        }
        return item
      }).join('\n')
      changeCode(commentedCode)
    }
  }, [changeCode, currentCode, currentLang])
  useEffect(() => {
    editorInstance.addEventListener('keydown', commentCode)
    return () => editorInstance.removeEventListener('keydown', commentCode)
  }, [commentCode])

  return (
    <div className={styles.codePanel}>
      <div className={styles.header}>
        <button
          onClick={() => {
            runProgram(currentCode)
          }}
          className={styles.runButton}
        >
          <span>Run</span>
          <ArrowSVG/>
        </button>
        <SelectPopup
          className={styles.selectLang}
          display={languages.entities[currentLang].name}
          variants={languages}
          onSelect={selectLang}
        />
      </div>
      <CodeEditor
        name='codeEditor'
        onChange={e => {
          changeCode(e.target.value)
        }}
        value={currentCode}
        mode={currentLang}
        theme={twilight}
        placeholder='Write your code here'
        onLoad={editor => editorInstance = editor}
      />
    </div>
  )
}
