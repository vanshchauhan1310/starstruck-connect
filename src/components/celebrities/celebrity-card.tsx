
import { Celebrity } from "@/shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CelebrityCardProps {
  celebrity: Celebrity;
}

export function CelebrityCard({ celebrity }: CelebrityCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-border/50 backdrop-blur-sm bg-card/80">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={celebrity.imageUrl} 
          alt={celebrity.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="backdrop-blur-md bg-background/70">
            {celebrity.category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold">{celebrity.name}</h3>
          <div className="flex items-center text-amber-500">
            <Star className="h-4 w-4 fill-current mr-1" />
            <span className="text-sm font-medium">{celebrity.rating}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{celebrity.bio}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">${celebrity.price}</span>
          <Link to={`/celebrities/${celebrity.id}`}>
            <Button variant="outline" className="transition-all duration-300 hover:bg-primary hover:text-primary-foreground">
              Book Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
