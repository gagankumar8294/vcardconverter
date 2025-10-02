'use client'

import { useState } from 'react';

export default function ImportContacts() {
  const [contacts, setContacts] = useState([]);

  async function handleImportContacts() {
    try {
      if ('contacts' in navigator && 'select' in navigator.contacts) {
        // Fields you want to fetch
        const props = ['name', 'email', 'tel'];
        const opts = { multiple: true };

        const selectedContacts = await navigator.contacts.select(props, opts);
        setContacts(selectedContacts);
      } else {
        alert('Contacts API not supported on this device/browser.');
      }
    } catch (err) {
      console.error('Error selecting contacts:', err);
    }
  }

  return (
    <div>
      <button onClick={handleImportContacts}>
        Import Contacts
      </button>

      <div style={{ marginTop: '15px' }}>
        {contacts.length > 0 ? (
          <ul>
            {contacts.map((c, idx) => (
              <li key={idx}>
                <strong>{c.name ? c.name.join(', ') : 'No Name'}</strong> <br />
                {c.tel ? c.tel.join(', ') : 'No Number'}
              </li>
            ))}
          </ul>
        ) : (
          <p>No contacts imported yet.</p>
        )}
      </div>
    </div>
  );
}
