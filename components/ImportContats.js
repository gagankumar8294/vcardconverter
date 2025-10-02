'use client'

import { useState } from 'react';

export default function ImportContacts() {
  const [contacts, setContacts] = useState([]);

  async function handleImportContacts() {
    try {
      if ('contacts' in navigator && 'select' in navigator.contacts) {
        // Ask for name, tel, and email
        const props = ['name', 'tel', 'email'];
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
    <div style={{ padding: '20px' }}>
      <button
        onClick={handleImportContacts}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '8px',
          border: 'none',
          background: '#4CAF50',
          color: 'white',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Import Contacts
      </button>

      <div>
        {contacts.length > 0 ? (
          <div style={{ display: 'grid', gap: '15px' }}>
            {contacts.map((c, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  borderRadius: '10px',
                  background: '#f9f9f9',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <h3 style={{ margin: '0 0 10px 0' }}>
                  {c.name ? c.name.join(', ') : 'Unnamed Contact'}
                </h3>

                {c.tel && c.tel.length > 0 && (
                  <p>
                    📞 <strong>{c.tel.join(', ')}</strong>
                  </p>
                )}

                {c.email && c.email.length > 0 && (
                  <p>
                    📧 <strong>{c.email.join(', ')}</strong>
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No contacts imported yet.</p>
        )}
      </div>
    </div>
  );
}
