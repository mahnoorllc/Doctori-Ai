import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "10 Heart-Healthy Foods to Add to Your Diet",
    excerpt: "Discover the best foods for cardiovascular health and learn how simple dietary changes can make a big difference.",
    category: "Nutrition",
    readTime: "5 min read",
    date: "2024-01-15",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    title: "Understanding Mental Health: Signs and Support",
    excerpt: "Learn to recognize mental health warning signs and discover available resources for support and treatment.",
    category: "Mental Health",
    readTime: "8 min read",
    date: "2024-01-12",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    title: "Women's Health: Essential Screenings by Age",
    excerpt: "A comprehensive guide to important health screenings and checkups every woman should consider.",
    category: "Women's Health",
    readTime: "6 min read",
    date: "2024-01-10",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
  },
  {
    id: 4,
    title: "Managing Diabetes: Tips for Better Blood Sugar Control",
    excerpt: "Practical strategies for managing diabetes and maintaining stable blood sugar levels throughout the day.",
    category: "Chronic Disease",
    readTime: "7 min read",
    date: "2024-01-08",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
  },
];

export default function Blog() {
  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Health & Wellness Blog</h1>
          <p className="text-muted-foreground text-lg">
            Stay informed with expert health advice and wellness tips
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.id} className="shadow-card hover:shadow-medical transition-all hover:scale-105">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                
                <CardTitle className="text-lg leading-tight hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                    Read More
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Articles
          </Button>
        </div>
      </div>
    </div>
  );
}