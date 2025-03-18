import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function CreditsPage() {
  const team = [
    {
      name: "Lê Trần Quang Huy",
      studentId: "22150533",
      class: "221542",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=QuangHuy"
    },
    {
      name: "Trần Cao Danh",
      studentId: "22150429",
      class: "221542",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=CaoDanh"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Project Credits</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {team.map((member) => (
          <Card key={member.studentId}>
            <CardContent className="pt-6 text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold mb-2">{member.name}</h2>
              <p className="text-muted-foreground">Student ID: {member.studentId}</p>
              <p className="text-muted-foreground">Class: {member.class}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
