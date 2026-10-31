import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

// Run via `npm exec --package=ffmpeg-static -- node scripts/prepare-hero-video.mjs`.
// The encoder is a preparation tool, not a storefront dependency.
const candidates = (process.env.PATH || "").split(path.delimiter).map(entry => path.resolve(entry, "..", "ffmpeg-static", process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg"));
const encoder = candidates.find(candidate => fs.existsSync(candidate));
if (!encoder) throw new Error("The temporary ffmpeg-static binary could not be located.");
const input = process.argv[2];
if (!input || !fs.existsSync(input)) throw new Error("Pass the original video path as the final argument. Source files are never modified.");
const result = spawnSync(encoder, ["-y", "-i", input, "-an", "-vf", "scale=w='min(1440,iw)':h='min(1440,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2", "-c:v", "libx264", "-crf", "25", "-preset", "medium", "-pix_fmt", "yuv420p", "-r", "30", "-movflags", "+faststart", "public/videos/vode-campaign.mp4"], { stdio: "inherit", windowsHide: true });
if (result.status !== 0) process.exit(result.status || 1);
const poster = spawnSync(encoder, ["-y", "-ss", "1", "-i", "public/videos/vode-campaign.mp4", "-frames:v", "1", "-q:v", "2", "public/videos/vode-campaign-poster.jpg"], { stdio: "inherit", windowsHide: true });
if (poster.status !== 0) process.exit(poster.status || 1);
console.log(`Optimized hero: ${(fs.statSync("public/videos/vode-campaign.mp4").size / 1024 / 1024).toFixed(2)} MB`);
