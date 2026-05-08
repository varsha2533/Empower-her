import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from 'lucide-react';

const Resources: React.FC = () => {
  const resources = [
    {
      category: "Legal Resources",
      title: "Laws for Women in India",
      description: "Comprehensive guide to women's rights and legal protections in India",
      link: "https://www.lexisnexis.in/blogs/laws-for-women-in-india/",
    },
    {
      category: "Self-Defense",
      title: "Self-Defense Tips and Techniques",
      description: "Essential self-defense strategies and escape techniques for women",
      link: "https://www.healthline.com/health/womens-health/self-defense-tips-escape",
    },
    {
      category: "Health Resources",
      title: "Women's Health Resources",
      description: "Comprehensive health resources and information for women",
      link: "https://www.aafp.org/family-physician/patient-care/care-resources/womens-health/women-s-health-resources.html",
    },
    {
      category: "Support Organizations",
      title: "Women Welfare Organizations in Bangalore",
      description: "Directory of women welfare organizations and support services in Bangalore",
      link: "https://www.justdial.com/Bangalore/Women-Welfare-Organisations/nct-12146590",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Resources</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">{resource.category}</span>
                  <CardTitle className="mt-1">{resource.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{resource.description}</CardDescription>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(resource.link, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Resource
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Resources;
