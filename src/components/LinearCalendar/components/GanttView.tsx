import type { BasesPropertyId, BasesViewConfig } from "obsidian";

import { useObsidian } from "@/components/Obsidian/Context";
import LucideIcon from "@/components/Obsidian/LucideIcon";
import PropertyValue from "@/components/Obsidian/PropertyValue";
import { useOpenDailyNote } from "@/hooks/use-open-daily-note";
import { cn } from "@/lib/utils";
import type { EntryClickEventHandler } from "@/types";

import type { CalendarItem, LinearCalendarConfig } from "../types";
import { daysInMonth, getMonthName } from "../utils";

const DAY_WIDTH = 30;
const ROW_HEIGHT = 36;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

type Props = {
  calendarConfig: LinearCalendarConfig;
  config: BasesViewConfig;
  items: CalendarItem[];
  monthIndices: number[];
  currentYear: number;
  onEntryClick: EntryClickEventHandler;
  visibleProperties: BasesPropertyId[];
};

export default function GanttView({
  calendarConfig,
  config,
  items,
  monthIndices,
  currentYear,
  onEntryClick,
  visibleProperties,
}: Props) {
  const { app } = useObsidian();
  const { renderContext } = app;
  const openDailyNote = useOpenDailyNote();

  const today = new Date();
  const isCurrentYear = currentYear === today.getFullYear();

  let runningOffset = 0;
  const monthMeta = monthIndices.map((monthIndex) => {
    const days = daysInMonth(monthIndex, currentYear);
    const offset = runningOffset;
    runningOffset += days;
    return { monthIndex, days, offset };
  });

  const totalDays = runningOffset;
  const totalWidth = totalDays * DAY_WIDTH;

  const timelineStart = new Date(currentYear, monthIndices[0], 1);
  const timelineEnd = new Date(
    currentYear,
    monthIndices[monthIndices.length - 1] + 1,
    0,
  );

  const todayOffset =
    isCurrentYear && today >= timelineStart && today <= timelineEnd
      ? Math.floor((today.getTime() - timelineStart.getTime()) / MS_PER_DAY)
      : null;

  const visibleItems = items.filter(
    (item) => item.startDate <= timelineEnd && item.endDate >= timelineStart,
  );

  const getDayOffset = (date: Date): number =>
    Math.floor((date.getTime() - timelineStart.getTime()) / MS_PER_DAY);

  const { propertiesLayout, propertiesShowNames, ganttTitleSize, ganttPropertiesSize, ganttShowFixedColumn } = calendarConfig;
  const fixedColWidth = ganttShowFixedColumn ? 128 : 0;

  return (
    <div className="w-full h-full overflow-auto bg-background text-foreground">
      <div className="flex flex-col" style={{ minWidth: `${totalWidth + fixedColWidth}px` }}>
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          {/* Month name row */}
          <div className="flex">
            {ganttShowFixedColumn && (
              <div className="w-32 shrink-0 font-bold p-2 border-r border-border sticky left-0 z-20 bg-background">
                {currentYear}
              </div>
            )}
            <div className="flex" style={{ width: `${totalWidth}px` }}>
              {monthMeta.map(({ monthIndex, days }) => {
                const monthName = getMonthName(monthIndex);
                const formatted =
                  monthName.charAt(0).toUpperCase() + monthName.slice(1);
                const isCurrentMonth =
                  isCurrentYear && monthIndex === today.getMonth();
                return (
                  <div
                    key={monthIndex}
                    className={cn(
                      "text-sm font-semibold px-1 py-1 border-r border-border overflow-hidden truncate",
                      isCurrentMonth && "text-primary",
                    )}
                    style={{ width: `${days * DAY_WIDTH}px`, minWidth: `${days * DAY_WIDTH}px` }}
                  >
                    {formatted}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day number row */}
          <div className="flex border-t border-border/40">
            {ganttShowFixedColumn && (
              <div className="w-32 shrink-0 sticky left-0 z-20 bg-background border-r border-border" />
            )}
            <div className="flex" style={{ width: `${totalWidth}px` }}>
              {monthMeta.map(({ monthIndex, days }) =>
                Array.from({ length: days }, (_, i) => {
                  const day = i + 1;
                  const isCurrentMonth =
                    isCurrentYear && monthIndex === today.getMonth();
                  const isTodayDay =
                    isCurrentMonth && day === today.getDate();
                  return (
                    <button
                      key={`${monthIndex}-${day}`}
                      type="button"
                      aria-label={`Open daily note for ${currentYear}-${monthIndex + 1}-${day}`}
                      className={cn(
                        "text-center text-[10px] border-l border-border/60 py-0.5 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors",
                        isTodayDay && "text-primary font-bold bg-primary/10",
                      )}
                      style={{ width: `${DAY_WIDTH}px`, minWidth: `${DAY_WIDTH}px` }}
                      onClick={(e) => openDailyNote(new Date(currentYear, monthIndex, day), e)}
                    >
                      {day}
                    </button>
                  );
                }),
              )}
            </div>
          </div>
        </div>

        {/* Item rows */}
        {visibleItems.map((item) => {
          const clampedStart =
            item.startDate < timelineStart ? timelineStart : item.startDate;
          const clampedEnd =
            item.endDate > timelineEnd ? timelineEnd : item.endDate;

          const startOffset = getDayOffset(clampedStart);
          const endOffset = getDayOffset(clampedEnd);
          const widthDays = Math.max(1, endOffset - startOffset + 1);

          const leftPx = startOffset * DAY_WIDTH;
          const widthPx = widthDays * DAY_WIDTH;

          const propertyItems =
            visibleProperties.length > 0
              ? visibleProperties
                  .map((propId) => {
                    const value = item.entry.getValue(propId);
                    if (!value || value.toString() === "null") return null;
                    return {
                      propId,
                      value,
                      displayName: config.getDisplayName(propId),
                    };
                  })
                  .filter(Boolean)
              : [];

          const hasProps = propertyItems.length > 0;
          const barHeight = 20;
          const inlinePropsHeight =
            !ganttShowFixedColumn && hasProps
              ? (propertiesLayout === "horizontal" ? 1 : propertyItems.length) *
                  (ganttPropertiesSize + 2) +
                4
              : 0;

          return (
            <div
              key={item.id}
              className="flex border-b border-border/40 hover:bg-muted/10 transition-colors"
              style={{ minHeight: `${Math.max(ROW_HEIGHT, barHeight + 8 + inlinePropsHeight)}px` }}
            >
              {/* Sticky title column (optional) */}
              {ganttShowFixedColumn && (
                <div className="w-32 shrink-0 px-2 py-1 flex flex-col items-start sticky left-0 z-10 bg-background border-r border-border/60">
                  <span className="truncate leading-tight pt-1 w-full" style={{ fontSize: `${ganttTitleSize}px` }}>
                    {item.title}
                  </span>
                  {hasProps && (
                    <div
                      className={cn(
                        "mt-0.5 w-full",
                        propertiesLayout === "horizontal"
                          ? "flex flex-row flex-wrap gap-x-2 gap-y-0"
                          : "flex flex-col",
                      )}
                    >
                      {propertyItems.map((propItem) => (
                        <div
                          key={propItem!.propId}
                          className="leading-[14px] text-muted-foreground truncate [&_a]:text-muted-foreground [&_a]:underline [&_a]:underline-offset-1"
                          style={{ fontSize: `${ganttPropertiesSize}px` }}
                        >
                          {propertiesShowNames && (
                            <span className="opacity-60">
                              {propItem!.displayName}:{" "}
                            </span>
                          )}
                          <PropertyValue
                            renderContext={renderContext}
                            as="span"
                            className="inline"
                            value={propItem!.value}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Timeline area */}
              <div
                className="relative"
                style={{ width: `${totalWidth}px`, minWidth: `${totalWidth}px` }}
              >
                {/* Grid: month separators */}
                {monthMeta.map(({ monthIndex, offset }) => (
                  <div
                    key={monthIndex}
                    className="absolute top-0 bottom-0 border-l border-border/40 pointer-events-none"
                    style={{ left: `${offset * DAY_WIDTH}px` }}
                  />
                ))}
                {todayOffset !== null && (
                  <div
                    className="absolute top-0 bottom-0 w-[2px] bg-primary/50 pointer-events-none z-[1]"
                    style={{ left: `${todayOffset * DAY_WIDTH}px` }}
                  />
                )}

                {/* Event bar */}
                <div
                  className={cn(
                    "absolute top-1 rounded-sm text-[10px] text-white overflow-hidden px-1 cursor-pointer hover:brightness-110 shadow-sm transition-all pt-0.5",
                    !item.color && "bg-primary",
                  )}
                  style={{
                    left: `${leftPx}px`,
                    width: `${widthPx}px`,
                    height: `${barHeight}px`,
                    backgroundColor: item.color,
                  }}
                  title={`${item.title} (${item.startDate.toLocaleDateString()} - ${item.endDate.toLocaleDateString()})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEntryClick(item.id, e);
                  }}
                >
                  <span className="drop-shadow-md flex items-center whitespace-nowrap">
                    {item.icon && (
                      <LucideIcon
                        name={item.icon}
                        className="size-4 text-white inline-block mr-1"
                      />
                    )}
                    {item.title}
                  </span>
                </div>

                {/* Inline properties label below bar (only when fixed column is hidden) */}
                {!ganttShowFixedColumn && hasProps && (
                  <div
                    className={cn(
                      "absolute pointer-events-none",
                      propertiesLayout === "horizontal"
                        ? "flex flex-row flex-wrap gap-x-2"
                        : "flex flex-col",
                    )}
                    style={{
                      left: `${leftPx}px`,
                      top: `${barHeight + 4}px`,
                      maxWidth: `${widthPx}px`,
                    }}
                  >
                    {propertyItems.map((propItem) => (
                      <div
                        key={propItem!.propId}
                        className="leading-[14px] text-muted-foreground truncate [&_a]:text-muted-foreground"
                        style={{ fontSize: `${ganttPropertiesSize}px` }}
                      >
                        {propertiesShowNames && (
                          <span className="opacity-60">
                            {propItem!.displayName}:{" "}
                          </span>
                        )}
                        <PropertyValue
                          renderContext={renderContext}
                          as="span"
                          className="inline"
                          value={propItem!.value}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
