import React, { useState } from 'react'
import { twilight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { CodeEditor } from '..';


export const InterviewerNotes = () => {

  const [currentNote, setCurrentNote] = useState('interviewerNotes' in localStorage ? localStorage.interviewerNotes : '')

  const changeNote = value => {
    localStorage.interviewerNotes = value
    setCurrentNote(value)
  }

  return (
    <CodeEditor
      name='noteEditor'
      onChange={e => {
        changeNote(e.target.value)
      }}
      value={currentNote}
      mode='markdown'
      theme={twilight}
      placeholder='Write your notes here'
    />
  )
}