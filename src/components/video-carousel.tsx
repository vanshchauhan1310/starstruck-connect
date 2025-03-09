
import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mockCelebrities, celebrityVideos, Celebrity, CelebrityVideo } from "@/lib/mock-data";

export function VideoCarousel() {
  const { data: videos } = useQuery<CelebrityVideo[]>({
    queryKey: ["/api/videos/celebrity"],
    initialData: celebrityVideos,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Setup video refs array
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videos.length);
  }, [videos.length]);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 8000); // Change video every 8 seconds

    return () => clearInterval(interval);
  }, [activeIndex, videos.length]);

  // Handle video loading
  const handleVideoLoaded = (id: string) => {
    setLoadedVideos(prev => new Set(prev).add(id));
  };

  // Find celebrity for a video
  const getCelebrityForVideo = (video: CelebrityVideo): Celebrity | undefined => {
    return mockCelebrities.find(celeb => celeb.id === video.celebrityId);
  };

  // Handle navigation
  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + videos.length) % videos.length);
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % videos.length);
  };

  // Handle video playing
  useEffect(() => {
    // Pause all videos
    videoRefs.current.forEach(video => {
      if (video) {
        video.pause();
      }
    });

    // Play the active video
    const activeVideo = videoRefs.current[activeIndex];
    if (activeVideo) {
      activeVideo.currentTime = 0;
      activeVideo.play().catch(err => console.log("Video play error:", err));
    }
  }, [activeIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const activeItem = container.children[activeIndex] as HTMLElement;
      
      if (activeItem) {
        const containerLeft = container.getBoundingClientRect().left;
        const containerWidth = container.offsetWidth;
        const itemLeft = activeItem.getBoundingClientRect().left;
        const itemWidth = activeItem.offsetWidth;
        
        const scrollPosition = container.scrollLeft + (itemLeft - containerLeft) - (containerWidth / 2) + (itemWidth / 2);
        
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [activeIndex]);

  return (
    <section className="py-16 overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            <span className="inline-block py-1 px-3 bg-primary/10 text-primary text-sm font-medium rounded-full mb-2">Exclusive</span>
            <div className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Celebrity Moments
            </div>
          </h2>
          
          <div className="flex space-x-2">
            <Button
              onClick={handlePrev}
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 border border-border/40 backdrop-blur-sm bg-background/80 shadow-sm transition-all duration-300 hover:scale-105"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleNext}
              variant="outline" 
              size="icon"
              className="rounded-full h-10 w-10 border border-border/40 backdrop-blur-sm bg-background/80 shadow-sm transition-all duration-300 hover:scale-105"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative">
          {/* Left and right gradient masks */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10"></div>
          
          {/* Video carousel */}
          <div 
            ref={containerRef}
            className="flex overflow-x-auto video-carousel-mask py-8 pb-12 no-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {videos.map((video, index) => {
              const celebrity = getCelebrityForVideo(video);
              const isActive = index === activeIndex;
              const isLoaded = loadedVideos.has(video.id);
              
              return (
                <div
                  key={video.id}
                  className={cn(
                    "flex-shrink-0 w-[350px] mx-4 snap-center cursor-pointer video-carousel-card",
                    isActive ? "active" : ""
                  )}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className={cn(
                    "rounded-xl overflow-hidden aspect-video relative shadow-lg transition-all duration-500",
                    isActive ? "ring-2 ring-primary/40 ring-offset-2" : ""
                  )}>
                    <div className="absolute inset-0 bg-black/20 z-10"></div>
                    
                    <video
                      ref={el => videoRefs.current[index] = el}
                      src={video.videoUrl}
                      loop
                      muted
                      playsInline
                      className={cn(
                        "w-full h-full object-cover transform scale-105",
                        isLoaded ? "video-blur-loaded" : "video-blur-loading"
                      )}
                      poster={video.thumbnailUrl}
                      onLoadedData={() => handleVideoLoaded(video.id)}
                    />
                    
                    {/* Video overlay info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white z-20">
                      <h3 className="text-lg font-medium mb-1 relative inline-block video-card-name">
                        {celebrity?.name}
                      </h3>
                      <p className="text-sm text-white/80">{video.title}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Progress indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {videos.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-12 h-1 rounded-full transition-all duration-300",
                  index === activeIndex 
                    ? "bg-primary" 
                    : "bg-primary/20 hover:bg-primary/40"
                )}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
