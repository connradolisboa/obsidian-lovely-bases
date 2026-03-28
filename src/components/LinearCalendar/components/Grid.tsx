import { cn } from "@/lib/utils";

type Props = {
  monthIndex: number;
  daysCount: number;
  currentYear: number;
};

export default function MonthGrid({ monthIndex, daysCount, currentYear }: Props) {
  const today = new Date();
  const isCurrentMonth =
    currentYear === today.getFullYear() && monthIndex === today.getMonth();
  const todayDay = today.getDate();

  return (
    <div className="absolute inset-0 flex w-full h-full pointer-events-none">
      {Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        const isValidDay = day <= daysCount;
        const isTodayCol = isCurrentMonth && day === todayDay;
        return (
          <div
            key={`bg-${monthIndex}-${day}`}
            className={cn(
              "flex-1 min-w-[30px] border-l border-border/60 h-full relative",
              !isValidDay && "bg-muted/20",
              isTodayCol && "bg-primary/10",
            )}
          >
            {isTodayCol && (
              <div className="absolute inset-y-0 left-0 w-[2px] bg-primary/60" />
            )}
          </div>
        );
      })}
    </div>
  );
};
