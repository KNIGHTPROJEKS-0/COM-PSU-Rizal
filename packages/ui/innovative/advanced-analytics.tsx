'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Cpu, 
  Zap, 
  Database, 
  TrendingUp, 
  Activity,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Import our integrated libraries
import { 
  createDataProcessingKernel, 
  createScientificKernel, 
  isGPUSupported,
  cleanupGPU 
} from '@/lib/gpu-utils';
import { 
  initPixiApp, 
  createDataVisualization, 
  createInteractiveChart,
  cleanupPixi 
} from '@/lib/pixi-utils';
import { 
  processLargeDataset, 
  analyzeDataInParallel,
  benchmarkTurbitPerformance,
  getSystemInfo 
} from '@/lib/turbit-utils';
import { 
  serializeAnalytics, 
  deserializeAnalytics,
  compareSerializationSizes 
} from '@/lib/protobuf-utils';

interface AnalyticsData {
  timestamp: number;
  value: number;
  category: string;
  metadata: Record<string, string>;
}

interface ProcessingStats {
  gpuTime: number;
  cpuTime: number;
  parallelTime: number;
  serializationTime: number;
  totalTime: number;
  speedup: number;
  efficiency: number;
}

export default function AdvancedAnalytics() {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<ProcessingStats | null>(null);
  const [systemInfo, setSystemInfo] = useState(getSystemInfo());
  const [gpuSupported, setGpuSupported] = useState(false);
  const [activeTab, setActiveTab] = useState('realtime');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixiAppRef = useRef<any>(null);

  useEffect(() => {
    // Check GPU support
    setGpuSupported(isGPUSupported());
    
    // Generate sample data
    generateSampleData();
    
    // Initialize PixiJS
    if (canvasRef.current) {
      initPixiApp(canvasRef.current, {
        width: 800,
        height: 400,
        backgroundColor: 0x1a1a1a
      }).then(app => {
        pixiAppRef.current = app;
      });
    }

    return () => {
      cleanupGPU();
      cleanupPixi();
    };
  }, []);

  const generateSampleData = () => {
    const sampleData: AnalyticsData[] = [];
    const categories = ['performance', 'memory', 'network', 'database', 'user'];
    
    for (let i = 0; i < 1000; i++) {
      sampleData.push({
        timestamp: Date.now() - (1000 - i) * 60000,
        value: Math.random() * 100,
        category: categories[Math.floor(Math.random() * categories.length)],
        metadata: {
          source: 'system',
          version: '1.0.0',
          region: 'us-east-1'
        }
      });
    }
    
    setData(sampleData);
  };

  const processDataWithAllTechnologies = async () => {
    setIsProcessing(true);
    const startTime = Date.now();
    
    try {
      // 1. GPU Processing
      const gpuStart = Date.now();
      const gpuKernel = createDataProcessingKernel();
      const gpuData = data.map(d => d.value);
      const gpuResult = gpuKernel(gpuData);
      const gpuTime = Date.now() - gpuStart;

      // 2. Parallel CPU Processing with Turbit
      const parallelStart = Date.now();
      const { results: parallelResults, stats: parallelStats } = await analyzeDataInParallel(
        data.map(d => [d.value]),
        'statistical'
      );
      const parallelTime = Date.now() - parallelStart;

      // 3. Serialization comparison
      const serializationStart = Date.now();
      const serializedData = serializeAnalytics({
        metric_name: 'combined_analysis',
        value: gpuResult[0] || 0,
        timestamp: Date.now(),
        metadata: { method: 'gpu_turbit_combined' }
      });
      const serializationTime = Date.now() - serializationStart;

      // 4. Benchmark performance
      const benchmark = await benchmarkTurbitPerformance(
        1000,
        (arr) => arr.map(x => Math.sin(x) * Math.cos(x))
      );

      // 5. Update visualization
      if (pixiAppRef.current) {
        const chartData = data.slice(0, 50).map((d, i) => ({
          x: i,
          y: d.value,
          label: d.category
        }));
        createInteractiveChart(pixiAppRef.current, chartData);
      }

      const totalTime = Date.now() - startTime;
      
      setStats({
        gpuTime,
        cpuTime: parallelTime,
        parallelTime: parallelStats.timeTakenSeconds * 1000,
        serializationTime,
        totalTime,
        speedup: benchmark.speedup,
        efficiency: benchmark.efficiency
      });

    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getPerformanceColor = (value: number, max: number) => {
    const ratio = value / max;
    if (ratio > 0.8) return 'text-green-500';
    if (ratio > 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Advanced Analytics Dashboard
          </CardTitle>
          <CardDescription>
            High-performance analytics using GPU acceleration, parallel processing, and efficient serialization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              <span className="text-sm">CPU Cores: {systemInfo.cores}</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="text-sm">Memory: {systemInfo.memory}GB</span>
            </div>
            <div className="flex items-center gap-2">
              {gpuSupported ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )}
              <span className="text-sm">
                GPU: {gpuSupported ? 'Supported' : 'Not Available'}
              </span>
            </div>
          </div>

          <Button 
            onClick={processDataWithAllTechnologies}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing with All Technologies...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Run Advanced Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="realtime">Real-time Visualization</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="data">Data Processing</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Data Visualization</CardTitle>
              <CardDescription>
                Powered by PixiJS for smooth 60fps rendering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <canvas 
                  ref={canvasRef}
                  className="w-full h-96"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Processing Times
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">GPU Processing</span>
                    <Badge variant="outline">{stats.gpuTime}ms</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Parallel CPU</span>
                    <Badge variant="outline">{stats.parallelTime}ms</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Serialization</span>
                    <Badge variant="outline">{stats.serializationTime}ms</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Time</span>
                    <Badge variant="outline">{stats.totalTime}ms</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Speedup Factor</span>
                      <span className={getPerformanceColor(stats.speedup, 4)}>
                        {stats.speedup.toFixed(2)}x
                      </span>
                    </div>
                    <Progress value={(stats.speedup / 4) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Efficiency</span>
                      <span className={getPerformanceColor(stats.efficiency, 1)}>
                        {(stats.efficiency * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={stats.efficiency * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Processing Results</CardTitle>
              <CardDescription>
                {data.length} data points processed with advanced algorithms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Data Points</span>
                  <Badge>{data.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Categories</span>
                  <Badge>{new Set(data.map(d => d.category)).size}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Time Range</span>
                  <Badge>
                    {new Date(Math.min(...data.map(d => d.timestamp))).toLocaleTimeString()} - 
                    {new Date(Math.max(...data.map(d => d.timestamp))).toLocaleTimeString()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
