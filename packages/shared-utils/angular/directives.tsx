import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Angular-like directive system
export abstract class Directive {
  abstract render(element: React.ReactElement, props: any): React.ReactElement;
}

// Structural directives
export class NgIfDirective extends Directive {
  render(element: React.ReactElement, props: { condition: boolean; else?: React.ReactElement }): React.ReactElement {
    return props.condition ? element : (props.else || <></>);
  }
}

export class NgForDirective extends Directive {
  render(
    element: React.ReactElement, 
    props: { 
      items: any[]; 
      trackBy?: (index: number, item: any) => string | number;
      template: (item: any, index: number) => React.ReactElement;
    }
  ): React.ReactElement {
    return (
      <>
        {props.items.map((item, index) => (
          <React.Fragment key={props.trackBy ? props.trackBy(index, item) : index}>
            {props.template(item, index)}
          </React.Fragment>
        ))}
      </>
    );
  }
}

export class NgSwitchDirective extends Directive {
  render(
    element: React.ReactElement,
    props: {
      value: any;
      cases: Array<{ value: any; template: React.ReactElement }>;
      default?: React.ReactElement;
    }
  ): React.ReactElement {
    const matchedCase = props.cases.find(c => c.value === props.value);
    return matchedCase ? matchedCase.template : (props.default || <></>);
  }
}

// Attribute directives
export class NgClassDirective extends Directive {
  render(element: React.ReactElement, props: { classes: string | Record<string, boolean> | string[] }): React.ReactElement {
    const className = typeof props.classes === 'string' 
      ? props.classes 
      : Array.isArray(props.classes)
        ? props.classes.join(' ')
        : Object.entries(props.classes)
            .filter(([_, condition]) => condition)
            .map(([className]) => className)
            .join(' ');

    return React.cloneElement(element, {
      ...element.props,
      className: `${element.props.className || ''} ${className}`.trim()
    });
  }
}

export class NgStyleDirective extends Directive {
  render(element: React.ReactElement, props: { styles: React.CSSProperties }): React.ReactElement {
    return React.cloneElement(element, {
      ...element.props,
      style: { ...element.props.style, ...props.styles }
    });
  }
}

export class NgModelDirective extends Directive {
  render(element: React.ReactElement, props: { 
    model: any; 
    onChange: (value: any) => void;
    onBlur?: () => void;
  }): React.ReactElement {
    return React.cloneElement(element, {
      ...element.props,
      value: props.model,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => props.onChange(e.target.value),
      onBlur: props.onBlur
    });
  }
}

// Animation directives
export class NgAnimateDirective extends Directive {
  render(element: React.ReactElement, props: {
    animation: string;
    duration?: number;
    delay?: number;
    easing?: string;
  }): React.ReactElement {
    const variants = {
      enter: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: props.duration || 0.3,
          delay: props.delay || 0,
          ease: props.easing || 'easeOut'
        }
      },
      exit: {
        opacity: 0,
        scale: 0.8,
        y: -20,
        transition: {
          duration: props.duration || 0.2,
          ease: props.easing || 'easeIn'
        }
      }
    };

    return (
      <motion.div
        variants={variants}
        initial="exit"
        animate="enter"
        exit="exit"
      >
        {element}
      </motion.div>
    );
  }
}

// Custom directives
export class NgClickDirective extends Directive {
  render(element: React.ReactElement, props: { 
    onClick: (event: React.MouseEvent) => void;
    preventDefault?: boolean;
    stopPropagation?: boolean;
  }): React.ReactElement {
    const handleClick = (event: React.MouseEvent) => {
      if (props.preventDefault) event.preventDefault();
      if (props.stopPropagation) event.stopPropagation();
      props.onClick(event);
    };

    return React.cloneElement(element, {
      ...element.props,
      onClick: handleClick
    });
  }
}

export class NgHoverDirective extends Directive {
  render(element: React.ReactElement, props: {
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
  }): React.ReactElement {
    return React.cloneElement(element, {
      ...element.props,
      onMouseEnter: props.onMouseEnter,
      onMouseLeave: props.onMouseLeave
    });
  }
}

export class NgFocusDirective extends Directive {
  render(element: React.ReactElement, props: {
    onFocus?: (event: React.FocusEvent) => void;
    onBlur?: (event: React.FocusEvent) => void;
  }): React.ReactElement {
    return React.cloneElement(element, {
      ...element.props,
      onFocus: props.onFocus,
      onBlur: props.onBlur
    });
  }
}

// Directive registry
export class DirectiveRegistry {
  private static directives = new Map<string, Directive>();

  static register(name: string, directive: Directive): void {
    this.directives.set(name, directive);
  }

  static get(name: string): Directive | undefined {
    return this.directives.get(name);
  }

  static apply(element: React.ReactElement, directiveName: string, props: any): React.ReactElement {
    const directive = this.get(directiveName);
    if (!directive) {
      throw new Error(`Directive ${directiveName} not found`);
    }
    return directive.render(element, props);
  }
}

// Register built-in directives
DirectiveRegistry.register('ngIf', new NgIfDirective());
DirectiveRegistry.register('ngFor', new NgForDirective());
DirectiveRegistry.register('ngSwitch', new NgSwitchDirective());
DirectiveRegistry.register('ngClass', new NgClassDirective());
DirectiveRegistry.register('ngStyle', new NgStyleDirective());
DirectiveRegistry.register('ngModel', new NgModelDirective());
DirectiveRegistry.register('ngAnimate', new NgAnimateDirective());
DirectiveRegistry.register('ngClick', new NgClickDirective());
DirectiveRegistry.register('ngHover', new NgHoverDirective());
DirectiveRegistry.register('ngFocus', new NgFocusDirective());

// React hooks for using directives
export function useDirective() {
  return {
    apply: DirectiveRegistry.apply.bind(DirectiveRegistry),
    register: DirectiveRegistry.register.bind(DirectiveRegistry),
    get: DirectiveRegistry.get.bind(DirectiveRegistry)
  };
}

// Custom directive decorator
export function DirectiveDecorator(name: string) {
  return function <T extends { new (...args: any[]): Directive }>(constructor: T) {
    DirectiveRegistry.register(name, new constructor());
    return constructor;
  };
}

// Higher-order component for applying directives
export function withDirectives<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  directives: Array<{ name: string; props: any }>
) {
  return function DirectivedComponent(props: T) {
    let element = <Component {...props} />;
    
    directives.forEach(({ name, props: directiveProps }) => {
      element = DirectiveRegistry.apply(element, name, directiveProps);
    });
    
    return element;
  };
}

// Utility function for directive chaining
export function applyDirectives(element: React.ReactElement, ...directives: Array<[string, any]>): React.ReactElement {
  return directives.reduce((acc, [directiveName, props]) => {
    return DirectiveRegistry.apply(acc, directiveName, props);
  }, element);
}

// Example usage:
// const element = applyDirectives(
//   <div>Hello World</div>,
//   ['ngClass', { 'active': true, 'disabled': false }],
//   ['ngStyle', { color: 'red', fontSize: '16px' }],
//   ['ngAnimate', { animation: 'fadeIn', duration: 0.5 }]
// );
