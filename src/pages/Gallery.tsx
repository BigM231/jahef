import { useState } from "react";
import { X } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import image1 from "@/assets/gallery/school-visit-1.jpeg";
import image2 from "@/assets/gallery/founder-with-children-1.jpeg";
import image3 from "@/assets/gallery/school-visit-2.jpeg";
import image4 from "@/assets/gallery/school-visit-3.jpeg";
import image5 from "@/assets/gallery/school-visit-4.jpeg";
import image6 from "@/assets/gallery/founder-with-children-2.jpeg";
import image7 from "@/assets/gallery/founder-portrait.jpeg";
import image8 from "@/assets/gallery/school-materials-new.jpeg";
import image9 from "@/assets/gallery/founder-with-children-3.jpeg";
import video1 from "@/assets/gallery/videos/video-1.mp4";
import video2 from "@/assets/gallery/videos/video-2.mp4";
import video3 from "@/assets/gallery/videos/video-3.mp4";
import video4 from "@/assets/gallery/videos/video-4.mp4";
import video5 from "@/assets/gallery/videos/video-5.mp4";
import video6 from "@/assets/gallery/videos/video-6.mp4";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const galleryImages = [
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
  ];

  const galleryVideos = [
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
  ];

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((image, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedImage(image.src)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-300"
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
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryVideos.map((video, index) => (
                  <div
                    key={index}
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
                ))}
              </div>
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
