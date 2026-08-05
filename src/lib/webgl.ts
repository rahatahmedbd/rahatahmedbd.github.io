/**
 * WebGL capability detection for RahatVerse.
 *
 * The 3D scene can only mount when a real WebGL context is available.
 * Checking before mounting the Canvas lets us show a branded fallback
 * instead of relying solely on the Canvas `fallback` prop (which only
 * fires after a context-creation error) and prevents a blank/frozen
 * screen on devices where WebGL is disabled.
 */
export function detectWebGLSupport(): boolean {
  if (typeof window === "undefined") {
    // Client-only rendering (dynamic ssr:false); be optimistic server-side.
    return true;
  }

  try {
    const canvas = document.createElement("canvas");
    const attributes: WebGLContextAttributes = {
      failIfMajorPerformanceCaveat: false,
    };

    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2", attributes) ||
        canvas.getContext("webgl", attributes) ||
        canvas.getContext("experimental-webgl", attributes)),
    );
  } catch {
    return false;
  }
}
