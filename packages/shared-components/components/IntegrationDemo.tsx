'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { JSONSchemaForm } from '@/components/forms/JSONSchemaForm';
import { ValidationUtils } from '@/components/validation/ValidationUtils';
import { AsyncUtils } from '@/components/async/AsyncUtils';
import { WebhookUtils } from '@/components/webhooks/WebhookUtils';
import { EnvUtils } from '@/lib/EnvUtils';
import { cn } from '@/lib/utils';

// JSON Schema for user form
const userSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Full Name',
      minLength: 2,
    },
    email: {
      type: 'string',
      title: 'Email Address',
      format: 'email',
    },
    age: {
      type: 'number',
      title: 'Age',
      minimum: 18,
      maximum: 120,
    },
    role: {
      type: 'string',
      title: 'Role',
      enum: ['student', 'faculty', 'admin'],
      default: 'student',
    },
  },
  required: ['name', 'email', 'age'],
};

const uiSchema = {
  age: {
    'ui:widget': 'updown',
  },
  role: {
    'ui:widget': 'select',
  },
};

export const IntegrationDemo: React.FC = () => {
  const [formData, setFormData] = useState<any>({});
  const [validationResults, setValidationResults] = useState<{[key: string]: any}>({});
  const [asyncResults, setAsyncResults] = useState<string[]>([]);
  const [webhookStatus, setWebhookStatus] = useState<string>('Not connected');
  const [envConfig, setEnvConfig] = useState<any>({});

  // Test environment variables
  useEffect(() => {
    try {
      const config = EnvUtils.getConfig();
      setEnvConfig(config);
    } catch (error) {
      console.error('Environment configuration error:', error);
    }
  }, []);

  // Test validation utilities
  const testValidation = () => {
    const email = 'test@example.com';
    const phone = '+1234567890';
    const password = 'MySecurePass123!';

    const results = {
      email: ValidationUtils.email(email),
      phone: ValidationUtils.phone(phone, 'en-US'),
      password: ValidationUtils.password(password),
    };

    setValidationResults(results);
  };

  // Test async utilities
  const testAsync = async () => {
    const results: string[] = [];

    try {
      // Test series execution
      const seriesTasks = [
        (callback: Function) => {
          setTimeout(() => {
            results.push('Task 1 completed');
            callback(null, 'result1');
          }, 1000);
        },
        (callback: Function) => {
          setTimeout(() => {
            results.push('Task 2 completed');
            callback(null, 'result2');
          }, 500);
        },
      ];

      await AsyncUtils.series(seriesTasks);
      results.push('Series execution completed');

      // Test parallel execution
      const parallelTasks = [
        (callback: Function) => {
          setTimeout(() => {
            results.push('Parallel task 1 completed');
            callback(null, 'parallel1');
          }, 800);
        },
        (callback: Function) => {
          setTimeout(() => {
            results.push('Parallel task 2 completed');
            callback(null, 'parallel2');
          }, 600);
        },
      ];

      await AsyncUtils.parallel(parallelTasks);
      results.push('Parallel execution completed');

    } catch (error) {
      results.push(`Error: ${error}`);
    }

    setAsyncResults(results);
  };

  // Test webhook utilities
  const testWebhook = () => {
    try {
      const webhookUtils = new WebhookUtils({
        secret: 'test-webhook-secret',
      });

      // Simulate webhook payload
      const payload = {
        id: 'test-event-123',
        type: 'user.created',
        data: { userId: 123, email: 'test@example.com' },
        created_at: new Date().toISOString(),
      };

      const { signature, timestamp } = webhookUtils.signWebhook(JSON.stringify(payload));

      setWebhookStatus(`Webhook signed successfully. Signature: ${signature.substring(0, 20)}...`);
    } catch (error) {
      setWebhookStatus(`Webhook error: ${error}`);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Utility Integration Demo</h1>
        <p className="text-gray-600">
          Demonstrating seamless integration of async, validation, webhook, and environment utilities
        </p>
      </div>

      {/* Environment Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Configuration</CardTitle>
          <CardDescription>Current environment variable configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">NODE_ENV:</span>
              <Badge variant={envConfig.NODE_ENV === 'development' ? 'default' : 'secondary'}>
                {envConfig.NODE_ENV || 'Not set'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">API_URL:</span>
              <span className="text-sm text-gray-600">{envConfig.API_URL || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">SUPABASE_URL:</span>
              <span className="text-sm text-gray-600">{envConfig.SUPABASE_URL || 'Not set'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* JSON Schema Form */}
      <Card>
        <CardHeader>
          <CardTitle>JSON Schema Form</CardTitle>
          <CardDescription>Dynamic form generation using react-jsonschema-form</CardDescription>
        </CardHeader>
        <CardContent>
          <JSONSchemaForm
            schema={userSchema}
            uiSchema={uiSchema}
            formData={formData}
            onChange={({ formData }) => setFormData(formData)}
            onSubmit={({ formData }) => console.log('Form submitted:', formData)}
            className="max-w-2xl"
          />
          <div className="mt-4">
            <h4 className="font-medium mb-2">Form Data:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Validation Utilities */}
      <Card>
        <CardHeader>
          <CardTitle>Validation Utilities</CardTitle>
          <CardDescription>Test various validation functions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={testValidation} className="mb-4">
            Run Validation Tests
          </Button>
          {Object.keys(validationResults).length > 0 && (
            <div className="space-y-2">
              {Object.entries(validationResults).map(([key, result]: [string, any]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="font-medium capitalize">{key}:</span>
                  <Badge variant={result.isValid ? 'default' : 'destructive'}>
                    {result.isValid ? 'Valid' : 'Invalid'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Async Utilities */}
      <Card>
        <CardHeader>
          <CardTitle>Async Utilities</CardTitle>
          <CardDescription>Test async task execution patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={testAsync} className="mb-4">
            Run Async Tests
          </Button>
          {asyncResults.length > 0 && (
            <div className="space-y-1">
              {asyncResults.map((result, index) => (
                <div key={index} className="text-sm text-gray-600">
                  {result}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Webhook Utilities */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Utilities</CardTitle>
          <CardDescription>Test webhook signature generation and verification</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={testWebhook} className="mb-4">
            Test Webhook Signing
          </Button>
          <div className="text-sm text-gray-600">
            Status: {webhookStatus}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationDemo;