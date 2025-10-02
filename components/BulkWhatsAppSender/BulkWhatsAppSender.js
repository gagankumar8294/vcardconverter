'use client';

import { useState } from 'react';
import styles from './BulkWhatsAppSender.module.css';

export default function BulkWhatsAppSender() {
  const [rawNumbers, setRawNumbers] = useState('');
  const [numbersList, setNumbersList] = useState([]);
  const [message, setMessage] = useState('');

  // Parse raw numbers and populate editable fields
  function handleParseNumbers() {
    if (!rawNumbers) return;

    const lines = rawNumbers
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const parsed = lines.map(line => {
      let country = '';
      let number = line;

      const match = line.match(/^\+(\d{1,3})\s*(.*)/);
      if (match) {
        country = '+' + match[1];
        number = match[2].replace(/\s+/g, '');
      } else {
        number = line.replace(/\s+/g, '');
      }

      return { country, number, clickCount: 0, clicked: false };
    });

    setNumbersList(parsed);
  }

  // Update number or country code
  function updateNumber(idx, field, value) {
    setNumbersList(prev => {
      const copy = [...prev];
      copy[idx][field] = value;
      return copy;
    });
  }

  // Open WhatsApp chat for a specific number and update click state
  function openWhatsApp(idx) {
    setNumbersList(prev => {
      const copy = [...prev];
      const numObj = copy[idx];

      let fullNumber = numObj.country + numObj.number;
      if (!numObj.country) fullNumber = numObj.number;

      const url = `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');

      copy[idx].clickCount += 1;
      copy[idx].clicked = true;
      return copy;
    });
  }

  // Clear message input
  function clearMessage() {
    setMessage('');
  }

  // Clear all numbers
  function clearNumbers() {
    setRawNumbers('');
    setNumbersList([]);
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Bulk WhatsApp Sender</h2>

      <div className={styles.inputBox}>
        <label className={styles.label}>Enter numbers (one per line)</label>
        <textarea
          className={styles.textarea}
          rows={6}
          value={rawNumbers}
          onChange={(e) => setRawNumbers(e.target.value)}
          placeholder="+91 99322 27459&#10;+91 99953 32964&#10;99972 71333"
        ></textarea>
        <div className={styles.buttonGroup}>
          <button className={styles.parseBtn} onClick={handleParseNumbers}>Parse Numbers</button>
          <button className={styles.clearBtn} onClick={clearNumbers}>Clear Numbers</button>
        </div>
      </div>

      {numbersList.length > 0 && (
        <>
          <div className={styles.messageBox}>
            <label className={styles.label}>WhatsApp Message</label>
            <textarea
              className={styles.textarea}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message to send..."
            ></textarea>
            <button className={styles.clearMsgBtn} onClick={clearMessage}>Clear Message</button>
          </div>

          <div className={styles.numbersContainer}>
            {numbersList.map((item, idx) => (
              <div key={idx} className={styles.numberRow}>
                <div className={styles.index}>{idx + 1}.</div>

                <input
                  type="text"
                  value={item.country}
                  placeholder="Country Code"
                  className={`${styles.countryInput} ${!item.country ? styles.missingCountry : ''}`}
                  onChange={(e) => updateNumber(idx, 'country', e.target.value)}
                />

                <input
                  type="text"
                  value={item.number}
                  placeholder="Phone Number"
                  className={styles.numberInput}
                  onChange={(e) => updateNumber(idx, 'number', e.target.value)}
                />

                <button
                  className={`${styles.whatsappBtn} ${item.clicked ? styles.clicked : ''}`}
                  onClick={() => openWhatsApp(idx)}
                >
                  WhatsApp {item.clickCount > 0 && `(${item.clickCount})`}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
