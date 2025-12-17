import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function UploadMedia() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const isImage = selectedFile.type.startsWith("image/");
      const isVideo = selectedFile.type.startsWith("video/");
      
      if (mediaType === "image" && !isImage) {
        toast.error("Please select an image file (JPG, PNG, etc.)");
        return;
      }
      
      if (mediaType === "video" && !isVideo) {
        toast.error("Please select a video file (MP4, etc.)");
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !user) {
      toast.error("Please select a file and ensure you're logged in");
      return;
    }

    setIsLoading(true);

    try {
      // Use the selected media type
      const bucketName = mediaType === "image" ? "gallery-images" : "gallery-videos";
      
      // Create file path with user ID and timestamp
      const timestamp = Date.now();
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${timestamp}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from("gallery_media")
        .insert({
          user_id: user.id,
          title,
          description,
          category,
          media_type: mediaType,
          file_path: filePath,
          file_url: publicUrl,
        });

      if (dbError) throw dbError;

      toast.success("Media uploaded successfully!");
      
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setMediaType("image");
      setFile(null);
      (document.getElementById("file-input") as HTMLInputElement).value = "";
      
      // Navigate to gallery after a delay
      setTimeout(() => navigate("/gallery"), 1500);
    } catch (error: any) {
      toast.error(error.message || "Failed to upload media");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Upload Media</h1>
              <p className="text-muted-foreground mt-2">Add photos and videos to the gallery</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Media Upload Form</CardTitle>
              <CardDescription>
                Fill in the details below to add new media to the gallery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="media-type">Media Type *</Label>
                  <Select value={mediaType} onValueChange={(value: "image" | "video") => {
                    setMediaType(value);
                    setFile(null);
                    const fileInput = document.getElementById("file-input") as HTMLInputElement;
                    if (fileInput) fileInput.value = "";
                  }}>
                    <SelectTrigger id="media-type">
                      <SelectValue placeholder="Select media type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Photo</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-input">Media File *</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="file-input"
                      type="file"
                      accept={mediaType === "image" ? "image/*" : "video/*"}
                      onChange={handleFileChange}
                      required
                    />
                    <Upload className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {mediaType === "image" 
                      ? "Accepts images (JPG, PNG, etc.)" 
                      : "Accepts videos (MP4, etc.)"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., School visit to Lagos Community"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide additional context about this media..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="School Support">School Support</SelectItem>
                      <SelectItem value="Health Initiatives">Health Initiatives</SelectItem>
                      <SelectItem value="Community Outreach">Community Outreach</SelectItem>
                      <SelectItem value="Empowerment Programs">Empowerment Programs</SelectItem>
                      <SelectItem value="Events">Events</SelectItem>
                      <SelectItem value="Team">Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Uploading..." : "Upload Media"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
