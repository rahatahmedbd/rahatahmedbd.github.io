import * as THREE from "three";

/** Tiny procedural texture helpers — no external asset downloads. */

let labelCtx: CanvasRenderingContext2D | null = null;

function ctx2d(w: number, h: number): CanvasRenderingContext2D {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  return g;
}

/** Create a soft radial glow sprite texture (white core → transparent). */
export function glowTexture(inner = "rgba(255,255,255,1)"): THREE.Texture {
  const g = ctx2d(128, 128);
  const grad = g.createRadialGradient(64, 64, 2, 64, 64, 64);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.35, "rgba(255,255,255,0.45)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(g.canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Generate a 1px-noise normal-ish bump texture for subtle surface detail. */
export function noiseTexture(): THREE.Texture {
  const g = ctx2d(64, 64);
  const img = g.createImageData(64, 64);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 110 + Math.random() * 30;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(g.canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export interface TextSpriteOpts {
  text: string;
  fontSize?: number;
  color?: string;
  bg?: string | null;
  sub?: string;
  subColor?: string;
}

/**
 * Render a text block to a transparent PNG texture suitable for a Sprite or a
 * small floating billboard.
 */
export function textTexture(opts: TextSpriteOpts): THREE.CanvasTexture {
  const pad = 14;
  const size = 1024;
  const g = ctx2d(size, size);
  const fontFamily = `"Inter", "Segoe UI", system-ui, sans-serif`;

  // Two-pass measuring.
  const fs = opts.fontSize ?? 64;
  const subFs = Math.round(fs * 0.55);
  const mainH = fs * 1.1;
  const subH = opts.sub ? subFs * 1.4 : 0;
  const contentH = mainH + subH;
  const lineW = size - pad * 2;

  // Compose wrapped lines.
  const wrap = (txt: string, font: string): string[] => {
    g.font = font;
    const words = txt.split(" ");
    const lines: string[] = [];
    let cur = "";
    for (const w of words) {
      const t = cur ? cur + " " + w : w;
      if (g.measureText(t).width > lineW && cur) {
        lines.push(cur);
        cur = w;
      } else {
        cur = t;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  };

  const mainLines = wrap(opts.text, `${fs}px ${fontFamily}`);
  const subLines = opts.sub ? wrap(opts.sub, `${subFs}px ${fontFamily}`) : [];
  const totalLines = mainLines.length + subLines.length;

  // scale down if too many lines
  let scale = 1;
  const maxH = size - pad * 2;
  if (contentH * totalLines * 0.5 + fs * 1.2 > maxH) {
    scale = Math.max(0.3, maxH / (contentH * totalLines * 0.5 + fs * 1.2));
  }
  const effFs = Math.round(fs * scale);

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `700 ${effFs}px ${fontFamily}`;
  g.fillStyle = opts.color ?? "#ffffff";
  const lineH = effFs * 1.12;
  let y = pad + lineH;
  for (const ln of mainLines) {
    g.fillText(ln, size / 2, y);
    y += lineH;
  }
  const effSubFs = Math.max(20, Math.round(subFs * scale));
  g.font = `500 ${effSubFs}px ${fontFamily}`;
  g.fillStyle = opts.subColor ?? "rgba(255,255,255,0.85)";
  y += effSubFs * 0.3;
  for (const ln of subLines) {
    g.fillText(ln, size / 2, y);
    y += effSubFs * 1.15;
  }

  const tex = new THREE.CanvasTexture(g.canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * Draw text onto an existing small canvas context — used by dynamic billboard
 * screens (advertising) that animate each frame.
 */
export function makeBillboardCanvas(
  w: number,
  h: number,
  draw: (g: CanvasRenderingContext2D, w: number, h: number, t: number) => void
): { canvas: HTMLCanvasElement; texture: THREE.CanvasTexture; update: (t: number) => void } {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext("2d")!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const update = (t: number) => {
    draw(g, w, h, t);
    texture.needsUpdate = true;
  };
  return { canvas, texture, update };
}

/** Simple circular gradient texture for the info/plaza medallion. */
export function medallionTexture(accent: string): THREE.Texture {
  const g = ctx2d(256, 256);
  const grad = g.createRadialGradient(128, 128, 20, 128, 128, 128);
  grad.addColorStop(0, accent);
  grad.addColorStop(1, "rgba(255,255,255,0.05)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(g.canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
