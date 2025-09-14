'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BulmaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'normal' | 'medium' | 'large';
  variant?: 'normal' | 'outlined' | 'inverted';
  loading?: boolean;
  disabled?: boolean;
}

export const BulmaButton: React.FC<BulmaButtonProps> = ({
  children,
  color = 'primary',
  size = 'normal',
  variant = 'normal',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const buttonClasses = cn(
    'button',
    {
      [`is-${color}`]: color !== 'primary',
      [`is-${size}`]: size !== 'normal',
      [`is-${variant}`]: variant !== 'normal',
      'is-loading': loading,
    },
    className
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </button>
  );
};

interface BulmaCardProps {
  title?: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const BulmaCard: React.FC<BulmaCardProps> = ({
  title,
  content,
  footer,
  className = ''
}) => {
  return (
    <div className={cn('card', className)}>
      {title && (
        <header className="card-header">
          <p className="card-header-title">{title}</p>
        </header>
      )}
      {content && (
        <div className="card-content">
          {content}
        </div>
      )}
      {footer && (
        <footer className="card-footer">
          {footer}
        </footer>
      )}
    </div>
  );
};

interface BulmaModalProps {
  isActive: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const BulmaModal: React.FC<BulmaModalProps> = ({
  isActive,
  onClose,
  title,
  children,
  footer
}) => {
  return (
    <div className={cn('modal', { 'is-active': isActive })}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        {title && (
          <header className="modal-card-head">
            <p className="modal-card-title">{title}</p>
            <button
              className="delete"
              aria-label="close"
              onClick={onClose}
            ></button>
          </header>
        )}
        <section className="modal-card-body">
          {children}
        </section>
        {footer && (
          <footer className="modal-card-foot">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
};

export default {
  Button: BulmaButton,
  Card: BulmaCard,
  Modal: BulmaModal
};