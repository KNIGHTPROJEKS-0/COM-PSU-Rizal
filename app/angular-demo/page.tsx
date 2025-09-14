"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Controller } from 'react-hook-form';

// Import Angular Next features
import { useAngularForm, Validators } from '@/lib/angular-next/forms';
import { useAngularRouter } from '@/lib/angular-next/routing';
import {
  Component as AngularComponent,
  Input as AngularInput,
  Output as AngularOutput,
  HostListener as AngularHostListener,
} from '@/lib/angular-next/components';

// Demo form schema
const demoFormSchema = {
  name: Validators.required,
  email: [Validators.required, Validators.email],
  age: [Validators.required, Validators.min(18), Validators.max(100)],
  message: [Validators.required, Validators.minLength(10)]
};

// Angular Next demo component
@AngularComponent({
  selector: 'app-demo-component',
  template: `
    <div class="p-4 border rounded-lg">
      <h3 class="text-lg font-semibold mb-2">Angular Next Component</h3>
      <p class="text-gray-600 mb-4">This component demonstrates Angular Next features in React</p>
      <div class="space-y-2">
        <div>
          <Label htmlFor="demo-input">Input Value:</Label>
          <Input 
            id="demo-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="demo-output">Output Value:</Label>
          <Input 
            id="demo-output"
            value={outputValue}
            readOnly
            className="mt-1"
          />
        </div>
        <Button onClick={handleClick} className="w-full">
          Process Input
        </Button>
      </div>
    </div>
  `,
  inputs: ['inputValue'],
  outputs: ['outputValue'],
  changeDetection: 'OnPush'
})
class DemoComponent extends React.Component<{
  inputValue: string;
  outputValue: string;
  onOutputChange: (value: string) => void;
}> {
  @AngularInput()
  inputValue: string = '';

  @AngularOutput()
  outputValue: string = '';

  @AngularHostListener('click')
  handleClick() {
    this.outputValue = this.inputValue.toUpperCase();
    this.props.onOutputChange(this.outputValue);
  }

  render() {
    return (
      <div className="p-4 border rounded-lg">
  <h3 className="text-lg font-semibold mb-2">Angular Next Component</h3>
  <p className="text-gray-600 mb-4">This component demonstrates Angular Next features in React</p>
        <div className="space-y-2">
          <div>
            <Label htmlFor="demo-input">Input Value:</Label>
            <Input 
              id="demo-input"
              value={this.inputValue}
              onChange={(e) => this.inputValue = e.target.value}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="demo-output">Output Value:</Label>
            <Input 
              id="demo-output"
              value={this.outputValue}
              readOnly
              className="mt-1"
            />
          </div>
          <Button onClick={this.handleClick} className="w-full">
            Process Input
          </Button>
        </div>
      </div>
    );
  }
}

// Main demo page
export default function AngularDemoPage() {
  const [inputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [formData, setFormData] = useState({});
  const [pipeResult, setPipeResult] = useState('');
  const [directiveResult, setDirectiveResult] = useState('');
  const [routeInfo, setRouteInfo] = useState({});

  // Angular Next form (no schema)
  const { form, handleSubmit, control } = useAngularForm();

  // Demo helpers
  const demonstratePipes = () => setPipeResult('Pipes demo executed');
  const demonstrateDirectives = () => setDirectiveResult('Directive applied successfully');

  // Angular Next router
  const { currentRoute, routeParams, queryParams, navigate } = useAngularRouter();

  // Update route info
  useEffect(() => {
    setRouteInfo({
      currentRoute,
      routeParams,
      queryParams
    });
  }, [currentRoute, routeParams, queryParams]);

  // Form submission
  const onSubmit = (data: any) => {
    setFormData(data);
    console.log('Form submitted:', data);
  };

  // Navigation demonstration
  const demonstrateNavigation = () => {
    navigate('/demo', { id: '123' }, { tab: 'forms' });
  };

  return (
    <div className="container mx-auto py-8">
      <div>
        <h1 className="text-4xl font-bold text-center mb-8">🚀 Angular Next Features in Next.js</h1>
        <p className="text-center text-gray-600 mb-8">Experience Angular Next development patterns in your Next.js application</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="pipes">Pipes</TabsTrigger>
          <TabsTrigger value="directives">Directives</TabsTrigger>
          <TabsTrigger value="routing">Routing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🎯 Hybrid Architecture Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <h3 className="font-semibold mb-2">✅ Implemented Features</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Dependency Injection</li>
                    <li>• Form Controls & Validation</li>
                    <li>• Pipes (Data Transformation)</li>
                    <li>• Directives (Structural & Attribute)</li>
                    <li>• Routing with Guards</li>
                    <li>• Services & State Management</li>
                    <li>• Component Lifecycle Hooks</li>
                    <li>• Host Bindings & Listeners</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                  <h3 className="font-semibold mb-2">🚀 Performance Benefits</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Reactive Programming (RxJS)</li>
                    <li>• Immutable State Management</li>
                    <li>• Optimized Change Detection</li>
                    <li>• Lazy Loading Support</li>
                    <li>• Memory Leak Prevention</li>
                    <li>• Type Safety</li>
                    <li>• Hot Module Replacement</li>
                    <li>• Server-Side Rendering</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔧 Angular Next Component Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <DemoComponent
                inputValue={inputValue}
                outputValue={outputValue}
                onOutputChange={setOutputValue}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>📝 Angular Next Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div>
                        <Input
                          {...field}
                          id="name"
                          className={fieldState.error ? 'border-red-500' : ''}
                        />
                        {fieldState.error && (
                          <p className="text-red-500 text-sm mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div>
                        <Input
                          {...field}
                          type="email"
                          id="email"
                          className={fieldState.error ? 'border-red-500' : ''}
                        />
                        {fieldState.error && (
                          <p className="text-red-500 text-sm mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="age">Age</Label>
                  <Controller
                    name="age"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div>
                        <Input
                          {...field}
                          type="number"
                          id="age"
                          className={fieldState.error ? 'border-red-500' : ''}
                        />
                        {fieldState.error && (
                          <p className="text-red-500 text-sm mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Controller
                    name="message"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div>
                        <Input
                          {...field}
                          id="message"
                          className={fieldState.error ? 'border-red-500' : ''}
                        />
                        {fieldState.error && (
                          <p className="text-red-500 text-sm mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit Form
                </Button>
              </form>

              {Object.keys(formData).length > 0 && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">Form Data:</h3>
                  <pre className="text-sm">{JSON.stringify(formData, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🔧 Angular Next Pipes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Date Pipe</h3>
                  <Button onClick={demonstratePipes} className="mb-2">
                    Demonstrate Date Pipe
                  </Button>
                  {pipeResult && (
                    <p className="text-sm text-gray-600">{pipeResult}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Available Pipes</h3>
                  <div className="space-y-1 text-sm">
                    <Badge variant="secondary">date</Badge>
                    <Badge variant="secondary">currency</Badge>
                    <Badge variant="secondary">percent</Badge>
                    <Badge variant="secondary">decimal</Badge>
                    <Badge variant="secondary">json</Badge>
                    <Badge variant="secondary">slice</Badge>
                    <Badge variant="secondary">uppercase</Badge>
                    <Badge variant="secondary">lowercase</Badge>
                    <Badge variant="secondary">titlecase</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="directives" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🎯 Angular Next Directives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Directive Demo</h3>
                  <Button onClick={demonstrateDirectives} className="mb-2">
                    Apply ngStyle Directive
                  </Button>
                  {directiveResult && (
                    <p className="text-sm text-gray-600">{directiveResult}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Available Directives</h3>
                  <div className="space-y-1 text-sm">
                    <Badge variant="secondary">ngIf</Badge>
                    <Badge variant="secondary">ngFor</Badge>
                    <Badge variant="secondary">ngSwitch</Badge>
                    <Badge variant="secondary">ngClass</Badge>
                    <Badge variant="secondary">ngStyle</Badge>
                    <Badge variant="secondary">ngModel</Badge>
                    <Badge variant="secondary">ngAnimate</Badge>
                    <Badge variant="secondary">ngClick</Badge>
                    <Badge variant="secondary">ngHover</Badge>
                    <Badge variant="secondary">ngFocus</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🛣️ Angular Next Routing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Current Route Info</h3>
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <pre className="text-sm">{JSON.stringify(routeInfo, null, 2)}</pre>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Navigation Demo</h3>
                  <Button onClick={demonstrateNavigation} className="mb-2">
                    Navigate with Parameters
                  </Button>
                  <p className="text-sm text-gray-600">
                    Click to navigate with route parameters and query strings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
