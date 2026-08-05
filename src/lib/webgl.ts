/**
 * WebGL capability detection for RahatVerse.
 *
 * The 3D scene can only mount when a real WebGL context is available.
 * Checking before mounting the Canvas lets us show a branded fallback
 * instead of relying solely on the Canvas `fallback` prop (which only
 * fires after a context-creation error) and prevents a blank/frozen
 * screen on devices where WebGL is disabled.
 *
 * Robustness notes (Phase 31 fix):
 * - Each context type is tested on a FRESH canvas. Reusing one canvas
 *   for webgl2 -> webgl -> experimental-webgl can yield false
 *   negatives on some browsers (Safari/WebKit and several Android
 *   WebViews), where a failed attempt of one type poisons the canvas
 *   for subsequent types. three.js does the same (separate canvases in
 *   WebGL.isWebGLAvailable / isWebGL2Available).
 * - Capability constructors are checked before attempting each type,
 *   so browsers without WebGL2 never even try to create a webgl2
 *   context.
 * - `failIfMajorPerformanceCaveat: false` keeps software-rendered
 *   (SwiftShader-like) contexts eligible so low-end devices still get
 *   the city instead of a fallback screen.
 * - On total failure a one-line diagnostic is logged so real-world
 *   reports can distinguish 'no WebGL at all' from a detection bug.
 */

export function detectWebGLSupport(): boolean {
  if (typeof window === "undefined") {
    // Client-only rendering (dynamic ssr:false); be optimistic server-side.
    return true;
  }

  const attributes: WebGLContextAttributes = {
    failIfMajorPerformanceCaveat: false,
  };
  const results: string[] = [];

  const tryContext = (type: "webgl2" | "webgl" | "experimental-webgl"): boolean => {
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext(type, attributes);
      results.push(`${type}:${context ? "ok" : "no"}`);
      return Boolean(context);
    } catch {
      results.push(`${type}:error`);
      return false;
    }
  };

  const hasWebGL2 = typeof window.WebGL2RenderingContext !== "undefined";
  const hasWebGL1 = typeof window.WebGLRenderingContext !== "undefined";

  const supported =
    (hasWebGL2 && tryContext("webgl2")) ||
    (hasWebGL1 && tryContext("webgl")) ||
    (hasWebGL1 && tryContext("experimental-webgl"));

  if (!supported) {
    // One-line diagnostic for devtools — helps identify false negatives
    // reported from the field ("no WebGL at all" vs "detection bug").
    console.info(
      `[RahatVerse] WebGL detection failed (${results.join(", ") || "constructors missing"}).`,
    );
  }

  return supported;
}
