import { GPU as GPUClass } from "../integrations/gpu.js/src/index.js";

// GPU instance for high-performance computations
let gpuInstance: GPUClass | null = null;

/**
 * Get or create GPU instance
 */
export function getGPUInstance(): GPUClass {
  if (!gpuInstance) {
    gpuInstance = new GPUClass({
      mode: "gpu", // Use GPU mode for best performance
    });
  }
  return gpuInstance;
}

/**
 * Matrix multiplication using GPU acceleration
 */
export function createMatrixMultiplicationKernel() {
  const gpu = getGPUInstance();

  return gpu.createKernel(
    function (
      this: { thread: { x: number; y: number } },
      a: number[][],
      b: number[][],
    ) {
      let sum = 0;
      for (let i = 0; i < 512; i++) {
        sum += a[this.thread.y][i] * b[i][this.thread.x];
      }
      return sum;
    },
  ).setOutput([512, 512]);
}

/**
 * Data processing kernel for analytics
 */
export function createDataProcessingKernel() {
  const gpu = getGPUInstance();

  return gpu.createKernel(function (data: number[]) {
    const index = this.thread.x;
    const value = data[index];

    // Apply various transformations
    const normalized = value / 100;
    const squared = normalized * normalized;
    const smoothed = Math.sin(squared * Math.PI);

    return smoothed;
  }).setOutput([1000]);
}

/**
 * Image processing kernel for graphics
 */
export function createImageProcessingKernel() {
  const gpu = getGPUInstance();

  return gpu.createKernel(
    function (this: { thread: { x: number; y: number } }, image: number[][][]) {
      const pixel = image[this.thread.y][this.thread.x];
      const gray = (pixel[0] + pixel[1] + pixel[2]) / 3;
      return [gray, gray, gray, pixel[3]];
    },
  ).setOutput([512, 512]);
}

/**
 * Scientific computation kernel
 */
export function createScientificKernel() {
  const gpu = getGPUInstance();

  return gpu.createKernel(
    function (this: { thread: { x: number; y: number } }, data: number[][]) {
      const x = this.thread.x;
      const y = this.thread.y;
      const value = data[y][x];

      // Complex mathematical operations
      const result = Math.sin(value * Math.PI) * Math.cos(value * Math.PI) +
        Math.exp(-value * 0.1) * Math.log(value + 1);

      return result;
    },
  ).setOutput([256, 256]);
}

/**
 * Cleanup GPU resources
 */
export function cleanupGPU() {
  if (gpuInstance) {
    gpuInstance.destroy();
    gpuInstance = null;
  }
}

/**
 * Check GPU support
 */
export function isGPUSupported() {
  const gpu = new GPUClass();
  return GPUClass.isGPUSupported;
}
