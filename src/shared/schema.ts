
export interface Celebrity {
  id: string;
  name: string;
  category: string;
  bio: string;
  rating: number;
  price: number;
  imageUrl: string;
  featured: boolean;
}

export interface CelebrityVideoMessage {
  id: string;
  celebrityId: string;
  recipientName: string;
  message: string;
  createdAt: string;
  videoUrl: string;
}

export interface BookingRequest {
  celebrityId: string;
  userId: string;
  recipientName: string;
  occasionType: string;
  personalMessage: string;
  deliveryDate: string;
  status: "pending" | "accepted" | "completed" | "rejected";
  createdAt: string;
}
