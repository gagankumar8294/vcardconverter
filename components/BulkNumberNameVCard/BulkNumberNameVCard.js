'use client'
import { useState } from "react";

export default function BulkNumberNameVCard() {
  const [bulkText, setBulkText] = useState("");
  const [contacts, setContacts] = useState([]);
  const [vcardFilename, setVcardFilename] = useState("contacts");

  const handleParseNumbers = () => {
    const numbers = bulkText
      .split(/\r?\n/)
      .map((n) => n.trim())
      .filter((n) => n);
    const newContacts = numbers.map((num) => ({ number: num, name: "" }));
    setContacts(newContacts);
  };

  const handleNumberChange = (index, value) => {
    const updated = [...contacts];
    updated[index].number = value;
    setContacts(updated);
  };

  const handleNameChange = (index, value) => {
    const updated = [...contacts];
    updated[index].name = value;
    setContacts(updated);
  };

  const handleDownloadVCard = () => {
    if (contacts.length === 0) return;

    const vcards = contacts.map(
      (c) =>
        `BEGIN:VCARD
VERSION:3.0
FN:${c.name || "Unknown"}
TEL;TYPE=CELL:${c.number}
END:VCARD`
    );
    const blob = new Blob([vcards.join("\n")], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${vcardFilename}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "24px", color: "var(--foreground)" }}>
      <h2>Bulk Numbers with Names to vCard</h2>

      <textarea
        rows={6}
        placeholder="Enter numbers, one per line"
        value={bulkText}
        onChange={(e) => setBulkText(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "12px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      />
      <button
        onClick={handleParseNumbers}
        style={{
          padding: "8px 16px",
          marginBottom: "16px",
          borderRadius: "4px",
          border: "none",
          background: "#3498db",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Generate Contact Fields
      </button>

      {contacts.length > 0 && (
        <>
          <div style={{ marginBottom: "12px" }}>
            <label>
              vCard File Name:{" "}
              <input
                type="text"
                value={vcardFilename}
                onChange={(e) => setVcardFilename(e.target.value)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  width: "200px",
                  marginLeft: "8px",
                }}
              />
            </label>
          </div>

          {contacts.map((c, idx) => (
            <div
              key={idx}
              style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap", alignItems: "center" }}
            >
              <span style={{ minWidth: "24px", textAlign: "right" }}>{idx + 1}.</span>
              <input
                type="text"
                value={c.number}
                placeholder="Number"
                onChange={(e) => handleNumberChange(idx, e.target.value)}
                style={{
                  flex: "1 1 120px",
                  padding: "6px 8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="text"
                value={c.name}
                placeholder="Name"
                onChange={(e) => handleNameChange(idx, e.target.value)}
                style={{
                  flex: "1 1 120px",
                  padding: "6px 8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          ))}

          <button
            onClick={handleDownloadVCard}
            style={{
              padding: "10px 20px",
              borderRadius: "4px",
              border: "none",
              background: "#e67e22",
              color: "#fff",
              cursor: "pointer",
              marginTop: "16px",
            }}
          >
            Download vCard
          </button>
        </>
      )}
    </div>
  );
}
