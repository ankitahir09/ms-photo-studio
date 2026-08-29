import CategoryBanner from "@/components/gallery/CategoryBanner";
import VideoGallery from "@/components/gallery/VideoGallery";

export const metadata = {
  title: "Pre-Wedding Videos | Murlidhar Studio",
  description: "Cinematic pre-wedding videography to tell your beautiful love story.",
};

async function getCategoryData() {
  const CategoryModel = (await import("@/lib/models/Category")).default;
  await import("@/lib/db").then(m => m.connectToDatabase());
  const category = await CategoryModel.findOne({ slug: "prewedvideos" }).lean();
  
  if (!category) {
    return {
      title: "Pre-Wedding Videos",
      description: "Telling your love story through breathtaking cinematic films before the big day.",
    };
  }
  return JSON.parse(JSON.stringify(category));
}

export default async function PreWedVideosPage() {
  const categoryData = await getCategoryData();

  return (
    <>
      <CategoryBanner data={categoryData} />
      <VideoGallery categoryId="prewedvideos" />
    </>
  );
}
