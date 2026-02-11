import React from 'react';
import { Box, Card, CardContent, Typography, Skeleton, SxProps, Theme } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'flat';
    label?: string;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  loading?: boolean;
  sx?: SxProps<Theme>;
  onClick?: () => void;
}

const colorMap = {
  primary: {
    bg: 'rgba(0, 102, 204, 0.15)',
    color: '#0066CC',
    cardBg: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)',
    border: '1px solid rgba(0, 102, 204, 0.2)'
  },
  secondary: {
    bg: 'rgba(0, 173, 239, 0.15)',
    color: '#00ADEF',
    cardBg: 'linear-gradient(135deg, #ffffff 0%, #f0fcff 100%)',
    border: '1px solid rgba(0, 173, 239, 0.2)'
  },
  success: {
    bg: 'rgba(40, 167, 69, 0.15)',
    color: '#28A745',
    cardBg: 'linear-gradient(135deg, #ffffff 0%, #f0fff4 100%)',
    border: '1px solid rgba(40, 167, 69, 0.2)'
  },
  warning: {
    bg: 'rgba(255, 193, 7, 0.15)',
    color: '#D49A00',
    cardBg: 'linear-gradient(135deg, #ffffff 0%, #fffdf0 100%)',
    border: '1px solid rgba(255, 193, 7, 0.2)'
  },
  error: {
    bg: 'rgba(220, 53, 69, 0.15)',
    color: '#DC3545',
    cardBg: 'linear-gradient(135deg, #ffffff 0%, #fff0f1 100%)',
    border: '1px solid rgba(220, 53, 69, 0.2)'
  },
  info: {
    bg: 'rgba(23, 162, 184, 0.15)',
    color: '#17A2B8',
    cardBg: 'linear-gradient(135deg, #ffffff 0%, #f0faff 100%)',
    border: '1px solid rgba(23, 162, 184, 0.2)'
  },
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
  loading = false,
  sx,
  onClick,
}) => {
  const colors = colorMap[color];

  const getTrendIcon = () => {
    switch (trend?.direction) {
      case 'up':
        return <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />;
      case 'down':
        return <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />;
      default:
        return <TrendingFlat sx={{ fontSize: 16, color: 'text.secondary' }} />;
    }
  };

  const getTrendColor = () => {
    switch (trend?.direction) {
      case 'up':
        return 'success.main';
      case 'down':
        return 'error.main';
      default:
        return 'text.secondary';
    }
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%', ...sx }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Skeleton width={100} height={20} />
              <Skeleton width={80} height={40} sx={{ mt: 1 }} />
              <Skeleton width={120} height={16} sx={{ mt: 1 }} />
            </Box>
            <Skeleton variant="circular" width={48} height={48} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        background: colors.cardBg,
        border: colors.border,
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.08)',
        } : {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
        },
        ...sx,
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', opacity: 0.8 }}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              sx={{ mt: 1, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}
            >
              {value}
            </Typography>

            {(subtitle || trend) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                {trend && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {getTrendIcon()}
                    <Typography
                      variant="caption"
                      sx={{ color: getTrendColor(), fontWeight: 600 }}
                    >
                      {trend.value > 0 ? '+' : ''}{trend.value}%
                    </Typography>
                  </Box>
                )}
                {subtitle && (
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {trend?.label || subtitle}
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          {icon && (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.bg,
                color: colors.color,
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
