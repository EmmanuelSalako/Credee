import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

type P = { size?: number; color?: string; strokeWidth?: number };

const base = (size: number, color: string, sw: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: color,
  strokeWidth: sw,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const BackIcon = ({ size = 24, color = colors.ink, strokeWidth = 2 }: P) => (
  <Svg {...base(size, color, strokeWidth)}><Path d="M15 18l-6-6 6-6" /></Svg>
);
export const CheckIcon = ({ size = 22, color = colors.primary, strokeWidth = 2.4 }: P) => (
  <Svg {...base(size, color, strokeWidth)}><Path d="M4 12l5 5L20 6" /></Svg>
);
export const ClockIcon = ({ size = 24, color = colors.primary, strokeWidth = 2 }: P) => (
  <Svg {...base(size, color, strokeWidth)}><Circle cx={12} cy={12} r={9} /><Path d="M12 7v5l3 2" /></Svg>
);
export const LockIcon = ({ size = 24, color = colors.primary, strokeWidth = 2 }: P) => (
  <Svg {...base(size, color, strokeWidth)}><Rect x={5} y={11} width={14} height={10} rx={2} /><Path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>
);
export const ShieldIcon = ({ size = 22, color = colors.primary, strokeWidth = 2 }: P) => (
  <Svg {...base(size, color, strokeWidth)}><Path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z" /></Svg>
);
export const FileIcon = ({ size = 20, color = colors.primary, strokeWidth = 2 }: P) => (
  <Svg {...base(size, color, strokeWidth)}><Path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><Path d="M14 3v5h5" /></Svg>
);
export const PlusIcon = ({ size = 20, color = colors.ink, strokeWidth = 2 }: P) => (
  <Svg {...base(size, color, strokeWidth)}><Path d="M12 5v14M5 12h14" /></Svg>
);
export const CloseIcon = ({ size = 18, color = colors.muted, strokeWidth = 2 }: P) => (
  <Svg {...base(size, color, strokeWidth)}><Path d="M6 6l12 12M18 6L6 18" /></Svg>
);
export const UpIcon = ({ size = 20, color = colors.primary, strokeWidth = 2.4 }: P) => (
  <Svg {...base(size, color, strokeWidth)}><Path d="M12 19V5M5 12l7-7 7 7" /></Svg>
);
export const DownIcon = ({ size = 20, color = colors.down, strokeWidth = 2.4 }: P) => (
  <Svg {...base(size, color, strokeWidth)}><Path d="M12 5v14M5 12l7 7 7-7" /></Svg>
);
