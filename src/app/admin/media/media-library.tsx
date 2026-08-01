"use client";

import { useState, useTransition, useRef } from "react";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileCode,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, isCloudinaryConfigured } from "@/lib/cloudinary";
import { createFileAssetAction, deleteFileAssetAction } from "@/app/actions/media";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface FileAsset {
  id: string;
  name: string;
  path: string;
  public_url: string;
  size_bytes: number | null;
  mime_type: string | null;
}

interface MediaLibraryProps {
  initialAssets: any[];
}

export function MediaLibrary({ initialAssets }: MediaLibraryProps) {
  const { t } = useLanguage();
  const [assets, setAssets] = useState<any[]>(initialAssets);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search filter
  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.public_url?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(10);

    try {
      let finalUrl = "";
      let finalPath = file.name;

      if (isCloudinaryConfigured() && CLOUDINARY_UPLOAD_PRESET) {
        // Enforce actual Cloudinary Upload via API
        setUploadProgress(30);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload to Cloudinary");
        }

        setUploadProgress(70);
        const data = await response.json();
        finalUrl = data.secure_url;
        finalPath = data.public_id;
      } else {
        // Fallback mockup mode when keys are not active in public env yet
        setUploadProgress(50);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        finalUrl = URL.createObjectURL(file); // custom temporary URL
        finalPath = `mock_id_${Math.random().toString(36).slice(2, 9)}`;
      }

      setUploadProgress(90);

      // Register file asset inside standard Supabase Table
      const res = await createFileAssetAction({
        name: file.name,
        path: finalPath,
        publicUrl: finalUrl,
        sizeBytes: file.size,
        mimeType: file.type,
      });

      if (!res.success) {
        alert(res.error || "Failed to register media asset in database.");
        return;
      }

      setAssets((prev) => [res.data, ...prev]);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (err: any) {
      alert(err.message || "An error occurred during file upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;

    startTransition(async () => {
      const res = await deleteFileAssetAction(id);
      if (!res.success) {
        alert(res.error || "Failed to delete asset");
        return;
      }
      setAssets((prev) => prev.filter((a) => a.id !== id));
    });
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-display-sm font-bold tracking-tight">
              <span className="text-gradient">মিডিয়া লাইব্রেরি (Media Library)</span>
            </h1>
            <p className="text-sm text-fg-soft mt-1">
              ওয়েবসাইটের লোগো, ব্যানার, গ্যালারি এবং প্রজেক্ট স্ক্রিনশট এখান থেকে আপলোড এবং ম্যানেজ করুন।
            </p>
          </div>
          
          {/* File upload hidden trigger */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-full bg-brand-600 text-white px-5 h-11 font-semibold hover:bg-brand-500 hover:-translate-y-0.5 shadow-soft transition-all duration-300 self-start disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {t({ bn: "নতুন ফাইল আপলোড করুন", en: "Upload New Media" })}
          </button>
        </div>
      </Reveal>

      {/* Uploading progress bar */}
      {uploading && (
        <Reveal direction="fade">
          <div className="card-surface p-4 rounded-2xl border border-brand-500/10 bg-brand-500/5">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-fg-soft flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-500" />
                Uploading to Cloudinary Media CDN...
              </span>
              <span className="text-brand-500">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-canvas rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-brand-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </Reveal>
      )}

      {/* Search and Filters */}
      <Reveal delay={60}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-fg-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t({ bn: "ফাইল খুঁজুন...", en: "Search files by name..." })}
            className="w-full h-12 pl-12 pr-4 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
          />
        </div>
      </Reveal>

      {/* Grid List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset, idx) => (
            <Reveal key={asset.id} delay={idx * 20} direction="scale">
              <div className="card-surface rounded-2xl border border-border/10 bg-surface/20 hover:bg-surface/30 shadow-soft overflow-hidden flex flex-col justify-between group h-full">
                {/* Image preview */}
                <div className="relative aspect-square bg-canvas-muted overflow-hidden flex items-center justify-center border-b border-border/10">
                  {asset.mime_type?.startsWith("image") ? (
                    <img src={asset.public_url} alt={asset.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <FileCode className="h-12 w-12 text-fg-muted" />
                  )}

                  {/* Quick Copy Link Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-300">
                    <button
                      onClick={() => handleCopyUrl(asset.id, asset.public_url)}
                      className="p-2 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lift"
                      title="Copy URL"
                    >
                      {copiedId === asset.id ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="p-2 bg-brand-600 text-white rounded-full hover:scale-110 transition-transform shadow-lift"
                      title="Delete Asset"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 space-y-1">
                  <h4 className="font-bold text-fg text-xs truncate" title={asset.name}>
                    {asset.name}
                  </h4>
                  <p className="text-[10px] text-fg-muted">
                    {formatBytes(asset.size_bytes || 0)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))
        ) : (
          <div className="col-span-full">
            <p className="text-sm text-fg-muted italic text-center py-10 card-surface border border-border/10 rounded-3xl bg-surface/10">
              মিডিয়া লাইব্রেরিতে কোনো ফাইল পাওয়া যায়নি।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
