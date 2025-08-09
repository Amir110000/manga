export interface ManhwaItem {
  id: string;
  slug: string;
  titleFa: string;
  titleEn: string;
  price: number; // toman
  coverImage: string;
  rating: number; // 0..5
  tags: string[];
}

export const manhwas: ManhwaItem[] = [
  {
    id: "1",
    slug: "solo-leveling",
    titleFa: "سولو لیولینگ",
    titleEn: "Solo Leveling",
    price: 250000,
    coverImage: "https://picsum.photos/seed/solo/600/900",
    rating: 4.8,
    tags: ["اکشن", "فانتزی"],
  },
  {
    id: "2",
    slug: "omni-mastery",
    titleFa: "استادی همه‌چیز",
    titleEn: "Omni-Mastery",
    price: 190000,
    coverImage: "https://picsum.photos/seed/omni/600/900",
    rating: 4.4,
    tags: ["ایسکای", "قدرتی"],
  },
  {
    id: "3",
    slug: "tower-of-god",
    titleFa: "برج خدا",
    titleEn: "Tower of God",
    price: 210000,
    coverImage: "https://picsum.photos/seed/tog/600/900",
    rating: 4.6,
    tags: ["ماجراجویی", "معمایی"],
  },
  {
    id: "4",
    slug: "the-beginning-after-the-end",
    titleFa: "آغاز پس از پایان",
    titleEn: "The Beginning After The End",
    price: 230000,
    coverImage: "https://picsum.photos/seed/tbate/600/900",
    rating: 4.7,
    tags: ["فانتزی", "قدرتی"],
  },
  {
    id: "5",
    slug: "lookism",
    titleFa: "لوکیزم",
    titleEn: "Lookism",
    price: 150000,
    coverImage: "https://picsum.photos/seed/lookism/600/900",
    rating: 4.2,
    tags: ["زندگی روزمره", "اجتماعی"],
  },
  {
    id: "6",
    slug: "return-of-the-disaster-class-hero",
    titleFa: "بازگشت قهرمان کلاس فاجعه",
    titleEn: "Return of the Disaster-Class Hero",
    price: 200000,
    coverImage: "https://picsum.photos/seed/rdch/600/900",
    rating: 4.3,
    tags: ["اکشن", "فانتزی"],
  },
  {
    id: "7",
    slug: "nano-machine",
    titleFa: "نانو ماشین",
    titleEn: "Nano Machine",
    price: 170000,
    coverImage: "https://picsum.photos/seed/nano/600/900",
    rating: 4.1,
    tags: ["هنرهای رزمی", "فانتزی"],
  },
  {
    id: "8",
    slug: "legend-of-the-northern-blade",
    titleFa: "افسانه شمشیر شمالی",
    titleEn: "Legend of the Northern Blade",
    price: 220000,
    coverImage: "https://picsum.photos/seed/lotnb/600/900",
    rating: 4.5,
    tags: ["هنرهای رزمی", "حماسی"],
  },
];