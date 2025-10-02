// This is a Next.js-compatible React component (JS only, no TypeScript)
// CSS is modular (VCardViewer.module.css) and no external libraries are required
'use client'

import { useState, useMemo } from 'react';
import styles from './VCardViewer.module.css';

export default function VCardViewer() {
  const [rawText, setRawText] = useState('');
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState('');

  function parseVCard(text) {
    if (!text) return [];

    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    const unfolded = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.match(/^[ \t]/) && unfolded.length > 0) {
        unfolded[unfolded.length - 1] += line.replace(/^[ \t]+/, '');
      } else {
        unfolded.push(line);
      }
    }

    const rawCards = [];
    let current = null;
    for (const line of unfolded) {
      if (/^BEGIN:VCARD/i.test(line)) {
        current = [];
        continue;
      }
      if (/^END:VCARD/i.test(line)) {
        if (current) rawCards.push(current.join('\n'));
        current = null;
        continue;
      }
      if (current !== null) current.push(line);
    }

    const parsed = rawCards.map(function(cardText) {
      var obj = { fn: '', n: '', org: '', title: '', emails: [], phones: [], addresses: [], notes: '', raw: cardText };
      var lines = cardText.split('\n');
      lines.forEach(function(l) {
        var idx = l.indexOf(':');
        if (idx === -1) return;
        var left = l.slice(0, idx);
        var value = l.slice(idx + 1);
        var prop = left.split(';')[0].toUpperCase();
        switch(prop) {
          case 'FN': obj.fn = value; break;
          case 'N': obj.n = value; break;
          case 'ORG': obj.org = value; break;
          case 'TITLE': obj.title = value; break;
          case 'EMAIL': obj.emails.push(value); break;
          case 'TEL': obj.phones.push(value); break;
          case 'ADR': obj.addresses.push(value); break;
          case 'NOTE': obj.notes += (obj.notes ? '\n' : '') + value; break;
        }
      });
      if (!obj.fn) {
        if (obj.n) {
          var parts = obj.n.split(';');
          obj.fn = ((parts[1] || '') + ' ' + (parts[0] || '')).trim();
        } else obj.fn = 'Unknown';
      }
      return obj;
    });

    return parsed;
  }

  function handleFile(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function() {
      var text = reader.result;
      setRawText(text);
      setContacts(parseVCard(text));
    };
    reader.readAsText(file, 'utf-8');
  }

  function handlePasteText() {
    setContacts(parseVCard(rawText));
  }

  function downloadCSV() {
    if (!contacts.length) return;
    var headers = ['Name','Organization','Title','Emails','Phones','Addresses','Notes'];
    var rows = contacts.map(function(c) {
      return [c.fn,c.org,c.title,c.emails.join('|'),c.phones.join('|'),c.addresses.join('|'),c.notes.replace(/\n/g,' / ')].map(csvEscape).join(',');
    });
    var csv = [headers.join(','), ...rows].join('\n');
    var blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'contacts.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  function csvEscape(s) {
    if (s == null) return '""';
    var str = String(s);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"'+str.replace(/"/g,'""')+'"';
    }
    return '"'+str+'"';
  }

  var filtered = useMemo(function() {
    if (!query) return contacts;
    var q = query.toLowerCase();
    return contacts.filter(function(c) {
      return (c.fn && c.fn.toLowerCase().includes(q)) || (c.org && c.org.toLowerCase().includes(q)) || c.emails.some(function(e){ return e.toLowerCase().includes(q); }) || c.phones.some(function(p){ return p.toLowerCase().includes(q); });
    });
  }, [contacts, query]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>vCard Viewer</h1>

      <div className={styles.uploadBox}>
        <label>Upload .vcf file</label>
        <input type="file" accept=".vcf,text/vcard,text/x-vcard" onChange={handleFile} />
        <div className={styles.textareaNote}>Or paste vCard text below and click &quot;Parse&quot;</div>
        <textarea
          rows={6}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste raw vCard text here..."
          className={styles.textarea}
        ></textarea>
        <div className={styles.buttonRow}>
          <button onClick={handlePasteText}>Parse</button>
          <button onClick={() => {setRawText(''); setContacts([]);}}>Clear</button>
          <button onClick={downloadCSV}>Download CSV</button>
        </div>
      </div>

      <div className={styles.searchRow}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email or phone"
          className={styles.searchInput}
        />
        <div className={styles.count}>{filtered.length} contact(s)</div>
      </div>

      <div className={styles.cardGrid}>
        {filtered.map((c, idx) => (
          <div key={idx} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>{(c.fn || 'U').charAt(0)}</div>
              <div className={styles.cardInfo}>
                <div className={styles.cardName}>{c.fn}</div>
                {c.title && <div className={styles.cardSub}>{c.title}</div>}
                {c.org && <div className={styles.cardSub}>{c.org}</div>}
              </div>
            </div>
            <div className={styles.cardDetails}>
              {c.phones.length>0 && (
                <div>
                  <div className={styles.fieldTitle}>Phones</div>
                  <ul>{c.phones.map((p,i) => <li key={i}>{p}</li>)}</ul>
                </div>
              )}
              {c.emails.length>0 && (
                <div>
                  <div className={styles.fieldTitle}>Emails</div>
                  <ul>{c.emails.map((e,i) => <li key={i}>{e}</li>)}</ul>
                </div>
              )}
              {c.addresses.length>0 && (
                <div>
                  <div className={styles.fieldTitle}>Addresses</div>
                  <ul>{c.addresses.map((a,i) => <li key={i}>{a}</li>)}</ul>
                </div>
              )}
              {c.notes && (
                <div>
                  <div className={styles.fieldTitle}>Notes</div>
                  <div className={styles.notes}>{c.notes}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {contacts.length === 0 && (
        <div className={styles.noContacts}>
          No contacts loaded yet — upload a .vcf file or paste vCard text above.
        </div>
      )}
    </div>
  );
}
