import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CONTRIBUTORS = [
  {
    name: "Lê Trần Quang Huy",
    studentId: "22150533",
    class: "221542",
    image: "https://api.dicebear.com/7.x/initials/svg?seed=LH",
  },
  {
    name: "Trần Cao Danh",
    studentId: "22150429",
    class: "221542",
    image: "https://api.dicebear.com/7.x/initials/svg?seed=TD",
  },
];

export default function CreditsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Credits</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {CONTRIBUTORS.map((contributor) => (
          <Card key={contributor.studentId}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={contributor.image} />
                  <AvatarFallback>
                    {contributor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{contributor.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    MSSV: {contributor.studentId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Lớp: {contributor.class}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
