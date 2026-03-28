
import type { BasesPropertyId, BasesViewConfig } from "obsidian";

import { useObsidian } from "@/components/Obsidian/Context";
import LucideIcon from "@/components/Obsidian/LucideIcon";
import PropertyValue from "@/components/Obsidian/PropertyValue";
import { cn } from "@/lib/utils";
import type { EntryClickEventHandler } from "@/types";

import type { StackedEvent } from "../types";

const PROPERTY_LINE_HEIGHT = 14;
const PROPERTIES_BOTTOM_PADDING = 4;
const BASE_LANE_SPACING = 26;

type Props = {
  config: BasesViewConfig;
  event: StackedEvent;
  monthIndex: number;
  onEntryClick: EntryClickEventHandler;
  propertiesLayout: "vertical" | "horizontal";
  propertiesShowNames: boolean;
  visibleProperties: BasesPropertyId[];
};

export default function EventBar({
  config,
  event,
  monthIndex,
  onEntryClick,
  propertiesLayout,
  propertiesShowNames,
  visibleProperties,
}: Props) {
  const { app } = useObsidian();
  const { renderContext } = app;

  const leftPercent = ((event.startDay - 1) / 31) * 100;
  const widthPercent = ((event.endDay - event.startDay + 1) / 31) * 100;

  const propRows = propertiesLayout === "horizontal" && visibleProperties.length > 0 ? 1 : visibleProperties.length;
  const propsHeight = propRows > 0 ? propRows * PROPERTY_LINE_HEIGHT + PROPERTIES_BOTTOM_PADDING : 0;
  const laneSpacing = BASE_LANE_SPACING + propsHeight;
  const eventHeight = 20 + propsHeight;
  const topPos = 4 + event.lane * laneSpacing;

  const hasProps = visibleProperties.length > 0 && widthPercent > 5;

  const propertyItems = hasProps
    ? visibleProperties.map((propId) => {
        const value = event.original.entry.getValue(propId);
        if (!value || value.toString() === "null") return null;
        return { propId, value, displayName: config.getDisplayName(propId) };
      }).filter(Boolean)
    : [];

  return (
    <div
      key={`${event.id}-${monthIndex}`}
      className={cn(
        "absolute rounded-sm text-[10px] text-white overflow-hidden px-1 cursor-pointer hover:brightness-110 shadow-sm transition-all pt-0.5",
        !event.color && "bg-primary",
      )}
      style={{
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        top: `${topPos}px`,
        height: `${eventHeight}px`,
        backgroundColor: event.color,
      }}
      title={`${event.title} (${event.original.startDate.toLocaleDateString()} - ${event.original.endDate.toLocaleDateString()})`}
      onClick={(e) => {
        e.stopPropagation();
        onEntryClick(event.original.id, e);
      }}
    >
      {/* Title row */}
      {(event.icon || widthPercent > 3) && (
        <span className="drop-shadow-md flex items-center whitespace-nowrap">
          {event.icon && <LucideIcon name={event.icon} className="size-4 text-white inline-block mr-1" />}
          {widthPercent > 3 ? event.title : null}
        </span>
      )}

      {/* Properties */}
      {propertyItems.length > 0 && (
        <div
          className={cn(
            "mt-0.5",
            propertiesLayout === "horizontal" ? "flex flex-row flex-wrap gap-x-2 gap-y-0" : "flex flex-col",
          )}
        >
          {propertyItems.map((item) => (
            <div
              key={item!.propId}
              className="text-[9px] leading-[14px] text-white/90 truncate [&_a]:text-white/90 [&_a]:underline [&_a]:underline-offset-1"
            >
              {propertiesShowNames && (
                <span className="text-white/60">{item!.displayName}: </span>
              )}
              <PropertyValue
                renderContext={renderContext}
                as="span"
                className="inline"
                value={item!.value}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
