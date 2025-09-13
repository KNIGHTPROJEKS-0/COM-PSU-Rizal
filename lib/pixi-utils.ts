import { Application, Assets, Sprite, Graphics, Text, Container, Ticker } from 'pixi.js';

// PixiJS application instance
let pixiApp: Application | null = null;

/**
 * Initialize PixiJS application
 */
export async function initPixiApp(canvas: HTMLCanvasElement, options?: {
  width?: number;
  height?: number;
  backgroundColor?: number;
}): Promise<Application> {
  if (pixiApp) {
    return pixiApp;
  }

  pixiApp = new Application();
  
  await pixiApp.init({
    canvas,
    width: options?.width || 800,
    height: options?.height || 600,
    background: options?.backgroundColor || 0x1099bb,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true
  });

  return pixiApp;
}

/**
 * Create interactive data visualization
 */
export function createDataVisualization(app: Application, data: number[]) {
  const container = new Container();
  app.stage.addChild(container);

  // Create bars for data visualization
  data.forEach((value, index) => {
    const bar = new Graphics();
    const barWidth = app.screen.width / data.length;
    const barHeight = (value / Math.max(...data)) * app.screen.height * 0.8;
    
    bar.rect(index * barWidth, app.screen.height - barHeight, barWidth - 2, barHeight);
    bar.fill(0x66ccff);
    bar.stroke({ width: 1, color: 0xffffff });
    
    container.addChild(bar);
  });

  return container;
}

/**
 * Create animated particle system
 */
export function createParticleSystem(app: Application, particleCount: number = 100) {
  const container = new Container();
  app.stage.addChild(container);

  const particles: Graphics[] = [];

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    const particle = new Graphics();
    particle.circle(0, 0, Math.random() * 3 + 1);
    particle.fill(Math.random() * 0xffffff);
    
    particle.x = Math.random() * app.screen.width;
    particle.y = Math.random() * app.screen.height;
    
    container.addChild(particle);
    particles.push(particle);
  }

  // Animate particles
  const ticker = new Ticker();
  ticker.add(() => {
    particles.forEach(particle => {
      particle.x += (Math.random() - 0.5) * 2;
      particle.y += (Math.random() - 0.5) * 2;
      
      // Wrap around screen
      if (particle.x < 0) particle.x = app.screen.width;
      if (particle.x > app.screen.width) particle.x = 0;
      if (particle.y < 0) particle.y = app.screen.height;
      if (particle.y > app.screen.height) particle.y = 0;
    });
  });
  ticker.start();

  return { container, particles, ticker };
}

/**
 * Create interactive chart
 */
export function createInteractiveChart(app: Application, chartData: { x: number; y: number; label: string }[]) {
  const container = new Container();
  app.stage.addChild(container);

  const maxX = Math.max(...chartData.map(d => d.x));
  const maxY = Math.max(...chartData.map(d => d.y));

  // Draw axes
  const axes = new Graphics();
  axes.moveTo(50, app.screen.height - 50);
  axes.lineTo(app.screen.width - 50, app.screen.height - 50);
  axes.moveTo(50, 50);
  axes.lineTo(50, app.screen.height - 50);
  axes.stroke({ width: 2, color: 0x000000 });
  container.addChild(axes);

  // Draw data points
  chartData.forEach((point, index) => {
    const x = 50 + (point.x / maxX) * (app.screen.width - 100);
    const y = app.screen.height - 50 - (point.y / maxY) * (app.screen.height - 100);

    const circle = new Graphics();
    circle.circle(x, y, 5);
    circle.fill(0xff6b6b);
    circle.stroke({ width: 2, color: 0xffffff });

    // Add label
    const label = new Text({
      text: point.label,
      style: {
        fontSize: 12,
        fill: 0x000000
      }
    });
    label.x = x - label.width / 2;
    label.y = y + 10;

    container.addChild(circle);
    container.addChild(label);
  });

  return container;
}

/**
 * Create loading animation
 */
export function createLoadingAnimation(app: Application) {
  const container = new Container();
  app.stage.addChild(container);

  const spinner = new Graphics();
  spinner.circle(0, 0, 20);
  spinner.stroke({ width: 4, color: 0x66ccff });
  container.addChild(spinner);

  const ticker = new Ticker();
  let rotation = 0;
  ticker.add(() => {
    rotation += 0.1;
    spinner.rotation = rotation;
  });
  ticker.start();

  return { container, spinner, ticker };
}

/**
 * Create text with effects
 */
export function createStyledText(text: string, style?: any) {
  return new Text({
    text,
    style: {
      fontSize: 24,
      fill: 0xffffff,
      stroke: { width: 2, color: 0x000000 },
      dropShadow: {
        color: 0x000000,
        blur: 4,
        angle: Math.PI / 6,
        distance: 6
      },
      ...style
    }
  });
}

/**
 * Cleanup PixiJS resources
 */
export function cleanupPixi() {
  if (pixiApp) {
    pixiApp.destroy(true, { children: true, texture: true, baseTexture: true });
    pixiApp = null;
  }
}

/**
 * Get PixiJS application instance
 */
export function getPixiApp(): Application | null {
  return pixiApp;
}
