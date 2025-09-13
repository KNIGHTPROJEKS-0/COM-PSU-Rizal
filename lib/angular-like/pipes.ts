import { transform, TransformFnParams } from 'class-transformer';

// Angular-like pipe system
export abstract class Pipe {
  abstract transform(value: any, ...args: any[]): any;
}

// Built-in pipes
export class DatePipe extends Pipe {
  transform(value: Date | string | number, format: string = 'medium'): string {
    const date = new Date(value);
    
    switch (format) {
      case 'short':
        return date.toLocaleDateString();
      case 'medium':
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      case 'long':
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        });
      case 'full':
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      default:
        return date.toISOString();
    }
  }
}

export class CurrencyPipe extends Pipe {
  transform(
    value: number, 
    currencyCode: string = 'USD', 
    display: 'symbol' | 'code' | 'name' = 'symbol',
    digitsInfo: string = '1.2-2'
  ): string {
    const [minIntegerDigits, minFractionDigits, maxFractionDigits] = 
      digitsInfo.split('.').map(Number);
    
    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currencyCode,
      minimumIntegerDigits: minIntegerDigits,
      minimumFractionDigits: minFractionDigits,
      maximumFractionDigits: maxFractionDigits
    };

    return new Intl.NumberFormat('en-US', options).format(value);
  }
}

export class PercentPipe extends Pipe {
  transform(value: number, digitsInfo: string = '1.2-2'): string {
    const [minIntegerDigits, minFractionDigits, maxFractionDigits] = 
      digitsInfo.split('.').map(Number);
    
    const options: Intl.NumberFormatOptions = {
      style: 'percent',
      minimumIntegerDigits: minIntegerDigits,
      minimumFractionDigits: minFractionDigits,
      maximumFractionDigits: maxFractionDigits
    };

    return new Intl.NumberFormat('en-US', options).format(value / 100);
  }
}

export class DecimalPipe extends Pipe {
  transform(value: number, digitsInfo: string = '1.2-2'): string {
    const [minIntegerDigits, minFractionDigits, maxFractionDigits] = 
      digitsInfo.split('.').map(Number);
    
    const options: Intl.NumberFormatOptions = {
      minimumIntegerDigits: minIntegerDigits,
      minimumFractionDigits: minFractionDigits,
      maximumFractionDigits: maxFractionDigits
    };

    return new Intl.NumberFormat('en-US', options).format(value);
  }
}

export class JsonPipe extends Pipe {
  transform(value: any, spaces: number = 2): string {
    return JSON.stringify(value, null, spaces);
  }
}

export class SlicePipe extends Pipe {
  transform(value: string | any[], start: number, end?: number): string | any[] {
    if (typeof value === 'string') {
      return value.slice(start, end);
    }
    if (Array.isArray(value)) {
      return value.slice(start, end);
    }
    return value;
  }
}

export class AsyncPipe extends Pipe {
  transform<T>(value: Promise<T> | null | undefined): T | null {
    // This would typically be handled by React hooks in practice
    // but we provide the interface for consistency
    return value as T | null;
  }
}

export class KeyValuePipe extends Pipe {
  transform<K, V>(
    value: Record<string, V> | Map<K, V> | Array<[K, V]>,
    compareFn?: (a: [K, V], b: [K, V]) => number
  ): Array<[K, V]> {
    let entries: Array<[K, V]>;
    
    if (value instanceof Map) {
      entries = Array.from(value.entries());
    } else if (Array.isArray(value)) {
      entries = value;
    } else {
      entries = Object.entries(value) as Array<[K, V]>;
    }
    
    if (compareFn) {
      entries.sort(compareFn);
    }
    
    return entries;
  }
}

export class TitleCasePipe extends Pipe {
  transform(value: string): string {
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

export class UpperCasePipe extends Pipe {
  transform(value: string): string {
    return value.toUpperCase();
  }
}

export class LowerCasePipe extends Pipe {
  transform(value: string): string {
    return value.toLowerCase();
  }
}

// Pipe registry
export class PipeRegistry {
  private static pipes = new Map<string, Pipe>();

  static register(name: string, pipe: Pipe): void {
    this.pipes.set(name, pipe);
  }

  static get(name: string): Pipe | undefined {
    return this.pipes.get(name);
  }

  static transform(value: any, pipeName: string, ...args: any[]): any {
    const pipe = this.get(pipeName);
    if (!pipe) {
      throw new Error(`Pipe ${pipeName} not found`);
    }
    return pipe.transform(value, ...args);
  }
}

// Register built-in pipes
PipeRegistry.register('date', new DatePipe());
PipeRegistry.register('currency', new CurrencyPipe());
PipeRegistry.register('percent', new PercentPipe());
PipeRegistry.register('decimal', new DecimalPipe());
PipeRegistry.register('json', new JsonPipe());
PipeRegistry.register('slice', new SlicePipe());
PipeRegistry.register('async', new AsyncPipe());
PipeRegistry.register('keyvalue', new KeyValuePipe());
PipeRegistry.register('titlecase', new TitleCasePipe());
PipeRegistry.register('uppercase', new UpperCasePipe());
PipeRegistry.register('lowercase', new LowerCasePipe());

// React hook for using pipes
export function usePipe() {
  return {
    transform: PipeRegistry.transform.bind(PipeRegistry),
    register: PipeRegistry.register.bind(PipeRegistry),
    get: PipeRegistry.get.bind(PipeRegistry)
  };
}

// Custom pipe decorator
export function PipeDecorator(name: string) {
  return function <T extends { new (...args: any[]): Pipe }>(constructor: T) {
    PipeRegistry.register(name, new constructor());
    return constructor;
  };
}

// Utility function for pipe chaining
export function pipe(value: any, ...transforms: Array<[string, ...any[]]>): any {
  return transforms.reduce((acc, [pipeName, ...args]) => {
    return PipeRegistry.transform(acc, pipeName, ...args);
  }, value);
}

// Example usage:
// const result = pipe(
//   new Date(),
//   ['date', 'medium'],
//   ['uppercase']
// );
