export default function Footer() {
  return (
    <footer className="max-w-md mx-auto mt-10 pb-6 text-center">
      <p className="text-[11px] text-[var(--text-faint)]">
        © {new Date().getFullYear()} Anıl Kalafat. Tüm hakları saklıdır.
      </p>
    </footer>
  );
}
