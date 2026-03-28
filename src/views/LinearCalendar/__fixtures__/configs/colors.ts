import type { LinearCalendarConfig } from "../../LinearCalendarView";

export const COLORS_ICONS_BASE_CONFIG: LinearCalendarConfig = {
  focus: 'quarter',
  layout: 'vertical',
  startDateProperty: 'note.start_date',
  endDateProperty: 'note.end_date',
  date: '2026',
  colorProperty: 'note.color',
  iconProperty: 'note.icon',
  propertiesLayout: "vertical",
  propertiesShowNames: true,
  ganttTitleSize: 12,
  ganttPropertiesSize: 9,
};
