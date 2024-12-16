import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal } from "lucide-react";

// Sample data for the current challenge and leaderboard
const currentChallenge = {
  name: "June Cycling Challenge",
  goal: 500, // km
  daysLeft: 12,
};

const leaderboardData = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "/avatars/alice.jpg",
    distance: 423,
    department: "Marketing",
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "/avatars/bob.jpg",
    distance: 389,
    department: "Engineering",
  },
  {
    id: 3,
    name: "Carol Williams",
    avatar: "/avatars/carol.jpg",
    distance: 356,
    department: "HR",
  },
  {
    id: 4,
    name: "David Brown",
    avatar: "/avatars/david.jpg",
    distance: 301,
    department: "Sales",
  },
  {
    id: 5,
    name: "Eva Martinez",
    avatar: "/avatars/eva.jpg",
    distance: 287,
    department: "Finance",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Current Challenge Card */}
      <Card>
        <CardHeader>
          <CardTitle>Current Challenge: {currentChallenge.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>
                Progress: {leaderboardData[0].distance} /{" "}
                {currentChallenge.goal} km
              </span>
              <span>{currentChallenge.daysLeft} days left</span>
            </div>
            <Progress
              value={
                (leaderboardData[0].distance / currentChallenge.goal) * 100
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {leaderboardData.map((participant, index) => (
              <div key={participant.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-8 text-center">
                  {index === 0 && (
                    <Trophy className="w-6 h-6 text-yellow-400 mx-auto" />
                  )}
                  {index === 1 && (
                    <Medal className="w-6 h-6 text-gray-400 mx-auto" />
                  )}
                  {index === 2 && (
                    <Medal className="w-6 h-6 text-amber-600 mx-auto" />
                  )}
                  {index > 2 && (
                    <span className="text-gray-500">{index + 1}</span>
                  )}
                </div>
                <Avatar>
                  <AvatarImage
                    src={participant.avatar}
                    alt={participant.name}
                  />
                  <AvatarFallback>
                    {participant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{participant.name}</p>
                  <p className="text-sm text-gray-500">
                    {participant.department}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{participant.distance} km</p>
                  <p className="text-sm text-gray-500">
                    {(
                      (participant.distance / currentChallenge.goal) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
