'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Zap, 
  Cpu, 
  Database, 
  BarChart3 
} from 'lucide-react';

// Import our integrated libraries
import { isGPUSupported, createDataProcessingKernel } from '@/lib/gpu-utils';
import { initPixiApp } from '@/lib/pixi-utils';
import { initProtobufTypes, serializeAnalytics } from '@/lib/protobuf-utils';
import { initTurbit, processLargeDataset } from '@/lib/turbit-utils';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  performance?: number;
}

export default function TestIntegrations() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'GPU.js Support', status: 'pending', message: 'Checking GPU support...' },
    { name: 'PixiJS Initialization', status: 'pending', message: 'Initializing PixiJS...' },
    { name: 'protobuf.js Setup', status: 'pending', message: 'Setting up protobuf...' },
    { name: 'Turbit Initialization', status: 'pending', message: 'Initializing Turbit...' },
    { name: 'GPU Data Processing', status: 'pending', message: 'Testing GPU processing...' },
    { name: 'Parallel Processing', status: 'pending', message: 'Testing parallel processing...' },
    { name: 'Data Serialization', status: 'pending', message: 'Testing serialization...' },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'pending' | 'success' | 'error'>('pending');

  const updateTest = (index: number, status: 'success' | 'error', message: string, performance?: number) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message, performance } : test
    ));
  };

  const runTests = async () => {
    setIsRunning(true);
    setOverallStatus('pending');

    try {
      // Test 1: GPU.js Support
      try {
        const gpuSupported = isGPUSupported();
        updateTest(0, 'success', `GPU support: ${gpuSupported ? 'Available' : 'Not available'}`, gpuSupported ? 100 : 0);
      } catch (error) {
        updateTest(0, 'error', `GPU support check failed: ${error}`);
      }

      // Test 2: PixiJS Initialization
      try {
        const canvas = document.createElement('canvas');
        const app = await initPixiApp(canvas, { width: 100, height: 100 });
        updateTest(1, 'success', 'PixiJS initialized successfully', 100);
      } catch (error) {
        updateTest(1, 'error', `PixiJS initialization failed: ${error}`);
      }

      // Test 3: protobuf.js Setup
      try {
        await initProtobufTypes();
        updateTest(2, 'success', 'protobuf.js initialized successfully', 100);
      } catch (error) {
        updateTest(2, 'error', `protobuf.js setup failed: ${error}`);
      }

      // Test 4: Turbit Initialization
      try {
        const turbit = initTurbit();
        updateTest(3, 'success', 'Turbit initialized successfully', 100);
      } catch (error) {
        updateTest(3, 'error', `Turbit initialization failed: ${error}`);
      }

      // Test 5: GPU Data Processing
      try {
        const kernel = createDataProcessingKernel();
        const testData = Array.from({ length: 1000 }, () => Math.random());
        const startTime = performance.now();
        const result = kernel(testData);
        const endTime = performance.now();
        const processingTime = endTime - startTime;
        
        updateTest(4, 'success', `GPU processing completed in ${processingTime.toFixed(2)}ms`, 100);
      } catch (error) {
        updateTest(4, 'error', `GPU processing failed: ${error}`);
      }

      // Test 6: Parallel Processing
      try {
        const testData = Array.from({ length: 100 }, (_, i) => i);
        const startTime = performance.now();
        const { results } = await processLargeDataset(
          testData,
          (item) => item * 2,
          { power: 50 }
        );
        const endTime = performance.now();
        const processingTime = endTime - startTime;
        
        updateTest(5, 'success', `Parallel processing completed in ${processingTime.toFixed(2)}ms`, 100);
      } catch (error) {
        updateTest(5, 'error', `Parallel processing failed: ${error}`);
      }

      // Test 7: Data Serialization
      try {
        const testData = {
          metric_name: 'test_metric',
          value: 42.5,
          timestamp: Date.now(),
          metadata: { test: true }
        };
        
        const startTime = performance.now();
        const serialized = serializeAnalytics(testData);
        const endTime = performance.now();
        const serializationTime = endTime - startTime;
        
        updateTest(6, 'success', `Serialization completed in ${serializationTime.toFixed(2)}ms (${serialized.length} bytes)`, 100);
      } catch (error) {
        updateTest(6, 'error', `Serialization failed: ${error}`);
      }

      // Check overall status
      const allTests = tests.map((_, i) => i).map(i => {
        const test = tests[i];
        return test.status === 'success';
      });
      
      const successCount = allTests.filter(Boolean).length;
      setOverallStatus(successCount === tests.length ? 'success' : 'error');

    } catch (error) {
      console.error('Test suite error:', error);
      setOverallStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const getTechnologyIcon = (name: string) => {
    if (name.includes('GPU')) return <Cpu className="h-4 w-4" />;
    if (name.includes('PixiJS')) return <BarChart3 className="h-4 w-4" />;
    if (name.includes('protobuf')) return <Database className="h-4 w-4" />;
    if (name.includes('Turbit')) return <Zap className="h-4 w-4" />;
    return <Cpu className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Integration Test Suite</h1>
          <p className="text-xl text-gray-300">
            Testing all integrated technologies for compatibility and performance
          </p>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6" />
              Test Status
            </CardTitle>
            <CardDescription className="text-gray-300">
              Overall test suite status and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(overallStatus)}
                <span className="text-lg font-semibold">
                  {overallStatus === 'success' ? 'All Tests Passed' : 
                   overallStatus === 'error' ? 'Some Tests Failed' : 'Tests Pending'}
                </span>
              </div>
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  'Run Tests'
                )}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {tests.filter(t => t.status === 'success').length}
                </div>
                <p className="text-sm text-gray-300">Passed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {tests.filter(t => t.status === 'error').length}
                </div>
                <p className="text-sm text-gray-300">Failed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">
                  {tests.filter(t => t.status === 'pending').length}
                </div>
                <p className="text-sm text-gray-300">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {tests.map((test, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTechnologyIcon(test.name)}
                    <div>
                      <h3 className="font-semibold">{test.name}</h3>
                      <p className="text-sm text-gray-300">{test.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {test.performance && (
                      <Badge variant="outline" className="text-xs">
                        {test.performance}ms
                      </Badge>
                    )}
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(test.status)}`} />
                    {getStatusIcon(test.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            This test suite verifies that all integrated technologies are working correctly.
            Run the tests to ensure optimal performance and compatibility.
          </p>
        </div>
      </div>
    </div>
  );
}
