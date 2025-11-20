export interface ITableConfig {
  id: string;
  label: string;
  field?: string;

  type?:
    | 'text'
    | 'number'
    | 'date'
    | 'datetime'
    | 'image'
    | 'boolean'
    | 'badge'
    | 'currency'
    | 'percent'
    | 'custom';

  visible?: boolean;

  sortable?: boolean;
  sortField?: string;

  filterable?: boolean;
  filterType?: 'text' | 'number' | 'date' | 'select';
  filterOptions?: any[];

  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';

  frozen?: boolean;
  frozenAlign?: 'left' | 'right';

  cssClass?: string;
  headerClass?: string;
  style?: { [key: string]: string };

  tooltip?: boolean;
  tooltipField?: string;

  pipe?: string;
  pipeFormat?: string;
  pipeLocale?: string;

  responsive?: boolean;
  hideOn?: 'mobile' | 'tablet' | 'desktop';
  showOn?: 'mobile' | 'tablet' | 'desktop';

  template?: string;
  render?: (row: any) => string;

  actions?: boolean;
  actionButtons?: Array<'edit' | 'delete' | 'view' | string>;

  badgeColor?: string;
  badgeMap?: { [key: string]: string };
}
