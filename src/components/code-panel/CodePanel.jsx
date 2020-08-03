import React, { useCallback, useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import { SelectPopup } from './components'

import styles from './CodePanel.module.scss'
import { ReactComponent as ArrowSVG } from './media/arrow.svg'

import 'ace-builds/src-min-noconflict/theme-twilight'
import 'ace-builds/src-min-noconflict/mode-python'
import 'ace-builds/src-min-noconflict/mode-javascript'
import 'ace-builds/src-min-noconflict/mode-java'
import 'ace-builds/src-min-noconflict/mode-c_cpp'
import 'ace-builds/src-min-noconflict/mode-plain_text'
import 'ace-builds/src-min-noconflict/mode-golang'
import 'ace-builds/src-min-noconflict/ext-language_tools'

const languages = {
  ids: ['c_cpp', 'golang', 'java', 'javascript', 'plain_text', 'python'],
  entities: {
    python: { name: 'Python', commentToken: '#' },
    javascript: { name: 'JavaScript', commentSymbol: '//' },
    java: { name: 'Java', commentToken: '//' },
    c_cpp: { name: 'C++', commentToken: '//' },
    plain_text: { name: 'Plain Text', commentToken: '' },
    golang: { name: 'Go', commentToken: '//' }
  }
}

let editorInstance = undefined;

export const CodePanel = ({ runProgram }) => {
  const getCodeByLang = lang => lang in localStorage ? localStorage[lang] : (() => {
    localStorage[lang] = ''
    return ''
  })()

  const [currentLang, setCurrentLang] = useState('plain_text')
  const [currentCode, setCurrentCode] = useState(getCodeByLang(currentLang))

  useEffect(() => {
    if ( !currentCode ) editorInstance.setValue('', -1)
    // need to use this effect if only the lang is changed, not code (or it'll break autocomplition)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLang])

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
    if ( e.ctrlKey && e.key === 'k' ) {
      e.preventDefault()
      const { commentToken } = languages.entities[currentLang]
      const startRow = editorInstance.selection.getAnchor().row
      const endRow = editorInstance.selection.getCursor().row
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
    editorInstance.commands.removeCommand('findnext')  // to free the Ctrl+K shortcut
    window.addEventListener('keydown', commentCode)
    return () => window.removeEventListener('keydown', commentCode)
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
      <AceEditor
        onChange={changeCode}
        onLoad={(editor => {
          editorInstance = editor
        })}
        value={currentCode}
        style={{
          width: '100%',
          height: 'calc(100% - 56px)'
        }}
        placeholder='Write your code here'
        mode={currentLang}
        theme='twilight'
        name='codeEditor'
        fontSize={14}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          cursorStyle: 'smooth',
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 4,
        }}/>
    </div>
  )
}
