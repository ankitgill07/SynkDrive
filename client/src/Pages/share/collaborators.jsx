import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Mail, UserPlus } from "lucide-react";
import { useState } from "react";

const COLLABORATORS = [
  {
    id: "1",
    name: "Sarah Mitchell",
    email: "sarah@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    role: "editor",
    filesCount: 18,
    joinDate: "3 months ago",
    status: "active",
  },
  {
    id: "2",
    name: "James Wilson",
    email: "james@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    role: "editor",
    filesCount: 12,
    joinDate: "2 months ago",
    status: "active",
  },
  {
    id: "3",
    name: "Emily Brooks",
    email: "emily@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    role: "viewer",
    filesCount: 8,
    joinDate: "1 month ago",
    status: "active",
  },
  {
    id: "4",
    name: "Robert Garcia",
    email: "robert@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    role: "viewer",
    filesCount: 5,
    joinDate: "2 weeks ago",
    status: "inactive",
  },
  {
    id: "5",
    name: "Amanda Chen",
    email: "amanda@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda",
    role: "editor",
    filesCount: 14,
    joinDate: "1 week ago",
    status: "active",
  },
  {
    id: "6",
    name: "Christopher Lee",
    email: "christopher@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher",
    role: "viewer",
    filesCount: 3,
    joinDate: "3 days ago",
    status: "active",
  },
];

const getRoleColor = (role) => {
  if (role === "owner")
    return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200";
  if (role === "editor")
    return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200";
  return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200";
};

export function Collaborators() {
  const [collaborators, setCollaborators] = useState(COLLABORATORS);

  const activeCount = collaborators.filter((c) => c.status === "active").length;

  return (
    <Card className="border-0 shadow-sm">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Collaborators</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {activeCount} active members
          </p>
        </div>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" />
          Add Member
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                Collaborator
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                Files Access
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                Joined
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {collaborators.map((collaborator) => (
              <tr
                key={collaborator.id}
                className="border-b border-border hover:bg-muted/20 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={collaborator.avatar} />
                      <AvatarFallback>
                        {collaborator.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {collaborator.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {collaborator.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(collaborator.role)} capitalize`}
                  >
                    {collaborator.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-foreground">
                    {collaborator.filesCount} files
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {collaborator.joinDate}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${collaborator.status === "active" ? "bg-green-500" : "bg-gray-400"}`}
                    />
                    <span className="text-xs capitalize text-muted-foreground">
                      {collaborator.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Change role</DropdownMenuItem>
                      <DropdownMenuItem>View shared files</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Mail className="w-4 h-4" />
                        Send message
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Remove access
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
