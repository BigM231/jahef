import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import image1 from "@/assets/gallery/school-visit-1.jpeg";
import image2 from "@/assets/gallery/founder-with-children-1.jpeg";
import image3 from "@/assets/gallery/school-visit-2.jpeg";
import image4 from "@/assets/gallery/school-visit-3.jpeg";
import image5 from "@/assets/gallery/school-visit-4.jpeg";
import image6 from "@/assets/gallery/founder-with-children-2.jpeg";
import image7 from "@/assets/gallery/founder-portrait.jpeg";
import image8 from "@/assets/gallery/school-materials-new.jpeg";
import image9 from "@/assets/gallery/founder-with-children-3.jpeg";
import image10 from "@/assets/gallery/school-visit-5.jpg";
import image11 from "@/assets/gallery/school-visit-6.jpg";
import image12 from "@/assets/gallery/school-visit-7.jpg";
import image13 from "@/assets/gallery/school-visit-8.jpg";
import image14 from "@/assets/gallery/school-materials-distribution-2.jpg";
import image15 from "@/assets/gallery/school-materials-distribution-3.jpg";
import image16 from "@/assets/gallery/school-materials-distribution-4.jpg";
import image17 from "@/assets/gallery/school-materials-distribution-5.jpg";
import image18 from "@/assets/gallery/school-materials-distribution-6.jpg";
import image19 from "@/assets/gallery/community-outreach-1.jpg";
import video1 from "@/assets/gallery/videos/video-1.mp4";
import video2 from "@/assets/gallery/videos/video-2.mp4";
import video3 from "@/assets/gallery/videos/video-3.mp4";
import video4 from "@/assets/gallery/videos/video-4.mp4";
import video5 from "@/assets/gallery/videos/video-5.mp4";
import video6 from "@/assets/gallery/videos/video-6.mp4";
import video7 from "@/assets/gallery/videos/video-7.mp4";
import image20 from "@/assets/gallery/founder-with-administrators-1.jpg";
import image21 from "@/assets/gallery/founder-with-students-1.jpg";
import image22 from "@/assets/gallery/materials-distribution-7.jpg";
import image23 from "@/assets/gallery/school-meeting-1.jpg";
import image24 from "@/assets/gallery/founder-with-students-2.jpg";
import image25 from "@/assets/gallery/school-partnership-1.jpg";
import image26 from "@/assets/gallery/educators-meeting-1.jpg";
import image27 from "@/assets/gallery/educators-meeting-2.jpg";
import image28 from "@/assets/gallery/educators-meeting-3.jpg";
import image29 from "@/assets/gallery/school-meeting-2.jpg";
import image30 from "@/assets/gallery/child-with-plant.jpg";
import video8 from "@/assets/gallery/videos/video-8.mp4";
import video9 from "@/assets/gallery/videos/video-9.mp4";
import video10 from "@/assets/gallery/videos/video-10.mp4";
import video11 from "@/assets/gallery/videos/video-11.mp4";
import video12 from "@/assets/gallery/videos/video-12.mp4";
import video13 from "@/assets/gallery/videos/video-13.mp4";
import video14 from "@/assets/gallery/videos/video-14.mp4";
import video15 from "@/assets/gallery/videos/video-15.mp4";
import video16 from "@/assets/gallery/videos/video-16.mp4";
import video17 from "@/assets/gallery/videos/video-17.mp4";
import video18 from "@/assets/gallery/videos/video-18.mp4";
import video19 from "@/assets/gallery/videos/video-19.mp4";
import video20 from "@/assets/gallery/videos/video-20.mp4";
import video21 from "@/assets/gallery/videos/video-21.mp4";
import video22 from "@/assets/gallery/videos/video-22.mp4";
import video23 from "@/assets/gallery/videos/video-23.mp4";

interface MediaItem {
  src: string;
  alt: string;
  category: string;
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [dbImages, setDbImages] = useState<MediaItem[]>([]);
  const [dbVideos, setDbVideos] = useState<MediaItem[]>([]);

  useEffect(() => {
    // Fetch media from database
    const fetchMedia = async () => {
      // Only select columns needed for display - excludes user_id for privacy
      const { data: media } = await supabase
        .from("gallery_media")
        .select("id, title, description, category, media_type, file_url, created_at")
        .order("created_at", { ascending: false });

      if (media) {
        const images = media
          .filter((item) => item.media_type === "image")
          .map((item) => ({
            src: item.file_url,
            alt: item.description || item.title,
            category: item.category,
          }));

        const videos = media
          .filter((item) => item.media_type === "video")
          .map((item) => ({
            src: item.file_url,
            alt: item.description || item.title,
            category: item.category,
          }));

        setDbImages(images);
        setDbVideos(videos);
      }
    };

    fetchMedia();
  }, []);

  const staticGalleryImages: MediaItem[] = [
    {
      src: image1,
      alt: "School visit - Children celebrating with distributed materials",
      category: "School Support",
    },
    {
      src: image2,
      alt: "Founder Jessica Akpobi with schoolchildren",
      category: "Community Outreach",
    },
    {
      src: image3,
      alt: "School materials distribution event",
      category: "School Support",
    },
    {
      src: image4,
      alt: "Celebrating with children at school",
      category: "Community Outreach",
    },
    {
      src: image5,
      alt: "Group photo with students and materials",
      category: "School Support",
    },
    {
      src: image6,
      alt: "Founder interacting with students",
      category: "Community Outreach",
    },
    {
      src: image7,
      alt: "Founder with school children in hallway",
      category: "Community Outreach",
    },
    {
      src: image8,
      alt: "Students receiving school materials",
      category: "School Support",
    },
    {
      src: image9,
      alt: "Founder engaging with children",
      category: "Community Outreach",
    },
    {
      src: image10,
      alt: "Students celebrating with school bags and supplies",
      category: "School Support",
    },
    {
      src: image11,
      alt: "Founder Jessica speaking with student in hallway",
      category: "Community Outreach",
    },
    {
      src: image12,
      alt: "Founder distributing supplies to student",
      category: "School Support",
    },
    {
      src: image13,
      alt: "Founder meeting with school administrator",
      category: "Community Outreach",
    },
    {
      src: image14,
      alt: "Group of students with received school materials",
      category: "School Support",
    },
    {
      src: image15,
      alt: "Students proudly showing their school supplies",
      category: "School Support",
    },
    {
      src: image16,
      alt: "Distribution of school bags and materials",
      category: "School Support",
    },
    {
      src: image17,
      alt: "Happy students with educational materials",
      category: "School Support",
    },
    {
      src: image18,
      alt: "Children receiving school supplies",
      category: "School Support",
    },
    {
      src: image19,
      alt: "Community engagement and partnership meeting",
      category: "Community Outreach",
    },
    {
      src: image20,
      alt: "Founder with school administrators in head teacher's office",
      category: "Community Outreach",
    },
    {
      src: image21,
      alt: "Founder walking with students in school hallway",
      category: "School Support",
    },
    {
      src: image22,
      alt: "Founder distributing educational materials to students",
      category: "School Support",
    },
    {
      src: image23,
      alt: "Meeting with school administrator to discuss partnership",
      category: "Community Outreach",
    },
    {
      src: image24,
      alt: "Founder surrounded by excited students outside school building",
      category: "School Support",
    },
    {
      src: image25,
      alt: "Founder with school administrator discussing education initiatives",
      category: "Community Outreach",
    },
    {
      src: image26,
      alt: "Group meeting with educators and school staff",
      category: "Community Outreach",
    },
    {
      src: image27,
      alt: "Collaborative meeting with school educators",
      category: "Community Outreach",
    },
    {
      src: image28,
      alt: "Partnership discussion with school leadership team",
      category: "Community Outreach",
    },
    {
      src: image29,
      alt: "Founder in school office discussing program implementation",
      category: "Community Outreach",
    },
    {
      src: image30,
      alt: "Child with plant at community outreach event",
      category: "Community Outreach",
    },
  ];

  const staticGalleryVideos: MediaItem[] = [
    {
      src: video1,
      alt: "Community outreach program video",
      category: "Community Outreach",
    },
    {
      src: video2,
      alt: "School materials distribution",
      category: "School Support",
    },
    {
      src: video3,
      alt: "Educational program activities",
      category: "School Support",
    },
    {
      src: video4,
      alt: "Community engagement event",
      category: "Community Outreach",
    },
    {
      src: video5,
      alt: "Impact stories and testimonials",
      category: "Community Outreach",
    },
    {
      src: video6,
      alt: "School visit highlights",
      category: "School Support",
    },
    {
      src: video7,
      alt: "Community engagement and support",
      category: "Community Outreach",
    },
    {
      src: video8,
      alt: "Foundation activities and community support",
      category: "Community Outreach",
    },
    {
      src: video9,
      alt: "School program highlights",
      category: "School Support",
    },
    {
      src: video10,
      alt: "Educational outreach activities",
      category: "School Support",
    },
    {
      src: video11,
      alt: "Community engagement video",
      category: "Community Outreach",
    },
    {
      src: video12,
      alt: "Foundation impact stories",
      category: "Community Outreach",
    },
    {
      src: video13,
      alt: "School visit and distribution event",
      category: "School Support",
    },
    {
      src: video14,
      alt: "Community outreach program",
      category: "Community Outreach",
    },
    {
      src: video15,
      alt: "Foundation program highlights",
      category: "Community Outreach",
    },
    {
      src: video16,
      alt: "Educational support activities",
      category: "School Support",
    },
    {
      src: video17,
      alt: "Community engagement event",
      category: "Community Outreach",
    },
    {
      src: video18,
      alt: "School materials distribution",
      category: "School Support",
    },
    {
      src: video19,
      alt: "Impact stories from the field",
      category: "Community Outreach",
    },
    {
      src: video20,
      alt: "Educational program activities",
      category: "School Support",
    },
    {
      src: video21,
      alt: "Community support initiatives",
      category: "Community Outreach",
    },
    {
      src: video22,
      alt: "School partnership program",
      category: "School Support",
    },
    {
      src: video23,
      alt: "Foundation outreach activities",
      category: "Community Outreach",
    },
  ];

  // Combine static and database media
  const galleryImages = [...dbImages, ...staticGalleryImages];
  const galleryVideos = [...dbVideos, ...staticGalleryVideos];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl md:text-6xl text-white mb-4">
            Our Gallery
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Witness the joy, transformation, and genuine impact of our work in
            communities across Lagos
          </p>
        </div>
      </section>

      {/* Gallery Tabs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="photos" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="photos">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {galleryImages.map((image, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <div
                        className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedImage(image.src)}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-64 sm:h-72 md:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <span className="inline-block bg-secondary text-white text-sm font-secondary font-semibold px-3 py-1 rounded-full mb-2">
                              {image.category}
                            </span>
                            <p className="text-white text-sm">{image.alt}</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </TabsContent>

            <TabsContent value="videos">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {galleryVideos.map((video, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <div
                        className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedVideo(video.src)}
                      >
                        <video
                          src={video.src}
                          className="w-full h-72 object-cover"
                          preload="metadata"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <span className="inline-block bg-secondary text-white text-sm font-secondary font-semibold px-3 py-1 rounded-full mb-2">
                              {video.category}
                            </span>
                            <p className="text-white text-sm">{video.alt}</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setSelectedImage(null)}
            aria-label="Close"
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Gallery image"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Video Lightbox Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setSelectedVideo(null)}
            aria-label="Close"
          >
            <X size={32} />
          </button>
          <video
            src={selectedVideo}
            controls
            className="max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
