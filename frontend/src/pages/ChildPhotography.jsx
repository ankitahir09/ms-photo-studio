import Gallery from "../components/Gallery";
import {usePhotoData} from "../hooks/usePhotoData.js";
import CatBg from "../components/CatBg";
import { categoryData } from "../components/categoryData.jsx";
import SEO from "../components/SEO.jsx";

const ChildPhotography = () => {
const { photos, loading, error } = usePhotoData("childphotos");
const data = categoryData.child;
  return (
<>
      <SEO 
        title="Child Photography in Kutch | Kids Photography | Murlidhar Studio"
        description="Professional child photography in Kutch. Capture precious moments of your children with natural, beautiful photos that preserve their innocence and joy."
        keywords="child photography Kutch, kids photography, baby photos, children photographer, family photography, child portrait"
        url="/kidsphotography"
      />
      <CatBg data={data}/>

      <section className="min-h-[100svh]">
        <Gallery photos={photos} loading={loading} error={error} />
      </section>
    </>
  );
};
export default ChildPhotography;