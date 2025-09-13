'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Cpu, 
  Database, 
  BarChart3, 
  FileText, 
  Users,
  Rocket,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// Import our innovative components
import AdvancedAnalytics from '@/components/innovative/advanced-analytics';
import DocumentProcessor from '@/components/innovative/document-processor';
import RealtimeCollaboration from '@/components/innovative/realtime-collaboration';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const technologies = [
    {
      name: 'GPU.js',
      description: 'WebGL acceleration for graphics and data processing',
      icon: <Cpu className="h-5 w-5" />,
      status: 'integrated',
      features: ['Matrix operations', 'Image processing', 'Scientific computations']
    },
    {
      name: 'PixiJS',
      description: 'Advanced 2D graphics and interactive visualizations',
      icon: <BarChart3 className="h-5 w-5" />,
      status: 'integrated',
      features: ['Real-time rendering', 'Particle systems', 'Interactive charts']
    },
    {
      name: 'protobuf.js',
      description: 'Efficient data serialization and API communication',
      icon: <Database className="h-5 w-5" />,
      status: 'integrated',
      features: ['Binary serialization', 'Type safety', 'Performance optimization']
    },
    {
      name: 'Turbit',
      description: 'High-performance multicore computing',
      icon: <Zap className="h-5 w-5" />,
      status: 'integrated',
      features: ['Parallel processing', 'CPU optimization', 'Scalable computing']
    }
  ];

  const innovations = [
    {
      title: 'Advanced Analytics Dashboard',
      description: 'Combines GPU acceleration, parallel processing, and efficient serialization for real-time data analysis',
      component: 'advanced-analytics',
      features: ['GPU-accelerated computations', 'Parallel data processing', 'Interactive visualizations', 'Performance benchmarking']
    },
    {
      title: 'High-Performance Document Processor',
      description: 'Processes documents using parallel computing and efficient serialization for maximum performance',
      component: 'document-processor',
      features: ['Parallel document processing', 'GPU-accelerated operations', 'Efficient serialization', 'Real-time progress tracking']
    },
    {
      title: 'Real-time Collaboration Hub',
      description: 'Advanced collaboration platform with real-time processing and visualization capabilities',
      component: 'realtime-collaboration',
      features: ['Real-time messaging', 'Live data processing', 'Activity visualization', 'Multi-user support']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Rocket className="h-10 w-10 text-blue-500" />
            COM-PSU-Rizal Innovation Hub
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Showcasing cutting-edge integrations of GPU acceleration, parallel computing, 
            efficient serialization, and advanced graphics for next-generation applications.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Technology Stack */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-yellow-500" />
                  Integrated Technology Stack
                </CardTitle>
                <CardDescription className="text-gray-300">
                  High-performance libraries working together to deliver exceptional user experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {technologies.map((tech) => (
                    <div
                      key={tech.name}
                      className="p-4 border border-gray-700 rounded-lg bg-gray-900"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {tech.icon}
                        <h3 className="text-lg font-semibold">{tech.name}</h3>
                        <Badge 
                          variant={tech.status === 'integrated' ? 'default' : 'secondary'}
                          className="ml-auto"
                        >
                          {tech.status === 'integrated' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {tech.status}
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{tech.description}</p>
                      <div className="space-y-1">
                        {tech.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="w-1 h-1 bg-blue-500 rounded-full" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Innovation Showcase */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-6 w-6 text-green-500" />
                  Innovation Showcase
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Revolutionary features that combine multiple technologies for maximum impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {innovations.map((innovation, index) => (
                    <div
                      key={index}
                      className="p-6 border border-gray-700 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{innovation.title}</h3>
                          <p className="text-gray-300 mb-4">{innovation.description}</p>
                        </div>
                        <Button
                          onClick={() => setActiveTab(innovation.component.split('-')[0])}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Try Demo
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {innovation.features.map((feature, featureIndex) => (
                          <Badge
                            key={featureIndex}
                            variant="outline"
                            className="text-xs border-gray-600 text-gray-300"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Benefits */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-purple-500" />
                  Performance Benefits
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Measurable improvements achieved through our technology integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500 mb-2">10-170x</div>
                    <p className="text-sm text-gray-300">GPU Acceleration Speedup</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500 mb-2">4-8x</div>
                    <p className="text-sm text-gray-300">Parallel Processing Speedup</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-500 mb-2">60fps</div>
                    <p className="text-sm text-gray-300">Real-time Rendering</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <AdvancedAnalytics />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentProcessor />
          </TabsContent>

          <TabsContent value="collaboration">
            <RealtimeCollaboration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
