"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FolderOpen,
  Upload,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { updateAdminOrderAction } from "@/app/actions/orders";
import { canUploadFromBrowser, uploadFile } from "@/lib/cloudinary/upload";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface ProjectFile {
  id: string;
  reference: string;
  website_type: string | null;
  uploaded_files: any[] | null;
  status: string;
  internal_files: any[] | null;
}

interface FileManagerProps {
  initialProjects: ProjectFile[];
}

export function FileManager({ initialProjects }: FileManagerProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectFile[]>(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const uploadsEnabled = canUploadFromBrowser();
  const [isPending, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedProject) return;

    setUploading(true);
    setUploadError(null);
    const filesArr = Array.from(files);

    try {
      // Real uploads only. Documents go to Cloudinary /raw, images to /image.
      // Previously non-image files always became blob: URLs — saved to the DB
      // as if uploaded, but unreachable the moment the tab closed.
      const uploaded = [];
      for (const file of filesArr) {
        uploaded.push(await uploadFile(file, { folder: "project-files" }));
      }

      // Add to current project files
      const currentFiles = selectedProject.uploaded_files || [];
      const updatedFiles = [...currentFiles, ...uploaded];

      startTransition(async () => {
        const res = await updateAdminOrderAction(selectedProject.id, {
          status: selectedProject.status,
          uploadedFiles: updatedFiles,
        } as any);

        if (res.success) {
          setProjects((prev) =>
            prev.map((p) => (p.id === selectedProject.id ? { ...p, uploaded_files: updatedFiles } : p))
          );
          router.refresh();
        }
      });
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Failed to upload file."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = (fileIdx: number) => {
    if (!selectedProject) return;
    if (selectedProject.status !== "pending") {
      alert("You can only delete files before your project request moves to active review.");
      return;
    }

    if (!confirm("Are you sure you want to delete this file?")) return;

    const currentFiles = selectedProject.uploaded_files || [];
    const updatedFiles = currentFiles.filter((_, idx) => idx !== fileIdx);

    startTransition(async () => {
      const res = await updateAdminOrderAction(selectedProject.id, {
        status: selectedProject.status,
        uploadedFiles: updatedFiles,
      } as any);

      if (res.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === selectedProject.id ? { ...p, uploaded_files: updatedFiles } : p))
        );
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div>
          <h1 className="text-display-sm font-bold tracking-tight">
            <span className="text-gradient">ফাইল ম্যানেজার (File Manager)</span>
          </h1>
          <p className="text-sm text-fg-soft mt-1">
            আপনার প্রজেক্টের রিকোয়ারমেন্ট ব্রিফ, লোগো এবং ফাইনাল ডেলিভারি ফাইলসমূহ এখান থেকে আপলোড ও ডাউনলোড করুন।
          </p>
        </div>
      </Reveal>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Project selector & Upload trigger - 1 col */}
          <div className="lg:col-span-1 space-y-6">
            <Reveal delay={60}>
              <div className="card-surface p-5 sm:p-6 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Select Project</label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none text-fg"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.website_type} ({p.reference})
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {!uploadsEnabled && (
                  <p className="mb-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-700 dark:text-amber-300">
                    File uploads are currently unavailable. Please send your
                    files by email or WhatsApp and they will be attached to
                    your project.
                  </p>
                )}

                {uploadError && (
                  <p
                    role="alert"
                    className="mb-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs font-semibold text-red-600 dark:text-red-300"
                  >
                    {uploadError}
                  </p>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || isPending || !uploadsEnabled}
                  className="flex items-center justify-center gap-2 rounded-full bg-brand-600 text-white w-full h-11 font-semibold hover:bg-brand-500 hover:-translate-y-0.5 shadow-soft transition-all duration-300 disabled:opacity-50"
                >
                  {uploading || isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Upload Files
                </button>
              </div>
            </Reveal>
          </div>

          {/* Files Lists - 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            {selectedProject && (
              <Reveal delay={120}>
                <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur shadow-lift space-y-6">
                  {/* Client Uploaded section */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-fg border-b border-border/5 pb-2">
                      আপনার আপলোডকৃত ফাইলসমূহ (Your Uploaded Files)
                    </h3>
                    <div className="space-y-2">
                      {selectedProject.uploaded_files && selectedProject.uploaded_files.length > 0 ? (
                        selectedProject.uploaded_files.map((file, fileIdx) => (
                          <div key={fileIdx} className="flex items-center justify-between p-3 bg-canvas/30 rounded-xl border border-border/5 text-xs text-fg-soft hover:border-brand-500/15 transition-all">
                            <span className="font-semibold text-fg flex items-center gap-2">
                              {file.mimeType?.startsWith("image") ? (
                                <ImageIcon className="h-4 w-4 text-brand-500" />
                              ) : (
                                <FileText className="h-4 w-4 text-blue-500" />
                              )}
                              {file.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-fg-soft hover:text-fg border border-border/10 rounded-lg hover:bg-surface"
                                title="Download"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </a>
                              {selectedProject.status === "pending" && (
                                <button
                                  onClick={() => handleDeleteFile(fileIdx)}
                                  className="p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-lg hover:bg-brand-500/5"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-fg-muted italic py-2">কোনো ফাইল আপলোড করা হয়নি।</p>
                      )}
                    </div>
                  </div>

                  {/* Admin Shared Final Files Section */}
                  <div className="space-y-4 border-t border-border/5 pt-6">
                    <h3 className="font-bold text-fg border-b border-border/5 pb-2">
                      ফাইনাল ডেলিভারি ফাইলসমূহ (Final Delivery Files)
                    </h3>
                    <div className="space-y-2">
                      {selectedProject.internal_files && selectedProject.internal_files.length > 0 ? (
                        selectedProject.internal_files.map((file, fileIdx) => (
                          <div key={fileIdx} className="flex items-center justify-between p-3 bg-brand-500/5 rounded-xl border border-brand-500/15 text-xs text-fg-soft">
                            <span className="font-semibold text-fg flex items-center gap-2">
                              <FileText className="h-4 w-4 text-brand-500 animate-pulse" />
                              {file.name}
                            </span>
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-brand-500 hover:text-white bg-brand-500/10 hover:bg-brand-600 rounded-lg transition-colors"
                              title="Download Final file"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-fg-muted italic py-2">এডমিন কর্তৃক কোনো ফাইনাল ফাইল আপলোড করা হয়নি। প্রজেক্ট সম্পন্ন হলে লিংক এখানে দেখাবে।</p>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      ) : (
        <Reveal direction="fade">
          <div className="card-surface border border-border/10 rounded-3xl bg-surface/10 p-12 text-center text-fg-muted italic text-sm">
            <FolderOpen className="h-10 w-10 text-border mx-auto mb-3" />
            ফাইল দেখার জন্য আপনার প্রজেক্ট থাকতে হবে।
          </div>
        </Reveal>
      )}
    </div>
  );
}
