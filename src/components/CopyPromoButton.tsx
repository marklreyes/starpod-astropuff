import { useState } from 'preact/hooks';

interface CopyPromoButtonProps {
  code: string;
}

export default function CopyPromoButton({ code }: CopyPromoButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers or when clipboard API fails
      const textArea = document.createElement('textarea');
      textArea.value = code;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        alert(`Promo code: ${code}`);
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  return (
    <button
      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 ${
        copied
          ? 'bg-gradient-to-r from-green-700 to-green-800 text-white'
          : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
      }`}
      onClick={copyToClipboard}
    >
      {copied ? '✅ Copied!' : '📋 Copy Code'}
    </button>
  );
}
