import type { BasesEntry, BasesPropertyId, TFile } from "obsidian";

export type CalendarItem = {
  id: string;
  title: string;
  file: TFile;
  entry: BasesEntry;
  startDate: Date;
  endDate: Date;
  color?: string;
  icon?: string;
};

export type StackedEvent = CalendarItem & {
  clampedStart: Date;
  clampedEnd: Date;
  startDay: number;
  endDay: number;
  original: CalendarItem;
  lane: number;
};

export type LinearCalendarConfig = {
  focus: "full" | "half" | "quarter";
  layout: "vertical" | "horizontal";
  startDateProperty?: BasesPropertyId;
  endDateProperty?: BasesPropertyId;
  titleProperty?: BasesPropertyId;
  colorProperty?: BasesPropertyId;
  iconProperty?: BasesPropertyId;
  date?: string;
  propertiesLayout: "vertical" | "horizontal";
  propertiesShowNames: boolean;
  ganttTitleSize: number;
  ganttPropertiesSize: number;
  ganttShowFixedColumn: boolean;
};
