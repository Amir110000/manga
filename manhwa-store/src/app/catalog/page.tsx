import ProductCard from "@/components/ProductCard";
import { manhwas } from "@/data/manhwas";

export const metadata = {
  title: "کاتالوگ | مانهوا شاپ",
};

export default function CatalogPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">کاتالوگ مانهوا</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {manhwas.map((m) => (
          <ProductCard key={m.id} manhwa={m} />)
        )}
      </div>
    </main>
  );
}