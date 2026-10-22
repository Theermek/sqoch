import { useState } from 'react';

import { isSoldOutMode, setSoldOutMode } from '../api/mockApi';

export function DemoPanel() {
  const [soldOut, setSoldOut] = useState(isSoldOutMode);
  const [open, setOpen] = useState(false);

  function toggleMode(value: boolean) {
    setSoldOutMode(value);
    setSoldOut(value);
  }

  return (
    <aside className={`demo${open ? ' demo--open' : ''}`}>
      <button type="button" className="demo__toggle" onClick={() => setOpen(!open)}>
        Demo{soldOut ? ' · sold out' : ''}
      </button>
      {open && (
        <div className="demo__body">
          <p className="demo__title">Режим мок-API</p>
          <label className="demo__option">
            <input
              type="radio"
              name="demo-mode"
              checked={!soldOut}
              onChange={() => toggleMode(false)}
            />
            Обычный
          </label>
          <label className="demo__option">
            <input
              type="radio"
              name="demo-mode"
              checked={soldOut}
              onChange={() => toggleMode(true)}
            />
            Места закончатся при подтверждении
          </label>
          <p className="demo__hint">То же даёт параметр ?soldout=1</p>
        </div>
      )}
    </aside>
  );
}
