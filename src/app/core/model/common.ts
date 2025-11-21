export interface ITableConfig {
  label: string;
  field: string;

  type?:
    | 'index'
    | 'text'
    | 'number'
    | 'date'
    | 'datetime'
    | 'image'
    | 'boolean'
    | 'badge'
    | 'currency'
    | 'percent'
    | 'custom'
    | 'action';

  visible?: boolean;

  width?: string;
  minWidth?: string;
  maxWidth?: string;

  tooltip?: boolean;
  tooltipField?: string;

  truncate?: number;
  lineClamp?: 1 | 2 | 3 | 4 | 5;

  actionButtons?: Array<{
    label?: string;
    action?: () => void;
    icon?: string;
    tooltipLabel?: string;
    children?: Array<{
      label: string;
      action: () => void;
      icon?: string;
      tooltipLabel?: string;
    }>;
  }>;

  badgeColor?: string;
  badgeMap?: { [key: string]: string };
}
