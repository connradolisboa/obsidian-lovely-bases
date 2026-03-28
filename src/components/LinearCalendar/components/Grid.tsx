import { cn } from "@/lib/utils";

type Props = {
  monthIndex: number;
  daysCount: number;
  currentYear: number;
  onDayClick?: (day: number, event: React.MouseEvent) => void;
};

export default function MonthGrid({ monthIndex, daysCount, currentYear, onDayClick }: Props) {
  const today = new Date();
  const isCurrentMonth =
    currentYear === today.getFullYear() && monthIndex === today.getMonth();
  const todayDay = today.getDate();

  return (
    <div className="absolute inset-0 flex w-full h-full">
      {Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        const isValidDay = day <= daysCount;
        const isTodayCol = isCurrentMonth && day === todayDay;
        return (
          <div
            key={`bg-${monthIndex}-${day}`}
            role={isValidDay ? "button" : undefined}
            tabIndex={isValidDay ? 0 : undefined}
            aria-label={isValidDay ? `Open daily note for ${currentYear}-${monthIndex + 1}-${day}` : undefined}
            className={cn(
              "flex-1 min-w-[30px] border-l border-border/60 h-full relative",
              !isValidDay && "bg-muted/20 pointer-events-none",
              isValidDay && "cursor-pointer hover:bg-primary/5",
              isTodayCol && "bg-primary/10",
            )}
            onClick={isValidDay ? (e) => onDayClick?.(day, e) : undefined}
            onKeyDown={isValidDay ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onDayClick?.(day, e as unknown as React.MouseEvent);
              }
            } : undefined}
          >
            {isTodayCol && (
              <div className="absolute inset-y-0 left-0 w-[2px] bg-primary/60 pointer-events-none" />
            )}
          </div>
        );
      })}
    </div>
  );
};
