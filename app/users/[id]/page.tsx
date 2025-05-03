"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserProfileView } from "@/components/user-profile-view";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface UserPageProps {
  params: {
    id: string;
  };
}

export default function UserPage({ params }: UserPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = params.id;
  
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  
  if (status === "unauthenticated") {
    router.push("/auth/login");
    return null;
  }
  
  return (
    <div className="container max-w-5xl py-8 space-y-4">
      <div>
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <UserProfileView userId={userId} />
    </div>
  );
}
