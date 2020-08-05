import React, { useCallback, useEffect, useRef } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

import styles from './CodeEditor.module.scss'


let codeOutput = undefined

export const CodeEditor = ({ name, onChange, value, placeholder, mode, theme, onLoad }) => {

  useEffect(() => {
    // SyntaxHighligher doesn't support ref :/
    codeOutput = document.querySelector(`#${name}`)
  }, [name])

  const codeInput = useRef()
  const onScroll = useCallback(e => {
    e.preventDefault()
    const { target } = e
    const deltaY = Math.sign(e.deltaY) * 40
    const deltaX = Math.sign(e.deltaX) * 10
    target.scrollTop += deltaY
    target.scrollLeft += deltaX
    codeOutput.scrollTop = target.scrollTop
    codeOutput.scrollLeft = target.scrollLeft
  }, [])
  useEffect(() => {
    // noinspection JSUnresolvedFunction
    codeInput.current.addEventListener('wheel', onScroll, { passive: false })
    if ( onLoad ) onLoad(codeInput.current)
  }, [onLoad, onScroll])

  const handleLongLines = () => {
    if ( codeOutput ) {
      // noinspection JSUnresolvedVariable
      codeOutput.scrollLeft = codeInput.current.scrollLeft
      // noinspection JSUnresolvedVariable
      codeOutput.scrollTop = codeInput.current.scrollTop
    }
  }
  const handleLongLinesOnArrowMove = e => {
    if ( ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) ) {
      setTimeout(handleLongLines, 20)
    }
  }
  const handleLongLinesOnChange = e => {
    if ( onChange ) onChange(e)
    setTimeout(handleLongLines, 20)
  }

  const lineDigits = value.split('\n').length.toString().length
  return (
    <div className={styles.codeEditor}>
      <textarea
        ref={codeInput}
        placeholder={placeholder}
        style={{
          marginLeft: `calc(2rem + ${lineDigits}ch)`,
          width: `calc(100% - 2rem - ${lineDigits}ch)`
        }}
        spellCheck={false}
        value={value}
        // handle scroll on keyboard interaction
        onChange={handleLongLinesOnChange}
        onKeyDown={handleLongLinesOnArrowMove}
        // handle scroll on text selection drag
        onMouseDown={() => window.addEventListener('mousemove', handleLongLines)}
        onMouseUp={() => window.removeEventListener('mousemove', handleLongLines)}
      />
      <SyntaxHighlighter
        id={name}
        className={styles.codeOutput}
        language={mode}
        style={theme}
        showLineNumbers
        showInlineLineNumbers
        lineNumberStyle={{
          textAlign: 'right',
          margin: '0 16px',
          padding: 0,
          minWidth: `${lineDigits}ch`
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}