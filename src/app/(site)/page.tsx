import FeaturedArticles from "@/components/template/article/featured-articles";
import Contact from "@/components/template/contact/ui";
import { CarouselDemo } from "@/components/template/display/example";
import  Hero  from "@/components/template/hero/hero";
import { AnimatedTestimonialsDemo } from "@/components/template/testimonial/example";
import { TimelineDemo } from "@/components/template/timeline/example";
import FeaturedVideos from "@/components/template/video/featured-video";
import RecentVideos from "@/components/template/video/recent";


export default function Home() {
  return (
   <div className="">
    <Hero />
    <div className="py-6 -mt-32">
    <AnimatedTestimonialsDemo />
    <FeaturedVideos />
    <FeaturedArticles />
    <CarouselDemo />
    <TimelineDemo />
    <Contact />
    </div>

   </div>
  );

}
