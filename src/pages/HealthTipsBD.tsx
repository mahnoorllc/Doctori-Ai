import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { healthTipsBD } from "@/data/healthTipsBD";

export default function HealthTipsBD() {
  // SEO
  useEffect(() => {
    document.title = "Bangladesh Health Tips | Doctori AI";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Bangladesh-specific health tips: dengue prevention, safe water, heatwave safety, air pollution, maternal & child health, and more.');
    const linkCanonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    linkCanonical.setAttribute('href', window.location.href);
    if (!linkCanonical.parentNode) document.head.appendChild(linkCanonical);
  }, []);

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Bangladesh Health Tips</h1>
          <p className="text-muted-foreground">Practical, locally-relevant guidance for healthier living</p>
        </header>

        <main className="space-y-6">
          {healthTipsBD.map((section) => (
            <Card key={section.title} className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-2xl">{section.title}</CardTitle>
                  <Badge variant="secondary">{section.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                {section.items.map((item) => (
                  <div key={item.heading}>
                    <h3 className="font-semibold mb-2">{item.heading}</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      {item.points.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </main>
      </div>
    </div>
  );
}
