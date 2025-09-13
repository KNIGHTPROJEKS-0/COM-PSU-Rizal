import { GPU } from 'gpu.js';

// GPU instance for high-performance computations
let gpuInstance: GPU | null = null;

/**
 * Get or create GPU instance
 */
export function getGPUInstance(): GPU {
  if (!gpuInstance) {
    gpuInstance = new GPU({
      mode: 'gpu' // Use GPU mode for best performance
    });
  }
  return gpuInstance;
}

/**
 * Matrix multiplication using GPU acceleration
 */
export function createMatrixMultiplicationKernel() {
  const gpu = getGPUInstance();
  
  return gpu.createKernel(function(a: number[][], b: number[][]) {
    let sum = 0;
    for (let i = 0; i < 512; i++) {
      sum += a[this.thread.y][i] * b[i][this.thread.x];
    }
    return sum;
  }).setOutput([512, 512]);
}

/**
 * Data processing kernel for analytics
 */
export function createDataProcessingKernel() {
  const gpu = getGPUInstance();
  
  return gpu.createKernel(function(data: number[]) {
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
  
  return gpu.createKernel(function(image: number[][][]) {
    const pixel = image[this.thread.y][this.thread.x];
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    const a = pixel[3];
    
    // Apply grayscale filter
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    
    this.color(gray, gray, gray, a);
  }).setOutput([512, 512]).setGraphical(true);
}

/**
 * Scientific computation kernel
 */
export function createScientificKernel() {
  const gpu = getGPUInstance();
  
  return gpu.createKernel(function(data: number[][]) {
    const x = this.thread.x;
    const y = this.thread.y;
    const value = data[y][x];
    
    // Complex mathematical operations
    const result = Math.sin(value * Math.PI) * Math.cos(value * Math.PI) + 
                   Math.exp(-value * 0.1) * Math.log(value + 1);
    
    return result;
  }).setOutput([256, 256]);
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
export function isGPUSupported(): boolean {
  try {
    const gpu = new GPU();
    return GPU.isGPUSupported;
  } catch {
    return false;
  }
}
