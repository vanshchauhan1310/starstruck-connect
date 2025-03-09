
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Celebrity } from "@/shared/schema";
import { mockCelebrities } from "@/lib/mock-data";
import { CelebrityCard } from "@/components/celebrities/celebrity-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";

const Celebrities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const { data: celebrities } = useQuery<Celebrity[]>({
    queryKey: ["/api/celebrities"],
    initialData: mockCelebrities,
  });

  const filteredCelebrities = celebrities.filter((celebrity) => {
    const matchesSearch = celebrity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || celebrity.category.toLowerCase() === category.toLowerCase();
    const matchesPrice = celebrity.price >= priceRange[0] && celebrity.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const categories = ["all", ...Array.from(new Set(celebrities.map((c) => c.category.toLowerCase())))];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-block py-1 px-3 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
            Browse
          </span>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            All Celebrities
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Find the perfect celebrity to create a memorable experience for you or your loved ones.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 mb-12 border border-border/50 shadow-sm animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <Label htmlFor="search" className="mb-2 block">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="category" className="mb-2 block">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat === "all" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="mb-2 block">Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
              <Slider
                min={0}
                max={1000}
                step={50}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-6"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredCelebrities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCelebrities.map((celebrity, index) => (
              <div key={celebrity.id} className="animate-scale-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CelebrityCard celebrity={celebrity} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="text-2xl font-medium mb-2">No celebrities found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Celebrities;
