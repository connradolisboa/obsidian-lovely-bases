import type { BasesPropertyId, BasesViewConfig } from "obsidian";

import { useOpenDailyNote } from "@/hooks/use-open-daily-note";
import { cn } from "@/lib/utils";
import type { EntryClickEventHandler } from "@/types";

import type { CalendarItem } from "../types";
import { daysInMonth, getEventsForMonth, getMonthName } from "../utils";

import Events from "./Events";
import Grid from "./Grid";

const PROPERTY_LINE_HEIGHT = 14;
const PROPERTIES_BOTTOM_PADDING = 4;
const BASE_LANE_SPACING = 26;

type Props = {
  config: BasesViewConfig;
  currentYear: number;
  isLastMonth: boolean;
  items: CalendarItem[];
  monthIndex: number;
  onEntryClick: EntryClickEventHandler;
  propertiesLayout: "vertical" | "horizontal";
  propertiesShowNames: boolean;
  visibleProperties: BasesPropertyId[];
};

export default function MonthRow({
  config,
  currentYear,
  isLastMonth,
  items,
  monthIndex,
  onEntryClick,
  propertiesLayout,
  propertiesShowNames,
  visibleProperties,
}: Props) {
  const openDailyNote = useOpenDailyNote();
  const monthName = getMonthName(monthIndex);
  const formattedMonthName =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const daysCount = daysInMonth(monthIndex, currentYear);
  const { events, laneCount } = getEventsForMonth(
    items,
    monthIndex,
    currentYear,
  );

  const propRows = propertiesLayout === "horizontal" && visibleProperties.length > 0
    ? 1
    : visibleProperties.length;
  const propsHeight = propRows > 0 ? propRows * PROPERTY_LINE_HEIGHT + PROPERTIES_BOTTOM_PADDING : 0;
  const laneSpacing = BASE_LANE_SPACING + propsHeight;
  const rowHeight = Math.max(48, 24 + laneCount * (laneSpacing + 2));

  return (
    <div
      key={monthIndex}
      className={cn(
        "flex hover:bg-muted/10 transition-colors",
        !isLastMonth && "border-b border-border/60",
      )}
      style={{ minHeight: `${rowHeight}px` }}
    >
      <div className="w-32 shrink-0 font-medium p-2 py-4">
        {formattedMonthName}
      </div>
      <div className="grow relative flex">
        {/* Grid Background */}
        <Grid
          monthIndex={monthIndex}
          daysCount={daysCount}
          currentYear={currentYear}
          onDayClick={(day, e) => openDailyNote(new Date(currentYear, monthIndex, day), e)}
        />

        {/* Events Layer */}
        <div className="absolute inset-0 w-full h-full z-10 mt-1">
          {events.map((event) => (
            <Events
              key={`${event.id}-${monthIndex}`}
              event={event}
              monthIndex={monthIndex}
              onEntryClick={onEntryClick}
              config={config}
              visibleProperties={visibleProperties}
              propertiesLayout={propertiesLayout}
              propertiesShowNames={propertiesShowNames}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
