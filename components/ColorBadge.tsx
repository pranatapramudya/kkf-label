import React from 'react';

export default function ColorBadge({ text, isPrint = false }: { text: string; isPrint?: boolean }) {
  if (!text) return null;

  // Regex mencari format hex color misalnya #FF0000 atau #FFF
  const regex = /#([0-9A-F]{3}){1,2}/i;
  const match = text.match(regex);

  if (!match) {
    return <span>{text}</span>;
  }

  const hexColor = match[0];
  const parts = text.split(hexColor);
  
  // Clean up if the split leaves empty parentheses like ( )
  let remainder = parts.slice(1).join(hexColor);
  if (remainder.trim() === ')') {
    // If the text was "(Warna: #FFFFFF)", parts[0] is "(Warna: " and remainder is ")"
    remainder = ')';
  }

  return (
    <span className="inline-flex items-center gap-1">
      {parts[0]}
      <span
        className="inline-block w-3 h-3 rounded border border-zinc-300 shrink-0"
        style={{
          backgroundColor: hexColor,
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
        title={hexColor}
      />
      {remainder}
    </span>
  );
}
