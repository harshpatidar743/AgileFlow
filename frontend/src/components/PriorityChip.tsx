import React from 'react';
import { Chip } from '@mui/material';
import { Priority } from '../types';
import { ArrowDown, ArrowRight, ArrowUp, AlertTriangle } from 'lucide-react';

interface PriorityChipProps {
  priority: Priority;
  size?: 'small' | 'medium';
}

export const PriorityChip: React.FC<PriorityChipProps> = ({ priority, size = 'small' }) => {
  const getProps = () => {
    switch (priority) {
      case 'LOW':
        return {
          label: 'Low',
          icon: <ArrowDown size={14} />,
          style: { backgroundColor: '#f1f5f9', color: '#64748b', fontWeight: 600 },
        };
      case 'MEDIUM':
        return {
          label: 'Medium',
          icon: <ArrowRight size={14} />,
          style: { backgroundColor: '#fef3c7', color: '#b45309', fontWeight: 600 },
        };
      case 'HIGH':
        return {
          label: 'High',
          icon: <ArrowUp size={14} />,
          style: { backgroundColor: '#ffedd5', color: '#c2410c', fontWeight: 600 },
        };
      case 'URGENT':
        return {
          label: 'Urgent',
          icon: <AlertTriangle size={14} />,
          style: { backgroundColor: '#fee2e2', color: '#b91c1c', fontWeight: 700 },
        };
      default:
        return { label: priority, style: {} };
    }
  };

  const props = getProps();

  return (
    <Chip
      size={size}
      icon={props.icon}
      label={props.label}
      style={props.style}
    />
  );
};
