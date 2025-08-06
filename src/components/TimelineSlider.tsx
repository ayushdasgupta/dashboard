import React, { useState, useCallback } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { format, addHours, startOfDay } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimelineSliderProps {
  onTimeRangeChange: (range: [number, number]) => void;
  selectedRange: [number, number];
}

const TimelineSlider: React.FC<TimelineSliderProps> = ({
  onTimeRangeChange,
  selectedRange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Create timeline: 15 days before today, today, 15 days after today (720 hours total)
  const baseDate = startOfDay(new Date());
  const startHour = -15 * 24; // 15 days before
  const endHour = 15 * 24; // 15 days after
  const totalHours = endHour - startHour;

  const getDateFromHourIndex = useCallback((hourIndex: number) => {
    return addHours(baseDate, startHour + hourIndex);
  }, [baseDate, startHour]);

  const getHourIndexFromValue = useCallback((value: number) => {
    return Math.floor((value / 100) * totalHours);
  }, [totalHours]);

  const getValueFromHourIndex = useCallback((hourIndex: number) => {
    return (hourIndex / totalHours) * 100;
  }, [totalHours]);

  const handleSliderChange = useCallback((value: number | number[]) => {
    if (Array.isArray(value)) {
      const [start, end] = value;
      const startHour = getHourIndexFromValue(start);
      const endHour = getHourIndexFromValue(end);
      onTimeRangeChange([startHour, endHour]);
    }
  }, [getHourIndexFromValue, onTimeRangeChange]);

 

  const formatSelectedRange = useCallback(() => {
    const [startHour, endHour] = selectedRange;
    const startDate = getDateFromHourIndex(startHour);
    const endDate = getDateFromHourIndex(endHour);
    
    if (startHour === endHour) {
      return format(startDate, 'MMM dd, yyyy HH:mm');
    }
    
    return `${format(startDate, 'MMM dd HH:mm')} - ${format(endDate, 'MMM dd HH:mm')}`;
  }, [selectedRange, getDateFromHourIndex]);

  const resetToToday = () => {
    const todayHour = -startHour; // Hours from start to today
    onTimeRangeChange([todayHour, todayHour]);
  };

  const sliderValue = [
    getValueFromHourIndex(selectedRange[0]),
    getValueFromHourIndex(selectedRange[1])
  ];

  // Generate marks for major dates
  const marks: { [key: number]: React.ReactNode } = {};
  for (let i = 0; i <= 30; i += 5) {
    const dayOffset = i - 15; // -15 to +15 days
    const hourIndex = dayOffset * 24 + (-startHour);
    const value = getValueFromHourIndex(hourIndex);
    const date = getDateFromHourIndex(hourIndex);
    
    marks[Math.round(value)] = (
      <span className="text-xs text-muted-foreground">
        {format(date, 'MMM dd')}
      </span>
    );
  }

  // Mark today
  const todayValue = getValueFromHourIndex(-startHour);
  marks[Math.round(todayValue)] = (
    <span className="text-xs font-semibold text-primary">
      Today
    </span>
  );

  return (
    <Card className="p-6 bg-gradient-to-r from-card via-card to-secondary/20 border-primary/10 shadow-weather">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Timeline Control</h3>
            <p className="text-sm text-muted-foreground">
              Select time range for weather analysis
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToToday}
              className="border-primary/20 hover:bg-primary/5"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Today
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="border-primary/20 hover:bg-primary/5"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Selected Range Display */}
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Selected Range</p>
              <p className="text-lg font-semibold text-primary">
                {formatSelectedRange()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-lg font-semibold text-accent">
                {selectedRange[1] - selectedRange[0] + 1}h
              </p>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="px-4 py-8">
          <Slider
            range
            min={0}
            max={100}
            step={0.1}
            value={sliderValue}
            onChange={handleSliderChange}
            marks={marks}
            className="weather-slider"
            trackStyle={[
              {
                backgroundColor: 'hsl(var(--primary))',
                height: 6,
                borderRadius: 3
              }
            ]}
            handleStyle={[
              {
                backgroundColor: 'hsl(var(--primary))',
                borderColor: 'hsl(var(--primary))',
                boxShadow: 'var(--shadow-glow)',
                width: 18,
                height: 18,
                marginTop: -6
              },
              {
                backgroundColor: 'hsl(var(--primary))',
                borderColor: 'hsl(var(--primary))',
                boxShadow: 'var(--shadow-glow)',
                width: 18,
                height: 18,
                marginTop: -6
              }
            ]}
            railStyle={{
              backgroundColor: 'hsl(var(--muted))',
              height: 6,
              borderRadius: 3
            }}
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const todayHour = -startHour;
              onTimeRangeChange([todayHour - 24, todayHour]);
            }}
            className="text-xs border-primary/20 hover:bg-primary/5"
          >
            Last 24h
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const todayHour = -startHour;
              onTimeRangeChange([todayHour - 168, todayHour]);
            }}
            className="text-xs border-primary/20 hover:bg-primary/5"
          >
            Last Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const todayHour = -startHour;
              onTimeRangeChange([todayHour, todayHour + 168]);
            }}
            className="text-xs border-primary/20 hover:bg-primary/5"
          >
            Next Week
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TimelineSlider;