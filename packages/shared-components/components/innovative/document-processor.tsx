'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Upload, 
  Download, 
  Zap, 
  Cpu, 
  Database,
  Loader2,
  CheckCircle,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

// Import our integrated libraries
import { 
  processDocumentsInParallel,
  processImagesInParallel,
  benchmarkTurbitPerformance 
} from '@/lib/turbit-utils';
import { 
  serializeDocument, 
  deserializeDocument,
  compareSerializationSizes 
} from '@/lib/protobuf-utils';
import { 
  createImageProcessingKernel,
  createDataProcessingKernel 
} from '@/lib/gpu-utils';

interface Document {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'data';
  size: number;
  processed: boolean;
  processingTime?: number;
  compressionRatio?: number;
}

interface ProcessingStats {
  totalDocuments: number;
  processedDocuments: number;
  totalTime: number;
  averageTime: number;
  compressionRatio: number;
  speedup: number;
}

export default function DocumentProcessor() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<ProcessingStats | null>(null);
  const [newDocument, setNewDocument] = useState({ title: '', content: '' });
  const [processingMode, setProcessingMode] = useState<'parallel' | 'sequential'>('parallel');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addDocument = useCallback(() => {
    if (!newDocument.title || !newDocument.content) return;

    const document: Document = {
      id: Date.now().toString(),
      title: newDocument.title,
      content: newDocument.content,
      type: 'text',
      size: newDocument.content.length,
      processed: false
    };

    setDocuments(prev => [...prev, document]);
    setNewDocument({ title: '', content: '' });
  }, [newDocument]);

  const processDocuments = async () => {
    if (documents.length === 0) return;

    setIsProcessing(true);
    const startTime = Date.now();

    try {
      if (processingMode === 'parallel') {
        // Parallel processing with Turbit
        const { results, stats: processingStats } = await processDocumentsInParallel(
          documents,
          (doc) => {
            const start = Date.now();
            
            // Simulate document processing
            const processedContent = doc.content
              .toLowerCase()
              .replace(/[^\w\s]/g, '')
              .split(/\s+/)
              .filter(word => word.length > 3)
              .join(' ');
            
            const processingTime = Date.now() - start;
            
            return {
              ...doc,
              content: processedContent,
              processed: true,
              processingTime
            };
          }
        );

        setDocuments(results);
        
        // Calculate compression ratio
        const totalOriginalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
        const totalProcessedSize = results.reduce((sum, doc) => sum + doc.content.length, 0);
        const compressionRatio = totalOriginalSize / totalProcessedSize;

        setStats({
          totalDocuments: documents.length,
          processedDocuments: results.length,
          totalTime: Date.now() - startTime,
          averageTime: processingStats.timeTakenSeconds * 1000 / results.length,
          compressionRatio,
          speedup: processingStats.timeTakenSeconds * 1000 / (Date.now() - startTime)
        });

      } else {
        // Sequential processing
        const results = documents.map(doc => {
          const start = Date.now();
          
          const processedContent = doc.content
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3)
            .join(' ');
          
          const processingTime = Date.now() - start;
          
          return {
            ...doc,
            content: processedContent,
            processed: true,
            processingTime
          };
        });

        setDocuments(results);
        
        const totalOriginalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
        const totalProcessedSize = results.reduce((sum, doc) => sum + doc.content.length, 0);
        const compressionRatio = totalOriginalSize / totalProcessedSize;

        setStats({
          totalDocuments: documents.length,
          processedDocuments: results.length,
          totalTime: Date.now() - startTime,
          averageTime: (Date.now() - startTime) / results.length,
          compressionRatio,
          speedup: 1
        });
      }

    } catch (error) {
      console.error('Document processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const exportDocuments = () => {
    const dataStr = JSON.stringify(documents, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'processed-documents.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearDocuments = () => {
    setDocuments([]);
    setStats(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const document: Document = {
          id: Date.now().toString() + Math.random(),
          title: file.name,
          content,
          type: file.type.startsWith('image/') ? 'image' : 'text',
          size: file.size,
          processed: false
        };
        setDocuments(prev => [...prev, document]);
      };
      reader.readAsText(file);
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            High-Performance Document Processor
          </CardTitle>
          <CardDescription>
            Process documents using parallel computing, GPU acceleration, and efficient serialization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={newDocument.title}
                onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter document title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Document Content</Label>
              <Textarea
                id="content"
                value={newDocument.content}
                onChange={(e) => setNewDocument(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter document content"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={addDocument} disabled={!newDocument.title || !newDocument.content}>
              Add Document
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Documents ({documents.length})
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={processDocuments}
                  disabled={isProcessing}
                  className="flex items-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  {isProcessing ? 'Processing...' : 'Process Documents'}
                </Button>
                <Button variant="outline" onClick={exportDocuments}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" onClick={clearDocuments}>
                  Clear
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {doc.processed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-sm text-gray-500">
                        {doc.size} bytes • {doc.type} • 
                        {doc.processed && doc.processingTime && (
                          <span> Processed in {doc.processingTime}ms</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={doc.processed ? 'default' : 'secondary'}>
                      {doc.processed ? 'Processed' : 'Pending'}
                    </Badge>
                    {doc.compressionRatio && (
                      <Badge variant="outline">
                        {doc.compressionRatio.toFixed(2)}x compression
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Processing Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Documents</span>
                  <Badge>{stats.totalDocuments}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Processed</span>
                  <Badge variant="outline">{stats.processedDocuments}</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Time</span>
                  <Badge>{stats.totalTime}ms</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Time</span>
                  <Badge variant="outline">{stats.averageTime.toFixed(2)}ms</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Compression Ratio</span>
                  <Badge>{stats.compressionRatio.toFixed(2)}x</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Speedup</span>
                  <Badge variant="outline">{stats.speedup.toFixed(2)}x</Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing Efficiency</span>
                <span>{((stats.processedDocuments / stats.totalDocuments) * 100).toFixed(1)}%</span>
              </div>
              <Progress 
                value={(stats.processedDocuments / stats.totalDocuments) * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
