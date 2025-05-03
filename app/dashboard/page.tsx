"use client";

import { useSession } from "next-auth/react";
import SessionInfo from "@/components/session-info";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTokenRefresh } from "@/hooks/use-token-refresh";
import { LogOut, User, Users, Calendar, FileText, Bell, Settings } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function DashboardPage() {
  const session = useTokenRefresh();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/" });
  };
  
  return (
    <div className="container py-10">
      <SessionInfo />
      
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={handleSignOut} 
            disabled={isLoading}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {session?.user?.name || <Skeleton className="h-6 w-32" />}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {session?.user?.email || <Skeleton className="h-4 w-48" />}
              </p>
              <div className="mt-4">
                <Button asChild size="sm" variant="outline">
                  <Link href="/profile">View Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">
                Events this week
              </p>
              <div className="mt-4">
                <Button asChild size="sm" variant="outline">
                  <Link href="/events">View Events</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Sermons</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground mt-1">
                New sermons available
              </p>
              <div className="mt-4">
                <Button asChild size="sm" variant="outline">
                  <Link href="/sermons">View Sermons</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground mt-1">
                Unread notifications
              </p>
              <div className="mt-4">
                <Button size="sm" variant="outline">
                  View Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
              <CardDescription>
                Details about your current authentication session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm font-medium">User ID:</div>
                  <div className="text-sm">{session?.user?.id || <Skeleton className="h-4 w-32" />}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm font-medium">Role:</div>
                  <div className="text-sm">{session?.user?.role || <Skeleton className="h-4 w-20" />}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm font-medium">Session Expires:</div>
                  <div className="text-sm">{session?.expires ? new Date(session.expires).toLocaleString() : <Skeleton className="h-4 w-40" />}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm font-medium">Email Verified:</div>
                  <div className="text-sm">{session?.user?.email ? "Yes" : "No"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Frequently used tasks and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Church Directory
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Submit Testimony
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Prayer Requests
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
