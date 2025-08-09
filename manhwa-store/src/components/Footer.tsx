export default function Footer() {
  return (
    <footer className="w-full border-t border-black/10 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-black/60">
        ساخته‌شده با Next.js و Tailwind — © {new Date().getFullYear()} مانهوا شاپ
      </div>
    </footer>
  );
}