
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CelebrityCard } from "@/components/celebrities/celebrity-card";
import type { Celebrity } from "@/shared/schema";
import { mockCelebrities } from "@/lib/mock-data";
import { VideoCarousel } from "@/components/video-carousel";

function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-fade-in">
            Connect with Your Favorite Celebrities
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground animate-fade-in" style={{ animationDelay: "200ms" }}>
            Book personalized video messages, live calls, and exclusive meet & greets with top celebrities from entertainment, sports, and more.
          </p>
          <div className="mt-10 flex gap-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
            <Link to="/celebrities">
              <Button size="lg" className="text-lg transition-all duration-300 hover:scale-105">
                Book Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg transition-all duration-300 hover:scale-105">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute -top-20 right-0 w-1/3 h-full bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-10 w-1/4 h-2/3 bg-gradient-to-t from-primary/5 to-transparent rounded-full blur-3xl -z-10"></div>
    </div>
  );
}

function CelebrityShowcase() {
  const { data: celebrities, isLoading } = useQuery<Celebrity[]>({
    queryKey: ["/api/celebrities/featured"],
    initialData: mockCelebrities.filter(celebrity => celebrity.featured).slice(0, 3)
  });

  if (isLoading) return (
    <div className="flex items-center justify-center py-24">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-slate-200 h-10 w-10"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-slate-200 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-slate-200 rounded col-span-2"></div>
              <div className="h-2 bg-slate-200 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-block py-1 px-3 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">Trending</span>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Featured Celebrities</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">Discover our handpicked selection of popular celebrities ready to create unforgettable moments for you and your loved ones.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {celebrities.map((celebrity, index) => (
            <div key={celebrity.id} className="animate-scale-up" style={{ animationDelay: `${index * 150}ms` }}>
              <CelebrityCard celebrity={celebrity} />
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/celebrities">
            <Button variant="outline" size="lg" className="transition-all duration-300 hover:scale-105">
              View All Celebrities
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <VideoCarousel />
      <CelebrityShowcase />
    </div>
  );
};

export default Index;
