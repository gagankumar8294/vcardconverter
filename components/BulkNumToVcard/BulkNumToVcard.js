'use client'
import { useState } from 'react';

export default function BulkNumberToVCard() {
  const [numbersText, setNumbersText] = useState('');
  const [vcardText, setVcardText] = useState('');

  const handleConvert = () => {
    const numbers = numbersText
      .split(/\r?\n/)
      .map(n => n.trim())
      .filter(n => n);
    const vcards = numbers.map((num, index) => {
      return `BEGIN:VCARD
VERSION:3.0
FN:Contact ${index + 1}
TEL;TYPE=CELL:${num}
END:VCARD`;
    });
    setVcardText(vcards.join('\n'));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(vcardText);
    alert('vCard copied to clipboard!');
  };

  const handleDownload = () => {
    if (!vcardText) return;
    const blob = new Blob([vcardText], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.vcf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', color: 'var(--foreground)' }}>
      <h2>Bulk Numbers to vCard</h2>
      <textarea
        rows={8}
        placeholder="Enter numbers, one per line"
        value={numbersText}
        onChange={e => setNumbersText(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          background: 'var(--background)',
          color: 'var(--foreground)',
        }}
      />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          onClick={handleConvert}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '4px',
            border: 'none',
            background: '#3498db',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Convert to vCard
        </button>
        <button
          onClick={handleCopy}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '4px',
            border: 'none',
            background: '#2ecc71',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Copy vCard
        </button>
        <button
          onClick={handleDownload}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '4px',
            border: 'none',
            background: '#e67e22',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Download vCard
        </button>
      </div>
      {vcardText && (
        <textarea
          rows={8}
          readOnly
          value={vcardText}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            background: 'var(--background)',
            color: 'var(--foreground)',
          }}
        />
      )}
    </div>
  );
}
