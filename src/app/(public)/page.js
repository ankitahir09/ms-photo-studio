import HeroSlideshow from "@/components/home/HeroSlideshow";
import CategoryCarousel from "@/components/home/CategoryCarousel";
import AboutSection from "@/components/home/AboutSection";

// For Next.js 16 Server Components
async function getHomeData() {
  await import("@/lib/db").then((m) => m.connectToDatabase());
  
  // Directly query DB for SSR to avoid absolute URL requirement for fetch
  const ImageModel = (await import("@/lib/models/Image")).default;
  const CategoryModel = (await import("@/lib/models/Category")).default;

  const slides = await ImageModel.find({ category: "homeBg" }).sort({ order: 1, uploadedAt: -1 }).lean();
  
  const categories = await CategoryModel.find({ isActive: true })
    .sort({ order: 1 })
    .lean();

  return { 
    slides: JSON.parse(JSON.stringify(slides)), 
    categories: JSON.parse(JSON.stringify(categories)) 
  };
}

export default async function Home() {
  const { slides, categories } = await getHomeData();

  return (
    <>
      <HeroSlideshow slides={slides} />
      <CategoryCarousel categories={categories} />
      <AboutSection />
    </>
  );
}
