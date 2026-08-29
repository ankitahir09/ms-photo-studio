import CategoryBanner from "@/components/gallery/CategoryBanner";
import PhotoGallery from "@/components/gallery/PhotoGallery";

export const metadata = {
  title: "Engagement Photography | Murlidhar Studio",
  description: "Engagement photography capturing the beautiful start of your journey together.",
};

async function getCategoryData() {
  const CategoryModel = (await import("@/lib/models/Category")).default;
  await import("@/lib/db").then(m => m.connectToDatabase());
  const category = await CategoryModel.findOne({ slug: "engagephotos" }).lean();
  
  if (!category) {
    return {
      title: "Engagement Photography",
      description: "Celebrating the promise of forever with beautiful portraits.",
    };
  }
  return JSON.parse(JSON.stringify(category));
}

export default async function EngagementPhotosPage() {
  const categoryData = await getCategoryData();

  return (
    <>
      <CategoryBanner data={categoryData} />
      <PhotoGallery categoryId="engagephotos" />
    </>
  );
}
