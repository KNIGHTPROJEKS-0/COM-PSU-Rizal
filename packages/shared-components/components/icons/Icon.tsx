'use client';

import React from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as SimpleIcons from 'simple-icons';

interface IconProps {
  name: string;
  size?: 'xs' | 'sm' | 'lg' | '2x' | '3x' | '5x' | '7x' | '10x';
  className?: string;
  style?: React.CSSProperties;
}

export const FAIcon: React.FC<IconProps & { icon: IconDefinition }> = ({
  icon,
  size = 'sm',
  className = '',
  style
}) => {
  return (
    <FontAwesomeIcon
      icon={icon}
      size={size}
      className={`fa-icon ${className}`}
      style={style}
    />
  );
};

export const SimpleIcon: React.FC<IconProps> = ({
  name,
  size = 'sm',
  className = '',
  style
}) => {
  const iconKey = `si${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  const icon = (SimpleIcons as any)[iconKey];

  if (!icon) {
    console.warn(`Simple icon "${name}" not found`);
    return null;
  }

  const sizeMap = {
    xs: 16,
    sm: 24,
    lg: 32,
    '2x': 48,
    '3x': 64,
    '5x': 96,
    '7x': 128,
    '10x': 192
  };

  const iconSize = sizeMap[size] || 24;

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      className={`simple-icon ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: icon.svg }}
    />
  );
};

export const Icon: React.FC<IconProps & { type?: 'fa' | 'simple', faIcon?: IconDefinition }> = ({
  type = 'simple',
  faIcon,
  ...props
}) => {
  if (type === 'fa' && faIcon) {
    return <FAIcon icon={faIcon} {...props} />;
  }

  return <SimpleIcon {...props} />;
};

export default Icon;