import CategoryBanner from "@/components/gallery/CategoryBanner";
import PhotoGallery from "@/components/gallery/PhotoGallery";

export const metadata = {
  title: "Modelling Shoot | Murlidhar Studio",
  description: "Professional modelling portfolios and fashion photography in Kutch.",
};

async function getCategoryData() {
  const CategoryModel = (await import("@/lib/models/Category")).default;
  await import("@/lib/db").then(m => m.connectToDatabase());
  const category = await CategoryModel.findOne({ slug: "modellingshoot" }).lean();
  
  if (!category) {
    return {
      title: "Modelling Photography",
      description: "Professional portfolios that capture your unique style and personality.",
    };
  }
  return JSON.parse(JSON.stringify(category));
}

export default async function ModellingShootPage() {
  const categoryData = await getCategoryData();

  return (
    <>
      <CategoryBanner data={categoryData} />
      <PhotoGallery categoryId="modellingshoot" />
    </>
  );
}
