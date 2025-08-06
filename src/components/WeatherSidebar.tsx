import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Settings, Palette, Thermometer, Droplets, Wind, Gauge } from 'lucide-react';
import { ColorRule, WeatherFieldId, ComparisonOperator } from '@/types/weather.js';
import { cn } from '@/lib/utils';

// Comparison operator types

// Data source identifiers
type DataSourceId = 'open-meteo' | 'weather-api' | 'noaa';


interface NewColorRule {
  field: WeatherFieldId;
  operator: ComparisonOperator;
  value: number;
  color: string;
  label: string;
}

// Component props interface
interface WeatherSidebarProps {
  colorRules: ColorRule[];
  onColorRuleAdd: (rule: Omit<ColorRule, 'id'>) => void;
  onColorRuleDelete: (id: string) => void;
  selectedDataSource: string;
  onDataSourceChange: (source: string) => void;
  selectedField: string;
  onFieldChange: (field: string) => void;
}

// Data source configuration
interface DataSource {
  id: DataSourceId;
  name: string;
  description: string;
  disabled?: boolean;
}

// Weather field configuration with icon and unit
interface WeatherField {
  id: WeatherFieldId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  unit: string;
}

// Comparison operator configuration
interface OperatorConfig {
  id: ComparisonOperator;
  name: string; // Symbol representation
  label: string; // Human-readable description
}

// Default rule template for quick actions
interface DefaultRule {
  field: WeatherFieldId;
  operator: ComparisonOperator;
  value: number;
  color: string;
  label: string;
}

const WeatherSidebar: React.FC<WeatherSidebarProps> = ({
  colorRules,
  onColorRuleAdd,
  onColorRuleDelete,
  selectedDataSource,
  onDataSourceChange,
  selectedField,
  onFieldChange
}) => {
  // State for the new rule form
  const [newRule, setNewRule] = useState<NewColorRule>({
    field: 'temperature_2m',
    operator: 'gt',
    value: 25,
    color: '#ef4444',
    label: 'Hot'
  });

  const dataSources: DataSource[] = [
    { 
      id: 'open-meteo', 
      name: 'Open-Meteo Archive', 
      description: 'Historical weather data' 
    },
    { 
      id: 'weather-api', 
      name: 'Weather API', 
      description: 'Real-time weather (Coming Soon)', 
      disabled: true 
    }
  ];

  const weatherFields: WeatherField[] = [
    { id: 'temperature_2m', name: 'Temperature (2m)', icon: Thermometer, unit: '°C' },
    { id: 'relative_humidity_2m', name: 'Humidity (2m)', icon: Droplets, unit: '%' },
    { id: 'wind_speed_10m', name: 'Wind Speed (10m)', icon: Wind, unit: 'km/h' },
    { id: 'surface_pressure', name: 'Surface Pressure', icon: Gauge, unit: 'hPa' }
  ];

  // Available comparison operators
  const operators: OperatorConfig[] = [
    { id: 'gt', name: '>', label: 'Greater than' },
    { id: 'gte', name: '≥', label: 'Greater than or equal' },
    { id: 'lt', name: '<', label: 'Less than' },
    { id: 'lte', name: '≤', label: 'Less than or equal' },
    { id: 'eq', name: '=', label: 'Equal to' }
  ];

  // Preset color palette for quick selection
  const presetColors: string[] = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#6b7280'  // gray
  ];


  const handleAddRule = (): void => {
    if (newRule.label.trim()) {
      onColorRuleAdd(newRule);

      setNewRule({
        field: selectedField as WeatherFieldId,
        operator: 'gt',
        value: 25,
        color: presetColors[colorRules.length % presetColors.length],
        label: ''
      });
    }
  };


  const handleOperatorChange = (value: string): void => {
    if (isValidOperator(value)) {
      setNewRule({ ...newRule, operator: value });
    }
  };

  const handleFieldChange = (value: string): void => {
    if (isValidWeatherField(value)) {
      setNewRule({ ...newRule, field: value });
    }
  };

  const isValidOperator = (value: string): value is ComparisonOperator => {
    return ['gt', 'lt', 'gte', 'lte', 'eq'].includes(value);
  };


  const isValidWeatherField = (value: string): value is WeatherFieldId => {
    return ['temperature_2m', 'relative_humidity_2m', 'wind_speed_10m', 'surface_pressure'].includes(value);
  };


  const getFieldUnit = (fieldId: string): string => {
    return weatherFields.find(f => f.id === fieldId)?.unit || '';
  };


  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewRule({ ...newRule, value: Number(e.target.value) });
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewRule({ ...newRule, label: e.target.value });
  };

  // Handle color selection
  const handleColorSelect = (color: string): void => {
    setNewRule({ ...newRule, color });
  };

  const addDefaultTemperatureRules = (): void => {
    const defaultRules: DefaultRule[] = [
      { field: 'temperature_2m', operator: 'gte', value: 30, color: '#ef4444', label: 'Hot' },
      { field: 'temperature_2m', operator: 'gte', value: 20, color: '#f97316', label: 'Warm' },
      { field: 'temperature_2m', operator: 'lt', value: 10, color: '#3b82f6', label: 'Cold' }
    ];
    defaultRules.forEach(rule => onColorRuleAdd(rule));
  };


  const clearAllRules = (): void => {
    colorRules.forEach(rule => onColorRuleDelete(rule.id));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Data Source Selection - Choose where weather data comes from */}
      <Card className={cn("p-4 bg-white from-card to-primary/ border-none")}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <Label className="text-sm font-medium">Data Source</Label>
          </div>
          
          <Select value={selectedDataSource} onValueChange={onDataSourceChange}>
            <SelectTrigger className={cn("border-none")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={cn("border-none bg-white")}>
              {dataSources.map((source) => (
                <SelectItem 
                  key={source.id} 
                  value={source.id}
                  disabled={source.disabled}
                  className={source.disabled ? "opacity-50" : ""}
                >
                  <div>
                    <div className="font-medium">{source.name}</div>
                    <div className="text-xs text-muted-foreground">{source.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Weather Field Selection - Choose which weather parameter to visualize */}
      <Card className={cn("p-4 bg-gradient-to-br from-card to-accent/5 border-none")}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-accent" />
            <Label className="text-sm font-medium">Weather Field</Label>
          </div>
          
          <Select value={selectedField} onValueChange={onFieldChange}>
            <SelectTrigger className={cn("border-none")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={cn("border-0 bg-white")}>
              {weatherFields.map((field) => {
                const IconComponent = field.icon;
                return (
                  <SelectItem key={field.id} value={field.id}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      <span>{field.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {field.unit}
                      </Badge>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </Card>


      <Card className={cn("p-4 bg-gradient-to-br from-card to-secondary/10 border-0")}>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-secondary-foreground" />
            <Label className="text-sm font-medium">Color Rules</Label>
          </div>

          {/* Add New Rule Form */}
          <div className="space-y-3 p-3 bg-secondary/20 rounded-lg ">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Add New Rule
            </Label>
            
            {/* Field and Operator Selection */}
            <div className="grid grid-cols-2 gap-2">
              <Select 
                value={newRule.field} 
                onValueChange={handleFieldChange}
              >
                <SelectTrigger className="text-xs border-secondary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {weatherFields.map((field) => (
                    <SelectItem key={field.id} value={field.id} className="text-xs">
                      {field.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={newRule.operator} 
                onValueChange={handleOperatorChange}
              >
                <SelectTrigger className="text-xs border-secondary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((op) => (
                    <SelectItem key={op.id} value={op.id} className="text-xs">
                      {op.name} {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Value and Label Input */}
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                value={newRule.value}
                onChange={handleValueChange}
                placeholder="Value"
                className="text-xs border-secondary/30"
              />
              
              <Input
                type="text"
                value={newRule.label}
                onChange={handleLabelChange}
                placeholder="Label"
                className="text-xs border-secondary/30"
              />
            </div>

            {/* Color Picker - Preset Colors */}
            <div className="flex gap-1">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`w-6 h-6 rounded border-2 transition-all ${
                    newRule.color === color ? 'border-foreground scale-110' : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>

            {/* Add Rule Button */}
            <Button
              onClick={handleAddRule}
              disabled={!newRule.label.trim()}
              size="sm"
              className="w-full bg-gradient-sunset text-white"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Rule
            </Button>
          </div>

          <Separator />

          {/* Existing Rules List */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Active Rules ({colorRules.length})
            </Label>
            
            {colorRules.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-4">
                No color rules defined
              </p>
            ) : (
              <div className="space-y-2">
                {colorRules.map((rule) => {
                  const operator = operators.find(op => op.id === rule.operator);
                  const field = weatherFields.find(f => f.id === rule.field);
                  
                  return (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between p-2 bg-card/50 rounded border border-border/50 group hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {/* Color Indicator */}
                        <div
                          className="w-3 h-3 rounded-full border border-border"
                          style={{ backgroundColor: rule.color }}
                        />
                        <div className="flex-1 min-w-0">
                          {/* Rule Label */}
                          <p className="text-xs font-medium text-foreground truncate">
                            {rule.label}
                          </p>
                          {/* Rule Details */}
                          <p className="text-xs text-muted-foreground truncate">
                            {field?.name} {operator?.name} {rule.value}{getFieldUnit(rule.field)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onColorRuleDelete(rule.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Delete rule ${rule.label}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Quick Actions - Preset rule configurations */}
      <Card className="p-4 bg-gradient-to-br from-card to-muted/10 border-muted/20">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Quick Actions</Label>
          
          <div className="space-y-2">
            {/* Add Default Temperature Rules */}
            <Button
              variant="outline"
              size="sm"
              onClick={addDefaultTemperatureRules}
              className="w-full text-xs border-primary/20 hover:bg-primary/5"
            >
              Add Temperature Rules
            </Button>
            
            {/* Clear All Rules */}
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllRules}
              className="w-full text-xs border-destructive/20 hover:bg-destructive/5 hover:text-destructive"
              disabled={colorRules.length === 0}
            >
              Clear All Rules
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WeatherSidebar;