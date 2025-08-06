export type ComparisonOperator = 'gt' | 'lt' | 'gte' | 'lte' | 'eq';

export type WeatherFieldId =
  | 'temperature_2m'
  | 'relative_humidity_2m'
  | 'wind_speed_10m'
  | 'surface_pressure';

export interface ColorRule {
  id: string;
  field: WeatherFieldId;
  operator: ComparisonOperator;
  value: number;
  color: string;
  label: string;
}
