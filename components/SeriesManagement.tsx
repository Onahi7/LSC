"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash } from "lucide-react";

interface SeriesItem {
  id: string;
  name: string;
  description: string;
  sermonCount: number;
  image?: string;
}

export function SeriesManagement() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [series, setSeries] = useState<SeriesItem[]>([]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSeries, setCurrentSeries] = useState<SeriesItem | null>(null);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    image: "",
  });
  
  // Fetch series data
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/sermons/series");
        
        if (!response.ok) {
          throw new Error("Failed to fetch series data");
        }
        
        const data = await response.json();
        setSeries(data);
      } catch (error) {
        console.error("Error fetching series:", error);
        toast({
          title: "Error",
          description: "Failed to load series data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSeries();
  }, [toast]);
  
  // Handle create/edit form opening
  const handleOpenForm = (item?: SeriesItem) => {
    if (item) {
      setCurrentSeries(item);
      setFormValues({
        name: item.name,
        description: item.description,
        image: item.image || "",
      });
    } else {
      setCurrentSeries(null);
      setFormValues({
        name: "",
        description: "",
        image: "",
      });
    }
    
    setIsDialogOpen(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (!formValues.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Series name is required",
          variant: "destructive",
        });
        return;
      }
      
      const url = currentSeries 
        ? `/api/sermons/series/${currentSeries.id}` 
        : "/api/sermons/series";
      
      const method = currentSeries ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${currentSeries ? "update" : "create"} series`);
      }
      
      const data = await response.json();
      
      if (currentSeries) {
        // Update existing series
        setSeries(prevSeries => 
          prevSeries.map(item => 
            item.id === data.id ? { ...item, ...data } : item
          )
        );
      } else {
        // Add new series
        setSeries(prevSeries => [...prevSeries, { ...data, sermonCount: 0 }]);
      }
      
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: `Series ${currentSeries ? "updated" : "created"} successfully`,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: `Failed to ${currentSeries ? "update" : "create"} series`,
        variant: "destructive",
      });
    }
  };
  
  // Handle delete
  const handleDelete = (item: SeriesItem) => {
    setCurrentSeries(item);
    setIsDeleteDialogOpen(true);
  };
  
  // Confirm delete
  const confirmDelete = async () => {
    if (!currentSeries) return;
    
    try {
      const response = await fetch(`/api/sermons/series/${currentSeries.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete series");
      }
      
      setSeries(prevSeries => 
        prevSeries.filter(item => item.id !== currentSeries.id)
      );
      
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Series deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting series:", error);
      toast({
        title: "Error",
        description: "Failed to delete series",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Sermon Series</h2>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Series
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {series.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No series found. Create your first series.</p>
          </div>
        ) : (
          series.map(item => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{item.name}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenForm(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description || "No description"}</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm">{item.sermonCount} sermon{item.sermonCount !== 1 ? "s" : ""}</p>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentSeries ? "Edit Series" : "Create Series"}</DialogTitle>
            <DialogDescription>
              {currentSeries 
                ? "Edit the series details below" 
                : "Enter the details for the new sermon series"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Series Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter series name"
                value={formValues.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter a brief description"
                rows={3}
                value={formValues.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="image">Image URL (optional)</Label>
              <Input
                id="image"
                name="image"
                placeholder="Enter image URL"
                value={formValues.image}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {currentSeries ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this series? This will not delete the individual sermons.
            </DialogDescription>
          </DialogHeader>
          
          {currentSeries && (
            <div className="py-4">
              <p className="font-medium">{currentSeries.name}</p>
              <p className="text-sm text-muted-foreground">
                Contains {currentSeries.sermonCount} sermon{currentSeries.sermonCount !== 1 ? "s" : ""}
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
