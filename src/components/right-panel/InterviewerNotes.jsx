import React, { useState } from 'react'
import AceEditor from 'react-ace';

import 'ace-builds/src-min-noconflict/theme-twilight'
import 'ace-builds/src-min-noconflict/mode-markdown'
import 'ace-builds/src-min-noconflict/ext-language_tools'

export const InterviewerNotes = () => {

  const [currentNote, setCurrentNote] = useState('interviewerNotes' in localStorage ? localStorage.interviewerNotes : '')

  const onNoteChange = value => {
    localStorage.interviewerNotes = value
    setCurrentNote(value)
  }

  return (
    <AceEditor
      onChange={onNoteChange}
      value={currentNote}
      style={{
        width: '100%',
        height: '100%'
      }}
      placeholder='Write your notes here'
      mode='markdown'
      theme='twilight'
      name='nodeEditor'
      fontSize={14}
      showPrintMargin={false}
      showGutter={false}
      highlightActiveLine={true}
      setOptions={{
        cursorStyle: 'smooth',
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: false,
        showLineNumbers: false,
        tabSize: 2
      }}/>
  )
}