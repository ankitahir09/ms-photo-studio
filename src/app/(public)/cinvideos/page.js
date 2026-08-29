import CategoryBanner from "@/components/gallery/CategoryBanner";
import VideoGallery from "@/components/gallery/VideoGallery";

export const metadata = {
  title: "Cinematic Wedding Videos | Murlidhar Studio",
  description: "Premium cinematic wedding films and event videography by Murlidhar Studio.",
};

async function getCategoryData() {
  const CategoryModel = (await import("@/lib/models/Category")).default;
  await import("@/lib/db").then(m => m.connectToDatabase());
  const category = await CategoryModel.findOne({ slug: "cinvideos" }).lean();
  
  if (!category) {
    return {
      title: "Cinematic Videos",
      description: "Breathtaking cinematic films that let you relive your special day.",
    };
  }
  return JSON.parse(JSON.stringify(category));
}

export default async function CinVideosPage() {
  const categoryData = await getCategoryData();

  return (
    <>
      <CategoryBanner data={categoryData} />
      <VideoGallery categoryId="cinvideos" />
    </>
  );
}
