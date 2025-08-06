import React, { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3,  Activity, Zap, Target } from 'lucide-react';

// Core data interface for weather measurements
interface WeatherData {
  time: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  precipitation: number;
}

// Component props interface
interface WeatherChartsProps {
  data: WeatherData[];
  selectedRegions: string[];
}

// Chart type configuration
interface ChartType {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Pie chart data structure
interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

// Radar chart data structure (transformed from WeatherData)
interface RadarDataItem {
  subject: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

// Tooltip payload structure from Recharts
interface TooltipPayloadItem {
  color: string;
  dataKey: keyof WeatherData;
  value: number;
  payload: WeatherData;
}

// Custom tooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

// Pie chart label entry structure
interface PieLabelEntry {
  name: string;
  percent?: number;
}

// Color constants for consistent theming
const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--weather-hot))',
  'hsl(var(--weather-cool))',
  'hsl(var(--secondary))'
] as const;

const WeatherCharts: React.FC<WeatherChartsProps> = ({ data, selectedRegions }) => {
  const [activeChart, setActiveChart] = useState<string>('line');

  // Generate sample data if none provided - creates 24 hours of mock weather data
  const chartData = data.length > 0 ? data : generateSampleData();

  function generateSampleData(): WeatherData[] {
    const sampleData: WeatherData[] = [];
    const now = new Date();

    // Create 24 hours of sample data with realistic weather patterns
    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
      sampleData.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        // Temperature follows a sine wave pattern with random variation
        temperature: 15 + Math.sin(i * 0.3) * 8 + Math.random() * 4,
        // Humidity follows a cosine pattern (opposite phase to temperature)
        humidity: 60 + Math.cos(i * 0.2) * 20 + Math.random() * 10,
        // Wind speed is random with baseline
        windSpeed: 5 + Math.random() * 15,
        // Pressure follows a gentle sine wave with small random variation
        pressure: 1010 + Math.sin(i * 0.1) * 20 + Math.random() * 5,
        // Precipitation occurs randomly (30% chance) when it does occur
        precipitation: Math.random() > 0.7 ? Math.random() * 5 : 0
      });
    }

    return sampleData;
  }

  // Chart type configuration with icons and labels
  const chartTypes: ChartType[] = [
    { id: 'line', label: 'Line Chart', icon: TrendingUp },
    { id: 'area', label: 'Area Chart', icon: Activity },
    { id: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { id: 'pie', label: 'Distribution', icon: PieChart },
    { id: 'radar', label: 'Radar Chart', icon: Target },
    { id: 'gauge', label: 'Gauge', icon: Zap }
  ];

  // Custom tooltip component with proper typing
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-primary/20 rounded-lg p-3 shadow-weather">
          <p className="font-medium text-foreground">{`Time: ${label}`}</p>
          {payload.map((entry: TooltipPayloadItem, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value.toFixed(1)}${getUnit(entry.dataKey)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Get appropriate unit for each data type
  const getUnit = (dataKey: keyof WeatherData): string => {
    switch (dataKey) {
      case 'temperature': return '°C';
      case 'humidity': return '%';
      case 'windSpeed': return ' km/h';
      case 'pressure': return ' hPa';
      case 'precipitation': return ' mm';
      default: return '';
    }
  };

  // Main chart rendering function - returns different chart types based on selection
  const renderChart = (): React.ReactElement | null => {
    switch (activeChart) {
      case 'line':
        // Line chart showing temperature and humidity trends over time
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke={CHART_COLORS[0]}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS[0], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: CHART_COLORS[0], strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke={CHART_COLORS[1]}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS[1], strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        // Area chart showing temperature and precipitation as filled areas
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="temperature"
                stackId="1"
                stroke={CHART_COLORS[0]}
                fill={CHART_COLORS[0]}
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="precipitation"
                stackId="2"
                stroke={CHART_COLORS[2]}
                fill={CHART_COLORS[2]}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        // Bar chart comparing wind speed and precipitation
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="windSpeed" fill={CHART_COLORS[1]} radius={[2, 2, 0, 0]} />
              <Bar dataKey="precipitation" fill={CHART_COLORS[2]} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        // Pie chart showing temperature distribution categories
        const pieData: PieDataItem[] = [
          { name: 'High Temp (>25°C)', value: chartData.filter(d => d.temperature > 25).length, color: CHART_COLORS[2] },
          { name: 'Medium Temp (15-25°C)', value: chartData.filter(d => d.temperature >= 15 && d.temperature <= 25).length, color: CHART_COLORS[0] },
          { name: 'Low Temp (<15°C)', value: chartData.filter(d => d.temperature < 15).length, color: CHART_COLORS[3] }
        ];

        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: PieLabelEntry) => {
                  const pct = entry.percent !== undefined ? (entry.percent * 100).toFixed(0) : '0';
                  return `${entry.name} ${pct}%`;
                }}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'radar':
        // Radar chart showing multiple weather parameters for first 6 time points
        const radarData: RadarDataItem[] = chartData.slice(0, 6).map((item, index) => ({
          subject: `T${index + 1}`,
          temperature: item.temperature,
          humidity: item.humidity / 2, // Scale down for better visualization
          windSpeed: item.windSpeed,
          pressure: (item.pressure - 1000) / 2 // Normalize pressure to reasonable scale
        }));

        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" />
              <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
              <Radar
                name="Temperature"
                dataKey="temperature"
                stroke={CHART_COLORS[0]}
                fill={CHART_COLORS[0]}
                fillOpacity={0.3}
              />
              <Radar
                name="Wind Speed"
                dataKey="windSpeed"
                stroke={CHART_COLORS[1]}
                fill={CHART_COLORS[1]}
                fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'gauge':
        // Custom gauge chart showing average temperature as a circular progress indicator
        const avgTemp = chartData.reduce((sum, item) => sum + item.temperature, 0) / chartData.length;
        const gaugeValue = Math.min(Math.max(avgTemp, -20), 50); // Clamp between -20°C and 50°C
        const gaugePercentage = ((gaugeValue + 20) / 70) * 100; // Convert to 0-100% scale

        return (
          <div className="flex items-center justify-center h-96">
            <div className="relative w-64 h-64">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="hsl(var(--muted))"
                  strokeWidth="12"
                  fill="none"
                />
                {/* Progress circle - animated based on temperature */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - gaugePercentage / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--weather-cold))" />
                    <stop offset="50%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--weather-hot))" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Center text showing temperature value */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-foreground">
                  {avgTemp.toFixed(1)}°C
                </span>
                <span className="text-sm text-muted-foreground">Avg Temperature</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-secondary/10 border-primary/10 shadow-weather">
      <div className="space-y-6">
        {/* Chart Type Selector - buttons to switch between different chart types */}
        <div className="flex flex-wrap gap-2">
          {chartTypes.map((chart) => {
            const IconComponent = chart.icon;
            return (
              <Button
                key={chart.id}
                variant={activeChart === chart.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveChart(chart.id)}
                className={`${activeChart === chart.id
                    ? "bg-gradient-sky text-white shadow-glow"
                    : "border-primary/20 hover:bg-primary/5"
                  }`}
              >
                <IconComponent className="h-4 w-4 mr-1" />
                {chart.label}
              </Button>
            );
          })}
        </div>

        {/* Chart Header - displays current chart info and selected regions */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Weather Data Visualization
            </h3>
            <p className="text-sm text-muted-foreground">
              {chartTypes.find(c => c.id === activeChart)?.label} • {chartData.length} data points
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Active Regions</p>
            <p className="font-medium text-foreground">
              {selectedRegions.length || 'Global'}
            </p>
          </div>
        </div>

        {/* Chart Container - main visualization area */}
        <div className="bg-gradient-to-br from-background/50 to-secondary/5 rounded-lg p-4 border border-primary/10">
          {renderChart()}
        </div>

        {/* Stats Summary - calculated statistics from the weather data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Temp</p>
            <p className="text-lg font-semibold text-primary">
              {(chartData.reduce((sum, item) => sum + item.temperature, 0) / chartData.length).toFixed(1)}°C
            </p>
          </div>
          <div className="bg-accent/5 rounded-lg p-3 border border-accent/10">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Max Wind</p>
            <p className="text-lg font-semibold text-accent">
              {Math.max(...chartData.map(item => item.windSpeed)).toFixed(1)} km/h
            </p>
          </div>
          <div className="bg-weather-cool/5 rounded-lg p-3 border border-weather-cool/10">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Humidity</p>
            <p className="text-lg font-semibold text-weather-cool">
              {(chartData.reduce((sum, item) => sum + item.humidity, 0) / chartData.length).toFixed(1)}%
            </p>
          </div>
          <div className="bg-weather-hot/5 rounded-lg p-3 border border-weather-hot/10">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Rain</p>
            <p className="text-lg font-semibold text-weather-hot">
              {chartData.reduce((sum, item) => sum + item.precipitation, 0).toFixed(1)} mm
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherCharts;