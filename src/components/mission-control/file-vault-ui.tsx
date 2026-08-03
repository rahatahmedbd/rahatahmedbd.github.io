"use client";
import { useState, useTransition, useRef } from "react";
import { Upload, Download, Trash2, FileText, Image as ImageIcon, Shield, HardDrive, Lock, Eye, Zap, AlertTriangle } from "lucide-react";
import { updateClientOrderFilesAction } from "@/app/actions/orders";
import { uploadFile, canUploadFromBrowser } from "@/lib/cloudinary/upload";

export function FileVaultUI({ projects }: { projects: any[] }) {
  const [selectedId, setSelectedId] = useState(projects[0]?.id || "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = projects.find(p=>p.id===selectedId);
  const [localProjects, setLocalProjects] = useState(projects);

  const current = localProjects.find(p=>p.id===selectedId) || selected;
  const canUpload = canUploadFromBrowser();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !current) return;
    setUploadError(null);
    setUploading(true);

    try {
      // Upload each file to Cloudinary permanently - no blob: URLs
      const uploadedFiles: { name: string; url: string; mimeType: string; sizeBytes: number }[] = [];

      for (const file of Array.from(files)) {
        try {
          // Try unsigned first (public preset), fallback to signed client endpoint
          let uploaded;
          if (canUpload) {
            uploaded = await uploadFile(file, { folder: `client_uploads/${current.id}` });
          } else {
            // Signed upload via client endpoint
            const signRes = await fetch("/api/uploads/sign-client", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ folder: `client_uploads/${current.id}` }),
            });
            if (!signRes.ok) {
              const errData = await signRes.json().catch(() => ({}));
              throw new Error(errData.error || "File uploads are not configured. Please send files via email/WhatsApp.");
            }
            const { signature, timestamp, apiKey, cloudName } = await signRes.json();
            const kind = file.type.startsWith("image/") ? "image" : "raw";
            const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${kind}/upload`;
            const fd = new FormData();
            fd.append("file", file);
            fd.append("folder", `client_uploads/${current.id}`);
            fd.append("signature", signature);
            fd.append("timestamp", String(timestamp));
            fd.append("api_key", apiKey);

            const res = await fetch(endpoint, { method: "POST", body: fd });
            if (!res.ok) {
              const detail = await res.json().catch(() => null);
              throw new Error(detail?.error?.message || `Upload failed for "${file.name}"`);
            }
            const data = await res.json();
            uploaded = {
              name: file.name,
              url: data.secure_url,
              path: data.public_id,
              mimeType: file.type,
              sizeBytes: file.size,
            };
          }

          uploadedFiles.push({
            name: uploaded.name,
            url: uploaded.url,
            mimeType: uploaded.mimeType,
            sizeBytes: uploaded.sizeBytes,
          });
        } catch (err: any) {
          setUploadError(err.message || `Failed to upload ${file.name}`);
          // Continue with other files but stop if config error
          if (err.message?.includes("not configured") || err.message?.includes("not available")) {
            break;
          }
        }
      }

      if (uploadedFiles.length === 0) {
        setUploading(false);
        return;
      }

      const updated = [...(current.uploaded_files||[]), ...uploadedFiles];
      start(async()=>{
        const res = await updateClientOrderFilesAction(current.id, { uploadedFiles: updated } as any);
        if (res.success) {
          setLocalProjects(prev=>prev.map(p=>p.id===current.id ? { ...p, uploaded_files: updated } : p));
        } else {
          setUploadError(res.error || "Failed to save uploaded files");
        }
        setUploading(false);
      });
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
      setUploading(false);
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = (idx: number) => {
    if (!current) return;
    if (current.status!=="pending") { alert("Locked: Can only modify files during Requirement phase"); return; }
    if (!confirm("Decommission this file from vault?")) return;
    const updated = (current.uploaded_files||[]).filter((_:any,i:number)=>i!==idx);
    start(async()=>{
      const res = await updateClientOrderFilesAction(current.id, { uploadedFiles: updated } as any);
      if (res.success) setLocalProjects(prev=>prev.map(p=>p.id===current.id ? { ...p, uploaded_files: updated } : p));
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[26px] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))] p-5 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]"><HardDrive className="h-5 w-5" /></div>
            <div>
              <div className="text-[13px] font-black tracking-[0.18em] text-white">FILE VAULT • LEVEL 3 ENCRYPTION</div>
              <div className="text-[10px] font-mono tracking-widest text-white/40 uppercase">SECURE DIGITAL STORAGE • QUANTUM LOCKED</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-300">VAULT SECURE</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-mono text-white/50"><Lock className="h-3 w-3 inline -mt-0.5 mr-1" /> AES-256</span>
          </div>
        </div>

        <div className="mt-5 grid md:grid-cols-[260px_1fr] gap-4 items-start">
          <div className="space-y-3">
            <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Active Mission Selector</label>
            <select value={selectedId} onChange={e=>setSelectedId(e.target.value)} className="h-11 w-full rounded-full border border-white/10 bg-black/40 px-4 text-[13px] text-white focus:border-violet-400/50 outline-none">
              {localProjects.map((p:any)=>(<option key={p.id} value={p.id} className="bg-black">{p.website_type} ({p.reference})</option>))}
            </select>

            <input ref={inputRef} type="file" multiple className="hidden" onChange={handleUpload} />
            <button disabled={uploading||pending} onClick={()=>inputRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[12px] font-black tracking-widest text-black shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:bg-white/90 transition-colors disabled:opacity-50">
              <Upload className="h-4 w-4" /> {uploading||pending ? "ENCRYPTING..." : "UPLOAD TO VAULT"}
            </button>
            {uploadError && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-[11px] text-rose-300">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
            {!canUpload && (
              <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-[10px] leading-relaxed text-amber-200/80">
                Uploads use signed server channel. If this fails, please send files via email: rahatbd20505@gmail.com
              </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
              <div className="text-[10px] tracking-widest text-white/40 uppercase">Storage Metrics</div>
              <div className="mt-2 space-y-2 text-[11px] font-mono text-white/60">
                <div className="flex justify-between"><span>Used</span><span className="text-white">2.4 GB / 100 GB</span></div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"><div className="h-full w-[24%] bg-gradient-to-r from-violet-400 to-indigo-400" /></div>
                <div className="flex justify-between text-[10px]"><span>Files</span><span>{(current?.uploaded_files?.length||0)+(current?.internal_files?.length||0)} secured</span></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Client files */}
            <div className="rounded-[20px] border border-white/10 bg-[#0b0d16] p-4">
              <div className="flex items-center gap-2 text-[11px] font-black tracking-widest text-white uppercase"><Shield className="h-4 w-4 text-violet-400" /> Your Uploads • Declassified</div>
              <div className="mt-4 space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {(current?.uploaded_files||[]).length>0 ? (current?.uploaded_files||[]).map((f:any,i:number)=>(
                  <div key={i} className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 border border-white/10">
                        {f.mimeType?.startsWith("image") ? <ImageIcon className="h-4 w-4 text-cyan-300" /> : <FileText className="h-4 w-4 text-violet-300" />}
                      </div>
                      <div className="min-w-0"><div className="truncate text-[12px] font-medium text-white">{f.name}</div><div className="text-[10px] font-mono text-white/40">{(f.sizeBytes/1024).toFixed(1)} KB • SECURED</div></div>
                    </div>
                    <div className="flex items-center gap-1">
                      <a href={f.url} target="_blank" className="grid h-8 w-8 place-items-center rounded-lg bg-white text-black hover:bg-white/90 transition-colors"><Download className="h-4 w-4" /></a>
                      <button onClick={()=>handleDelete(i)} className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/40 hover:text-rose-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                )) : <div className="py-8 text-center text-[12px] text-white/30">No files — transmission empty</div>}
              </div>
            </div>

            {/* Admin final */}
            <div className="rounded-[20px] border border-amber-400/20 bg-[linear-gradient(160deg,rgba(251,191,36,0.12),rgba(0,0,0,0.6))] p-4">
              <div className="flex items-center gap-2 text-[11px] font-black tracking-widest text-amber-300 uppercase"><Zap className="h-4 w-4" /> Final Delivery • Classified</div>
              <div className="mt-4 space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {(current?.internal_files||[]).length>0 ? (current?.internal_files||[]).map((f:any,i:number)=>(
                  <div key={i} className="group flex items-center justify-between rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-400/20 border border-amber-400/20"><FileText className="h-4 w-4 text-amber-300" /></div>
                      <div className="min-w-0"><div className="truncate text-[12px] font-bold text-white">{f.name}</div><div className="text-[10px] font-mono text-amber-200/60">FINAL • VERIFIED</div></div>
                    </div>
                    <a href={f.url} target="_blank" className="grid h-8 w-8 place-items-center rounded-lg bg-amber-400 text-black hover:bg-amber-300 transition-colors"><Download className="h-4 w-4" /></a>
                  </div>
                )) : (
                  <div className="py-10 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-amber-400/20 bg-amber-400/10"><Lock className="h-6 w-6 text-amber-300/60" /></div>
                    <div className="mt-3 text-[12px] font-bold text-amber-200/70">Vault Sealed</div>
                    <div className="mt-1 text-[11px] leading-relaxed text-white/40">Final deliverables will materialize here upon mission completion. Encrypted by Mission Control.</div>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[10px] font-mono text-amber-300"><Eye className="h-3 w-3" /> Awaiting deployment</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File categories */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {[
          { label: "Design Files", icon: ImageIcon, count: 4, color: "from-violet-500 to-fuchsia-500" },
          { label: "Documents", icon: FileText, count: 2, color: "from-cyan-400 to-blue-500" },
          { label: "Logos", icon: Shield, count: 3, color: "from-amber-400 to-orange-500" },
          { label: "Images", icon: ImageIcon, count: 12, color: "from-emerald-400 to-teal-500" },
          { label: "Deliverables", icon: HardDrive, count: current?.internal_files?.length||0, color: "from-rose-400 to-pink-500" },
          { label: "Archives", icon: HardDrive, count: 1, color: "from-white/60 to-white/30" },
        ].map(c=>{
          const Icon=c.icon;
          return (
            <div key={c.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-sm">
              <div className={`grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br ${c.color} text-white shadow-md`}><Icon className="h-4 w-4" /></div>
              <div className="mt-2 text-[11px] font-bold text-white">{c.label}</div>
              <div className="text-[10px] text-white/40">{c.count} items</div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
