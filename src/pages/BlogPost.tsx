
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import { blogPosts, BlogPost as BlogPostType } from "@/data/blogs";
import { useToast } from "@/components/ui/use-toast";

const generateFullContent = (post: BlogPostType): string => {
  return `
# ${post.title}

${post.excerpt}

## Overview

This comprehensive guide covers everything you need to know about ${post.title.toLowerCase()}. Our medical experts have compiled the latest evidence-based information to help you make informed decisions about your health.

## Key Points

• Understanding the basics and what you need to know
• When to seek professional medical advice
• Practical tips for daily management
• Warning signs that require immediate attention
• Lifestyle modifications that can help

## Important Reminders

⚠️ **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider for personalized guidance.

## When to See a Doctor

If you experience any concerning symptoms or have questions about your health, it's important to consult with a healthcare professional. They can provide personalized advice based on your specific situation.

## Additional Resources

For more health information and expert guidance, explore our other articles or consult with our AI Health Assistant for personalized recommendations.

---

*This article was reviewed by medical professionals and is part of Doctori AI's commitment to providing accurate, trustworthy health information.*
  `.trim();
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPostType | null>(null);

  useEffect(() => {
    if (slug) {
      const foundPost = blogPosts.find(p => p.slug === slug);
      setPost(foundPost || null);
      
      if (foundPost) {
        // SEO
        document.title = `${foundPost.title} | Doctori AI Health Blog`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', foundPost.excerpt);
        
        const linkCanonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        linkCanonical.setAttribute('href', window.location.href);
        if (!linkCanonical.parentNode) document.head.appendChild(linkCanonical);
      }
    }
  }, [slug]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Article link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Unable to copy link. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!post) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/blog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const fullContent = generateFullContent(post);

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/blog">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <Card className="shadow-card mb-8">
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <CardHeader>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {post.readTime}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(post.date).toLocaleDateString()}
              </div>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            <CardTitle className="text-3xl leading-tight">
              {post.title}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Article Content */}
        <Card className="shadow-card">
          <CardContent className="prose prose-lg max-w-none pt-6">
            <div className="whitespace-pre-line leading-relaxed">
              {fullContent}
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts
              .filter(p => p.category === post.category && p.id !== post.id)
              .slice(0, 3)
              .map((relatedPost) => (
                <Card key={relatedPost.id} className="shadow-card hover:shadow-medical transition-all">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <CardHeader className="pb-2">
                    <Badge variant="secondary" className="w-fit">{relatedPost.category}</Badge>
                    <CardTitle className="text-lg leading-tight">
                      {relatedPost.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <Link to={`/blog/${relatedPost.slug}`}>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
