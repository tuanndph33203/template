export interface ITableConfig {
  label: string;
  field: string;

  type?:
    | 'index'
    | 'text'
    | 'date'
    | 'image'
    | 'transform'
    | 'currency'
    | 'number'
    | 'select'
    | 'action';

  align?: 'right' | 'left' | 'center';

  visible?: boolean;

  transformFn?: (v: any) => any;

  width?: string;
  minWidth?: string;
  maxWidth?: string;

  tooltip?: boolean;
  tooltipField?: string;

  truncate?: number;
  lineClamp?: 1 | 2 | 3 | 4 | 5;
  edition?: boolean;
  inputConfig?: {
    prefix?: string;
    suffix?: string;
    min?: number;
    max?: number;
  };
  selectConfig?: any[];

  actionButtons?: Array<{
    label?: string;
    command?: () => void;
    icon?: string;
    type: string;
    tooltipLabel?: string;
    children?: ITableAction[];
    visible?: (row: any) => boolean;
  }>;
}
export interface ITableAction {
  label?: string;
  command?: () => void;
  icon?: string;
  type: string;
  tooltipLabel?: string;
}

export interface ApiResponse<T> {
  Data: PageResponse<T>;
  Code: number;
  Message: string;
  TotalTime: number;
  DataCount: number | null;
  Status: string | null;
  TotalCount: number | null;
}
export interface ApiResponseDetail<T> {
  Data: T;
  Code: number;
  Message: string;
  TotalTime: number;
  DataCount: number | null;
  Status: string | null;
  TotalCount: number | null;
}
export interface PageResponse<T> {
  Page: number;
  TotalPages: number;
  Size: number;
  NumberOfElements: number;
  TotalElements: number;
  Content: T;
}

export interface ITableActionEvent<Row = any> {
  action: ITableAction;
  row: Row;
}

export interface LazyLoadEventData {
  first: number;
  rows: number;
  sortOrder?: 1 | -1 | 0; // tăng | giảm | none
  filters?: Record<string, any>;
  globalFilter?: string | null;
}
