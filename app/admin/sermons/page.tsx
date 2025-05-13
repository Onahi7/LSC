"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, Filter, Edit, Trash, Play, Plus, X, ChevronDown, ChevronUp, Calendar, User, BookOpen, Tag, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SermonForm } from "@/components/SermonForm";
import { format } from "date-fns";

interface Sermon {
  id: string;
  title: string;
  content: string;
  video_url: string[];
  audio_url: string[];
  thumbnail: string | null;
  duration: string | null;
  series: string | null;
  scripture: string | null;
  tags: string[];
  featured: boolean;
  preacher: {
    name: string | null;
    image: string | null;
  };
  createdAt: string;
}

export default function AdminSermonsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [seriesFilter, setSeriesFilter] = useState<string>("all");
  const [preacherFilter, setPreacherFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [availableSeries, setAvailableSeries] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availablePreachers, setAvailablePreachers] = useState<string[]>([]);
  const [showFeatured, setShowFeatured] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("sermons");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const [selectedSermonIds, setSelectedSermonIds] = useState<string[]>([]);
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);
  const [allSeries, setAllSeries] = useState<string[]>([]);
  const [allPreachers, setAllPreachers] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  // Check if user has access
  useEffect(() => {
    if (session && !["SUPERADMIN", "ADMIN", "PASTOR"].includes(session.user.role)) {
      router.push("/dashboard");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
    }
  }, [session, router, toast]);

  // Fetch sermons
  useEffect(() => {
    const fetchSermons = async () => {
      try {
        setIsLoading(true);
        // Prepare query parameters
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        });

        if (searchTerm) params.append("search", searchTerm);
        if (seriesFilter !== "all") params.append("series", seriesFilter);
        if (preacherFilter !== "all") params.append("speaker", preacherFilter);
        if (tagFilter !== "all") params.append("tag", tagFilter);
        if (showFeatured !== null) params.append("featured", showFeatured.toString());

        const response = await fetch(`/api/sermons?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch sermons");
        }

        const data = await response.json();
        setSermons(data.sermons);
        setFilteredSermons(data.sermons);
        setTotalPages(data.totalPages || Math.ceil(data.total / itemsPerPage));
      } catch (error) {
        console.error("Error fetching sermons:", error);
        toast({
          title: "Error",
          description: "Failed to load sermons",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchSermons();
    }
  }, [session, currentPage, itemsPerPage, searchTerm, seriesFilter, preacherFilter, tagFilter, showFeatured, toast]);
  
  // Handle edit sermon
  const handleEditSermon = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setIsEditDialogOpen(true);
  };
  
  // Handle add sermon
  const handleAddSermon = () => {
    setSelectedSermon(null);
    setIsAddDialogOpen(true);
  };
  
  // Handle delete sermon
  const handleDeleteSermon = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle delete confirmation
  const confirmDelete = async () => {
    if (!selectedSermon) return;
    
    try {
      const response = await fetch(`/api/sermons/${selectedSermon.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete sermon");
      }
      
      // Remove the sermon from the state
      setSermons(sermons.filter(sermon => sermon.id !== selectedSermon.id));
      setFilteredSermons(filteredSermons.filter(sermon => sermon.id !== selectedSermon.id));
      
      toast({
        title: "Success",
        description: "Sermon deleted successfully",
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting sermon:", error);
      toast({
        title: "Error",
        description: "Failed to delete sermon",
        variant: "destructive",
      });
    }
  };
  
  // Handle bulk actions
  const handleBulkAction = async (action: "delete" | "feature" | "unfeature") => {
    if (selectedSermonIds.length === 0) return;
    
    try {
      setIsBulkActionLoading(true);
      
      const response = await fetch(`/api/sermons/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: selectedSermonIds,
          action,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${action} sermons`);
      }
      
      // Update the state based on the action
      if (action === "delete") {
        setSermons(sermons.filter(sermon => !selectedSermonIds.includes(sermon.id)));
        setFilteredSermons(filteredSermons.filter(sermon => !selectedSermonIds.includes(sermon.id)));
      } else {
        const updatedSermons = await response.json();
        setSermons(prevSermons => 
          prevSermons.map(sermon => {
            const updated = updatedSermons.find((s: Sermon) => s.id === sermon.id);
            return updated || sermon;
          })
        );
        setFilteredSermons(prevSermons => 
          prevSermons.map(sermon => {
            const updated = updatedSermons.find((s: Sermon) => s.id === sermon.id);
            return updated || sermon;
          })
        );
      }
      
      setSelectedSermonIds([]);
      
      toast({
        title: "Success",
        description: `Sermons ${action === "delete" ? "deleted" : action === "feature" ? "featured" : "unfeatured"} successfully`,
      });
    } catch (error) {
      console.error(`Error in bulk ${action}:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} sermons`,
        variant: "destructive",
      });
    } finally {
      setIsBulkActionLoading(false);
    }
  };
  
  // Check/uncheck all sermons
  const toggleSelectAll = () => {
    if (selectedSermonIds.length === filteredSermons.length) {
      setSelectedSermonIds([]);
    } else {
      setSelectedSermonIds(filteredSermons.map(sermon => sermon.id));
    }
  };
  
  // Toggle sermon selection
  const toggleSelectSermon = (id: string) => {
    if (selectedSermonIds.includes(id)) {
      setSelectedSermonIds(selectedSermonIds.filter(sermonId => sermonId !== id));
    } else {
      setSelectedSermonIds([...selectedSermonIds, id]);
    }
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle sermon form submission (add/edit)
  const handleFormSubmit = async (formData: any, isEdit: boolean) => {
    try {
      const url = isEdit 
        ? `/api/sermons/${selectedSermon?.id}` 
        : "/api/sermons";
      
      const method = isEdit ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? "update" : "create"} sermon`);
      }
      
      const updatedSermon = await response.json();
      
      if (isEdit) {
        // Update existing sermon in state
        setSermons(prevSermons => 
          prevSermons.map(sermon => 
            sermon.id === updatedSermon.id ? updatedSermon : sermon
          )
        );
        setFilteredSermons(prevSermons => 
          prevSermons.map(sermon => 
            sermon.id === updatedSermon.id ? updatedSermon : sermon
          )
        );
        setIsEditDialogOpen(false);
      } else {
        // Add new sermon to state
        setSermons(prevSermons => [updatedSermon, ...prevSermons]);
        setFilteredSermons(prevSermons => [updatedSermon, ...prevSermons]);
        setIsAddDialogOpen(false);
      }
      
      toast({
        title: "Success",
        description: `Sermon ${isEdit ? "updated" : "created"} successfully`,
      });
    } catch (error) {
      console.error(`Error ${isEdit ? "updating" : "creating"} sermon:`, error);
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? "update" : "create"} sermon`,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Sermon Management</h1>
        <Button onClick={handleAddSermon}>
          <Plus className="mr-2 h-4 w-4" />
          Add Sermon
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="sermons">Sermons</TabsTrigger>
          <TabsTrigger value="series">Series</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sermons">
          <Card>
            <CardHeader>
              <CardTitle>Sermons</CardTitle>
              <CardDescription>
                Manage all sermon content including videos, audio, and text.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters and search */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sermons..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select value={seriesFilter} onValueChange={setSeriesFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Series" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Series</SelectItem>
                      {allSeries.map((series) => (
                        <SelectItem key={series} value={series}>
                          {series}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={preacherFilter} onValueChange={setPreacherFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Preacher" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Preachers</SelectItem>
                      {allPreachers.map((preacher) => (
                        <SelectItem key={preacher} value={preacher}>
                          {preacher}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={tagFilter} onValueChange={setTagFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tags</SelectItem>
                      {allTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant={showFeatured === true ? "default" : "outline"}
                    onClick={() => setShowFeatured(showFeatured === true ? null : true)}
                    className="h-10"
                  >
                    Featured
                  </Button>
                </div>
              </div>
              
              {/* Bulk actions */}
              {selectedSermonIds.length > 0 && (
                <div className="bg-muted p-2 rounded-md mb-4 flex items-center justify-between">
                  <span className="text-sm">
                    {selectedSermonIds.length} sermon(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleBulkAction("feature")}
                      disabled={isBulkActionLoading}
                    >
                      {isBulkActionLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Feature"
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleBulkAction("unfeature")}
                      disabled={isBulkActionLoading}
                    >
                      {isBulkActionLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Unfeature"
                      )}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleBulkAction("delete")}
                      disabled={isBulkActionLoading}
                    >
                      {isBulkActionLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Sermons table */}
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredSermons.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No sermons found</p>
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30px]">
                          <Checkbox 
                            checked={
                              filteredSermons.length > 0 &&
                              selectedSermonIds.length === filteredSermons.length
                            }
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="w-[200px]">Title</TableHead>
                        <TableHead>Preacher</TableHead>
                        <TableHead>Series</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSermons.map((sermon) => (
                        <TableRow key={sermon.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedSermonIds.includes(sermon.id)}
                              onCheckedChange={() => toggleSelectSermon(sermon.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{sermon.title}</TableCell>
                          <TableCell>{sermon.preacher.name}</TableCell>
                          <TableCell>{sermon.series || "-"}</TableCell>
                          <TableCell>
                            {format(new Date(sermon.createdAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            {sermon.featured ? (
                              <Badge>Featured</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEditSermon(sermon)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteSermon(sermon)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const page = index + 1;
                        // Show current page, first, last, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={page === currentPage}
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        
                        // Show ellipsis for skipped pages
                        if (
                          (page === 2 && currentPage > 3) ||
                          (page === totalPages - 1 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="series">
          <Card>
            <CardHeader>
              <CardTitle>Series Management</CardTitle>
              <CardDescription>
                Organize sermons into series and manage sermon collections.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Series management UI will be implemented here */}
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Series management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Sermon Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Sermon</DialogTitle>
            <DialogDescription>
              Add a new sermon to the database. Fill out all required fields.
            </DialogDescription>
          </DialogHeader>
          
          <SermonForm
            onSubmit={(data) => handleFormSubmit(data, false)}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Sermon Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Sermon</DialogTitle>
            <DialogDescription>
              Edit the sermon details. Fields left empty will not be updated.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSermon && (
            <SermonForm
              initialData={selectedSermon}
              onSubmit={(data) => handleFormSubmit(data, true)}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this sermon? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSermon && (
            <div className="py-4">
              <p className="font-medium">{selectedSermon.title}</p>
              <p className="text-sm text-muted-foreground">
                By {selectedSermon.preacher.name} • {format(new Date(selectedSermon.createdAt), "MMM d, yyyy")}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
