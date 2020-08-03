import React, { useState } from 'react'
import { InterviewerNotes } from './InterviewerNotes';

import styles from './RightPanel.module.scss'

export const RightPanel = ({ output }) => {

  const [currentTab, setCurrentTab] = useState('programOutput')
  const programOutputTab = currentTab === 'programOutput'
  const interviewerNotesTab = currentTab === 'interviewerNotes'

  return (
    <div className={styles.rightPanel}>
      <div className={styles.header}>
        <button
          className={programOutputTab ? styles.buttonActive : undefined}
          onClick={() => {
            setCurrentTab('programOutput')
          }}
        >
          Program Output
        </button>
        <button
          className={interviewerNotesTab ? styles.buttonActive : undefined}
          onClick={() => {
            setCurrentTab('interviewerNotes')
          }}>
          Interviewer Notes
        </button>
      </div>
      <div className={styles.tabWrapper}>
        {programOutputTab &&
        <div className={styles.programOutput}>
          {!output ? <span>Press "Run" to see results</span> : output}
        </div>
        }
        {interviewerNotesTab && <InterviewerNotes/>}
      </div>
    </div>
  )
}