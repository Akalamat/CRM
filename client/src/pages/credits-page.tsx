import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CONTRIBUTORS = [
  {
    name: "Lê Trần Quang Huy",
    studentId: "22150533",
    class: "221542",
    image: "https://api.dicebear.com/7.x/bottts/svg?seed=LH&backgroundColor=sepia",
  },
  {
    name: "Trần Cao Danh",
    studentId: "22150429",
    class: "221542",
    image: "https://api.dicebear.com/7.x/bottts/svg?seed=TD&backgroundColor=sepia",
  },
];

export default function CreditsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#fdf6e3]/50">
      <div className="grid grid-cols-2 gap-24 max-w-4xl mx-auto">
        {CONTRIBUTORS.map((contributor) => (
          <div key={contributor.studentId} className="text-center space-y-4">
            <Avatar className="h-48 w-48 mx-auto border-4 border-primary/20">
              <AvatarImage src={contributor.image} />
              <AvatarFallback className="text-4xl">
                {contributor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif">{contributor.name}</h2>
              <p className="text-lg text-muted-foreground font-serif">
                MSSV: {contributor.studentId}
              </p>
              <p className="text-lg text-muted-foreground font-serif">
                Lớp: {contributor.class}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}