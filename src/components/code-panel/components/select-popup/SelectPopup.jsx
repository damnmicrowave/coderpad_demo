import React, { useState } from 'react';

import styles from './SelectPopup.module.scss'
import { ReactComponent as ArrowSVG } from '../../media/arrow.svg';

export const SelectPopup = ({ display, variants, onSelect, ...props }) => {

  const [visible, setVisible] = useState(false)
  const toggle = () => {
    setVisible(!visible)
  }

  return (
    <div {...props}>
      <div className={styles.wrapper}>
        <button className={styles.selectButton} onClick={toggle}>
          <span>{display}</span>
          <ArrowSVG/>
        </button>
        {visible && <div className={styles.popup}>
          <ArrowSVG/>
          {variants.ids.map((item, index) => (
            <button className={styles.item} key={index} onClick={() => {
              onSelect(item)
              toggle()
            }}>
              {variants.entities[item].name}
            </button>
          ))}
        </div>
        }
      </div>
    </div>
  )
}