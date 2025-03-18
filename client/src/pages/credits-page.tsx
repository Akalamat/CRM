import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { ImagePlus } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

const CONTRIBUTORS = [
  {
    name: "Lê Trần Quang Huy",
    studentId: "22150533",
    class: "221542",
    defaultImage: "https://api.dicebear.com/7.x/bottts/svg?seed=LH&backgroundColor=sepia",
  },
  {
    name: "Trần Cao Danh",
    studentId: "22150429",
    class: "221542",
    defaultImage: "https://api.dicebear.com/7.x/bottts/svg?seed=TD&backgroundColor=sepia",
  },
];

export default function CreditsPage() {
  const [customImages, setCustomImages] = useState<Record<string, string>>({});

  const { data: savedImages } = useQuery({
    queryKey: ["contributor-images"],
    queryFn: async () => {
      const images: Record<string, string> = {};
      for (const contributor of CONTRIBUTORS) {
        try {
          const res = await fetch(`/api/contributors/${contributor.studentId}/image`);
          if (res.ok) {
            const data = await res.json();
            if (data.image) images[contributor.studentId] = data.image;
          }
        } catch (error) {
          console.error(error);
        }
      }
      return images;
    }
  });

  useEffect(() => {
    if (savedImages) {
      setCustomImages(savedImages);
    }
  }, [savedImages]);

  const handleImageChange = (contributorId: string) => async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const image = reader.result as string;
        try {
          await fetch(`/api/contributors/${contributorId}/image`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image })
          });
          setCustomImages(prev => ({
            ...prev,
            [contributorId]: image
          }));
        } catch (error) {
          console.error(error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#fdf6e3]/50">
      <div className="grid grid-cols-2 gap-24 max-w-4xl mx-auto">
        {CONTRIBUTORS.map((contributor) => (
          <div key={contributor.studentId} className="text-center space-y-4">
            <div className="relative">
              <Avatar className="h-48 w-48 mx-auto border-4 border-primary/20">
                <img
                  src={customImages[contributor.studentId] || contributor.defaultImage}
                  alt={contributor.name}
                  className="h-full w-full object-cover rounded-full"
                />
                <AvatarFallback className="text-4xl">
                  {contributor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => handleImageChange(contributor.studentId)(e as any);
                    input.click();
                  }}
                >
                  <ImagePlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl">{contributor.name}</h2>
              <p className="text-lg text-muted-foreground">
                MSSV: {contributor.studentId}
              </p>
              <p className="text-lg text-muted-foreground">
                Lớp: {contributor.class}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}