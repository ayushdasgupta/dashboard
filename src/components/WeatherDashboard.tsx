"use client"
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import dynamic from 'next/dynamic';
const WeatherMap = dynamic(() => import('./WeatherMap'), { ssr: false });
import TimelineSlider from './TimelineSlider';
import WeatherCharts from './WeatherCharts';
import WeatherSidebar from './WeatherSidebar';
import {  Cloud, BarChart3, Map, Settings } from 'lucide-react';
import { ColorRule } from '@/types/weather';
interface Polygon {
  id: string;
  coordinates: number[][];
  color: string;
  temperature?: number;
  name: string;
}



interface WeatherData {
  time: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  precipitation: number;
}

const WeatherDashboard: React.FC = () => {
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<[number, number]>([0, 0]);
  const [colorRules, setColorRules] = useState<ColorRule[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState('open-meteo');
  const [selectedField, setSelectedField] = useState('temperature_2m');
  const [weatherData, ] = useState<WeatherData[]>([]);

  const handlePolygonCreate = useCallback((polygon: Polygon) => {
    setPolygons(prev => [...prev, polygon]);
    // TODO: Fetch weather data for this polygon
  }, []);

  const handlePolygonDelete = useCallback((id: string) => {
    setPolygons(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleColorRuleAdd = useCallback((rule: Omit<ColorRule, 'id'>) => {
    const newRule: ColorRule = {
      id: `rule-${Date.now()}`,
      ...rule
    };
    setColorRules(prev => [...prev, newRule]);
  }, []);

  const handleColorRuleDelete = useCallback((id: string) => {
    setColorRules(prev => prev.filter(r => r.id !== id));
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-primary/5">
        {/* Header */}
        <header className="h-16 bg-card/95 backdrop-blur-sm shadow-weather sticky top-0 z-50">
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="lg:hidden" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-weather flex items-center justify-center">
                  <Cloud className="h-5 w-5 text-black" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Weather Dashboard</h1>
                  <p className="text-xs text-muted-foreground">Geo-Temporal Weather Analytics</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Map className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{polygons.length} regions</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">{colorRules.length} rules</span>
                </div>
                <div className="flex items-center gap-1">
                  <Settings className="h-4 w-4 text-secondary-foreground" />
                  <span className="text-muted-foreground">{selectedDataSource}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <Sidebar className="bg-card/50 backdrop-blur-sm">
            <SidebarContent>
              <div className="p-2 ">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Controls
                </h2>
              </div>
              <WeatherSidebar
                colorRules={colorRules}
                onColorRuleAdd={handleColorRuleAdd}
                onColorRuleDelete={handleColorRuleDelete}
                selectedDataSource={selectedDataSource}
                onDataSourceChange={setSelectedDataSource}
                selectedField={selectedField}
                onFieldChange={setSelectedField}
              />
            </SidebarContent>
          </Sidebar>

          {/* Main Content */}
          <main className="flex-1 flex flex-col">
            {/* Timeline */}
            <div className="p-6 border-b border-primary/10 bg-card/30">
              <TimelineSlider
                selectedRange={selectedTimeRange}
                onTimeRangeChange={setSelectedTimeRange}
              />
            </div>

            {/* Content Grid */}
            <div className="flex-1 p-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
                {/* Map */}
                <Card className="p-0 border-primary/10 shadow-weather overflow-hidden bg-gradient-to-br from-card to-primary/5">
                  <div className="p-4 border-b border-primary/10 bg-card/50">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Map className="h-5 w-5 text-primary" />
                      Interactive Weather Map
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Draw polygons to analyze weather patterns
                    </p>
                  </div>
                  <div className="h-[500px]">
                    <WeatherMap
                      polygons={polygons}
                      onPolygonCreate={handlePolygonCreate}
                      onPolygonDelete={handlePolygonDelete}
                    />
                  </div>
                </Card>

                {/* Charts */}
                <div className="flex flex-col">
                  <div className="h-[500px]">
                    <WeatherCharts
                      data={weatherData}
                      selectedRegions={polygons.map(p => p.name)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default WeatherDashboard;