import { cn } from "@/lib/utils";

type Props = {
  currentYear: number;
};

export default function CalendarHeader({ currentYear }: Props) {
  const today = new Date();
  const isTodayYear = currentYear === today.getFullYear();
  const todayDay = today.getDate();

  return (
    <div className="flex border-b border-border sticky top-0 z-10 bg-background">
      <div className="w-32 shrink-0 font-bold p-2">{currentYear}</div>
      <div className="grow flex relative">
        {Array.from({ length: 31 }, (_, i) => {
          const day = i + 1;
          return (
            <div
              key={`day-${i.toString()}`}
              className={cn(
                "flex-1 text-center text-sm p-1 min-w-[30px] border-l border-border/80",
                isTodayYear && day === todayDay && "text-primary font-bold",
              )}
            >
              {String(day).padStart(2, "0")}
            </div>
          );
        })}
      </div>
    </div>
  );
};
