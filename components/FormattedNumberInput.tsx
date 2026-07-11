"use client";

interface Props {
  value: string;
  onChange: (rawDigits: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export default function FormattedNumberInput({
  value,
  onChange,
  placeholder,
  className,
  autoFocus,
}: Props) {
  const displayValue = value ? Number(value).toLocaleString("tr-TR") : "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value.replace(/\D/g, ""));
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      autoFocus={autoFocus}
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
}
