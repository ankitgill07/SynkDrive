import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { userAuth } from "@/contextApi/AuthContext";
import googlePng  from "../../assets/images/google.png";
import githubPng  from "../../assets/images/github.png";



export function SocialConnections() {
  const { user } = userAuth();

  return (
    <Card className="p-8 bg-[#F7F5F2] gap-3 rounded-xl border border-border">
      <h2 className="text-2xl font-semibold font-plusjakartaSans text-foreground mb-0">
        Connected Accounts
      </h2>  
      <p className="text-muted-foreground font-inter text-sm mb-2">
        Connect your social media and website to your profile
      </p>
      <div className="space-y-4 font-inter ">
        <div className="flex items-center justify-between p-4 bg-gray-100  rounded-lg border border-border hover:border-accent/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12  rounded-lg flex items-center justify-center">
              <img
                src={user.socialProvider === "google" ? googlePng : githubPng}
                alt=""
              />
            </div>
            <div>
              <h3 className="font-medium text-foreground">
                {user.socialProvider}
              </h3>
              {user.socialLogin && (
                <p className="text-sm text-muted-foreground">{user.email}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-500/10 text-green-700 border-green-200">
              Connected
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
