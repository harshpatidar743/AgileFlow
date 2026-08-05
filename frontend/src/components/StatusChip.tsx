import React from 'react';
import { Chip } from '@mui/material';
import { Status } from '../types';
import { Hourglass, RefreshCw, CheckCircle2 } from 'lucide-react';

interface StatusChipProps {
  status: Status;
  size?: 'small' | 'medium';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'small' }) => {
  const getProps = () => {
    switch (status) {
      case 'TODO':
        return {
          label: 'To Do',
          icon: <Hourglass size={14} />,
          style: { backgroundColor: '#e2e8f0', color: '#334155', fontWeight: 600 },
        };
      case 'IN_PROGRESS':
        return {
          label: 'In Progress',
          icon: <RefreshCw size={14} />,
          style: { backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: 600 },
        };
      case 'COMPLETED':
        return {
          label: 'Completed',
          icon: <CheckCircle2 size={14} />,
          style: { backgroundColor: '#dcfce7', color: '#15803d', fontWeight: 600 },
        };
      default:
        return { label: status, style: {} };
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
