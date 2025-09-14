'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  MessageCircle, 
  Send, 
  Zap, 
  Cpu, 
  Database,
  Activity,
  Loader2,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';

// Import our integrated libraries
import { 
  processLargeDataset,
  analyzeDataInParallel 
} from '@/lib/turbit-utils';
import { 
  serializeAnalytics, 
  deserializeAnalytics,
  compareSerializationSizes 
} from '@/lib/protobuf-utils';
import { 
  createDataProcessingKernel 
} from '@/lib/gpu-utils';
import { 
  initPixiApp, 
  createParticleSystem,
  createStyledText 
} from '@/lib/pixi-utils';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'faculty' | 'student';
  isOnline: boolean;
  lastSeen: number;
}

interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'data' | 'analysis';
  metadata?: any;
}

interface CollaborationStats {
  totalMessages: number;
  activeUsers: number;
  dataProcessed: number;
  processingTime: number;
  efficiency: number;
}

export default function RealtimeCollaboration() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Dr. Smith', role: 'admin', isOnline: true, lastSeen: Date.now() },
    { id: '2', name: 'Prof. Johnson', role: 'faculty', isOnline: true, lastSeen: Date.now() },
    { id: '3', name: 'Student Alice', role: 'student', isOnline: false, lastSeen: Date.now() - 300000 },
  ]);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<CollaborationStats | null>(null);
  const [currentUser] = useState<User>({ id: '4', name: 'You', role: 'admin', isOnline: true, lastSeen: Date.now() });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixiAppRef = useRef<any>(null);

  useEffect(() => {
    // Initialize PixiJS for real-time visualization
    if (canvasRef.current) {
      initPixiApp(canvasRef.current, {
        width: 400,
        height: 300,
        backgroundColor: 0x0a0a0a
      }).then(app => {
        pixiAppRef.current = app;
        
        // Create particle system for activity visualization
        const { container } = createParticleSystem(app, 50);
        
        // Add activity text
        const activityText = createStyledText('Real-time Activity', {
          fontSize: 16,
          fill: 0x00ff00
        });
        activityText.x = 20;
        activityText.y = 20;
        container.addChild(activityText);
      });
    }

    // Simulate real-time updates
    const interval = setInterval(() => {
      updateUserActivity();
      processRealtimeData();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const updateUserActivity = () => {
    setUsers(prev => prev.map(user => ({
      ...user,
      isOnline: Math.random() > 0.1, // 90% chance of being online
      lastSeen: user.isOnline ? Date.now() : user.lastSeen
    })));
  };

  const processRealtimeData = async () => {
    try {
      // Generate sample analytics data
      const analyticsData = {
        metric_name: 'collaboration_activity',
        value: Math.random() * 100,
        timestamp: Date.now(),
        metadata: {
          activeUsers: users.filter(u => u.isOnline).length,
          messageCount: messages.length,
          processingMethod: 'realtime'
        }
      };

      // Serialize with protobuf
      const serialized = serializeAnalytics(analyticsData);
      
      // Process with GPU
      const gpuKernel = createDataProcessingKernel();
      const processedData = gpuKernel([analyticsData.value]);
      
      // Update stats
      setStats({
        totalMessages: messages.length,
        activeUsers: users.filter(u => u.isOnline).length,
        dataProcessed: serialized.length,
        processingTime: 5, // Simulated
        efficiency: Math.random() * 100
      });

    } catch (error) {
      console.error('Real-time processing error:', error);
    }
  };

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: newMessage,
      timestamp: Date.now(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // Process message data in parallel
    if (newMessage.includes('analyze') || newMessage.includes('data')) {
      setIsProcessing(true);
      
      try {
        const { results } = await analyzeDataInParallel(
          [Array.from(newMessage).map(c => c.charCodeAt(0))],
          'statistical'
        );
        
        const analysisMessage: Message = {
          id: (Date.now() + 1).toString(),
          userId: 'system',
          content: `Analysis complete: ${JSON.stringify(results[0])}`,
          timestamp: Date.now(),
          type: 'analysis',
          metadata: results[0]
        };
        
        setMessages(prev => [...prev, analysisMessage]);
        
      } catch (error) {
        console.error('Analysis error:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  }, [newMessage, currentUser.id]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'faculty': return 'bg-blue-500';
      case 'student': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'analysis': return <BarChart3 className="h-4 w-4" />;
      case 'data': return <Database className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Real-time Collaboration Hub
          </CardTitle>
          <CardDescription>
            Advanced collaboration with GPU acceleration, parallel processing, and efficient data serialization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chat Interface */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Live Chat</h3>
                <Badge variant="outline">
                  {users.filter(u => u.isOnline).length} online
                </Badge>
              </div>
              
              <div className="border rounded-lg h-64 overflow-y-auto p-4 space-y-2">
                {messages.map((message) => {
                  const user = users.find(u => u.id === message.userId) || currentUser;
                  const isOwn = message.userId === currentUser.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-lg ${
                          isOwn 
                            ? 'bg-blue-500 text-white' 
                            : message.userId === 'system'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {getMessageTypeIcon(message.type)}
                          <span className="text-xs font-medium">
                            {user.name}
                          </span>
                          <span className="text-xs opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        {message.metadata && (
                          <div className="mt-2 text-xs opacity-70">
                            <pre>{JSON.stringify(message.metadata, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {isProcessing && (
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing data...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message... (try 'analyze data' for demo)"
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Real-time Visualization */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Activity Visualization</h3>
              <div className="border rounded-lg overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-64" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Active Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className={`w-3 h-3 rounded-full ${getRoleColor(user.role)}`} />
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  {user.isOnline ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-xs text-gray-500">
                    {user.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Real-time Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.totalMessages}</p>
                <p className="text-sm text-gray-500">Messages</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
                <p className="text-sm text-gray-500">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.dataProcessed}</p>
                <p className="text-sm text-gray-500">Data Processed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.efficiency.toFixed(1)}%</p>
                <p className="text-sm text-gray-500">Efficiency</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
