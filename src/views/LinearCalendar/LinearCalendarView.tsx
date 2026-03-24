
import { useMemo } from "react";

import { LinearCalendar } from "@/components/LinearCalendar";
import type { LinearCalendarConfig } from "@/components/LinearCalendar/types";
import { Container } from "@/components/Obsidian/Container";
import { useObsidian } from "@/components/Obsidian/Context";
import { useConfig } from "@/hooks/use-config";
import type { ReactBaseViewProps } from "@/types";

export const LINEAR_CALENDAR_TYPE_ID = "linear-calendar";

export type { LinearCalendarConfig } from "@/components/LinearCalendar/types";

const LinearCalendarView = ({
  config,
  data,
  isEmbedded,
  onEntryClick,
  onEntryHover,
}: ReactBaseViewProps) => {
  const { app } = useObsidian();

  const linearCalendarConfig = useConfig<LinearCalendarConfig>(config, {
    focus: "full",
    startDateProperty: "note.start_date",
    endDateProperty: undefined,
    titleProperty: undefined,
    colorProperty: undefined,
    iconProperty: undefined,
    date: new Date().getFullYear().toString(),
  });

  const resolvedDate = useMemo(() => {
    const raw = linearCalendarConfig.date;
    if (!raw?.startsWith("this.")) return raw;
    const propName = raw.slice(5);
    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) return undefined;
    const frontmatter = app.metadataCache.getFileCache(activeFile)?.frontmatter;
    const value = frontmatter?.[propName];
    return value != null ? String(value) : undefined;
  }, [linearCalendarConfig.date, app]);

  return (
    <Container isEmbedded={isEmbedded} style={{ userSelect: "none" }}>
      <LinearCalendar
        calendarConfig={{ ...linearCalendarConfig, date: resolvedDate }}
        entries={data.data}
        onEntryClick={onEntryClick}
        onEntryHover={onEntryHover}
      />
    </Container>
  );
};

export default LinearCalendarView;
