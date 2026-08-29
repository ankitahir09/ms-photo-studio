import CategoryBanner from "@/components/gallery/CategoryBanner";
import VideoGallery from "@/components/gallery/VideoGallery";

export const metadata = {
  title: "Kids Videos | Murlidhar Studio",
  description: "Cinematic videos capturing the playful and beautiful moments of your children.",
};

async function getCategoryData() {
  const CategoryModel = (await import("@/lib/models/Category")).default;
  await import("@/lib/db").then(m => m.connectToDatabase());
  const category = await CategoryModel.findOne({ slug: "kidvideos" }).lean();
  
  if (!category) {
    return {
      title: "Kids Videography",
      description: "Cinematic memories of your children's most precious and playful moments.",
    };
  }
  return JSON.parse(JSON.stringify(category));
}

export default async function KidVideosPage() {
  const categoryData = await getCategoryData();

  return (
    <>
      <CategoryBanner data={categoryData} />
      <VideoGallery categoryId="kidvideos" />
    </>
  );
}
