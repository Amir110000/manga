import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[24px] row-start-2 items-center sm:items-start w-full max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold"><span className="text-accent">Rh</span> Manhwa</h1>
        <p className="text-sm/6 opacity-80">پلتفرم آنلاین خواندن مانهوآ با اشتراک و کیف پول</p>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-2">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-accent text-accent-foreground gap-2 hover:bg-accent/90 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="#"
          >
            شروع کنید
          </a>
          <a
            className="rounded-full border border-solid border-accent/50 transition-colors flex items-center justify-center hover:bg-accent/10 hover:border-accent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="#features"
          >
            امکانات
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center opacity-70">
        <span>© {new Date().getFullYear()} Rh Manhwa</span>
      </footer>
    </div>
  );
}
