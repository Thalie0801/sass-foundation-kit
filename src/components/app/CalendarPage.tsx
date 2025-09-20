import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockContents } from "@/lib/mockAppData";
import { useAppLayoutContext } from "./AppLayout";
import { Calendar as CalendarIcon, Download, ChevronLeft, ChevronRight, List } from "lucide-react";

type CalendarView = "month" | "week" | "list";

type CalendarEvent = {
  id: string;
  title: string;
  plannedAt: string;
  status: string;
  channel: string;
  contentId: string;
};

const toDateKey = (value: string | Date) => {
  const date = typeof value === "string" ? new Date(value) : value;
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const generateICS = (events: CalendarEvent[]) => {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Æditus//Calendar//FR",
  ];

  events.forEach((event) => {
    const start = new Date(event.plannedAt);
    const dtStart = `${start.getUTCFullYear()}${`${start.getUTCMonth() + 1}`.padStart(2, "0")}${`${start.getUTCDate()}`.padStart(2, "0")}T${`${start.getUTCHours()}`.padStart(2, "0")}${`${start.getUTCMinutes()}`.padStart(2, "0")}00Z`;
    const dtEndDate = new Date(start);
    dtEndDate.setUTCHours(dtEndDate.getUTCHours() + 1);
    const dtEnd = `${dtEndDate.getUTCFullYear()}${`${dtEndDate.getUTCMonth() + 1}`.padStart(2, "0")}${`${dtEndDate.getUTCDate()}`.padStart(2, "0")}T${`${dtEndDate.getUTCHours()}`.padStart(2, "0")}${`${dtEndDate.getUTCMinutes()}`.padStart(2, "0")}00Z`;

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${event.id}@aeditus`);
    lines.push(`DTSTAMP:${dtStart}`);
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`DTEND:${dtEnd}`);
    lines.push(`SUMMARY:${event.title}`);
    lines.push(`DESCRIPTION:Statut ${event.status} • Canal ${event.channel}`);
    lines.push(`URL:https://app.aeditus.com/app/contents/${event.contentId}`);
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
};

const heatLevel = (count: number, weeklyTarget: number) => {
  if (count === 0) return "bg-muted";
  if (count >= weeklyTarget) return "bg-destructive/40";
  if (count >= weeklyTarget * 0.75) return "bg-warning/40";
  return "bg-primary/20";
};

const initialEvents: CalendarEvent[] = mockContents
  .filter((content) => content.plannedAt)
  .map((content) => ({
    id: content.id,
    title: content.title,
    plannedAt: content.plannedAt!,
    status: content.status,
    channel: content.channel,
    contentId: content.id,
  }));

export default function CalendarPage() {
  const { organization } = useAppLayoutContext();
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [view, setView] = useState<CalendarView>("month");
  const [currentDate, setCurrentDate] = useState(() => new Date("2025-01-23T08:00:00.000Z"));
  const [modal, setModal] = useState<{ open: boolean; date: string; title: string; channel: string }>(
    { open: false, date: "", title: "", channel: "Blog" }
  );

  const monthlyEvents = useMemo(() => {
    const grouped = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const key = toDateKey(event.plannedAt);
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(event);
    });
    return grouped;
  }, [events]);

  const matrix = useMemo(() => {
    const firstDay = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1));
    const startOffset = (firstDay.getUTCDay() + 6) % 7; // Monday start
    const start = new Date(firstDay);
    start.setUTCDate(start.getUTCDate() - startOffset);

    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start);
      day.setUTCDate(start.getUTCDate() + index);
      const key = toDateKey(day);
      return {
        date: day,
        key,
        events: monthlyEvents.get(key) ?? [],
      };
    });
  }, [currentDate, monthlyEvents]);

  const currentMonthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(
        new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth())
      ),
    [currentDate]
  );

  const weekEvents = useMemo(() => {
    const start = new Date(currentDate);
    const day = (start.getUTCDay() + 6) % 7;
    start.setUTCDate(start.getUTCDate() - day);
    const end = new Date(start);
    end.setUTCDate(start.getUTCDate() + 7);
    return events.filter((event) => {
      const planned = new Date(event.plannedAt);
      return planned >= start && planned < end;
    });
  }, [events, currentDate]);

  const upcomingList = useMemo(
    () => [...events].sort((a, b) => a.plannedAt.localeCompare(b.plannedAt)),
    [events]
  );

  const weeklyQuota = Object.values(organization.quotas.weekly).reduce((sum, value) => sum + value, 0);

  const changeMonth = (offset: number) => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setUTCMonth(prev.getUTCMonth() + offset, 1);
      return next;
    });
  };

  const onExport = () => {
    const blob = new Blob([generateICS(events)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aeditus-calendar.ics";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const onReplan = (id: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? {
              ...event,
              plannedAt: new Date(new Date(event.plannedAt).getTime() + 24 * 60 * 60 * 1000).toISOString(),
            }
          : event
      )
    );
  };

  const openModal = (date: string) => {
    setModal({ open: true, date, title: "", channel: "Blog" });
  };

  const closeModal = () => setModal((state) => ({ ...state, open: false }));

  const submitModal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEvents((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        title: modal.title || "Nouveau contenu",
        plannedAt: `${modal.date}T09:00:00.000Z`,
        status: "idea",
        channel: modal.channel,
        contentId: "cnt-new",
      },
    ]);
    closeModal();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Calendrier éditorial</h1>
          <p className="text-sm text-muted-foreground">
            Faites glisser pour replanifier rapidement ou utilisez le bouton « Replanifier ».
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" /> Export .ics
          </Button>
          <div className="inline-flex rounded-md border">
            <Button
              variant={view === "month" ? "default" : "ghost"}
              onClick={() => setView("month")}
              className="rounded-none"
            >
              <CalendarIcon className="mr-2 h-4 w-4" /> Mois
            </Button>
            <Button
              variant={view === "week" ? "default" : "ghost"}
              onClick={() => setView("week")}
              className="rounded-none"
            >
              <CalendarIcon className="mr-2 h-4 w-4" /> Semaine
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              onClick={() => setView("list")}
              className="rounded-none"
            >
              <List className="mr-2 h-4 w-4" /> Liste
            </Button>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)} aria-label="Mois précédent">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold capitalize">{currentMonthLabel}</span>
          <Button variant="ghost" size="icon" onClick={() => changeMonth(1)} aria-label="Mois suivant">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          Quota hebdo total : {weeklyQuota} contenus • Double-clic pour planifier un contenu
        </div>
      </div>

      {view === "month" && (
        <div className="grid grid-cols-7 gap-2">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((label) => (
            <div key={label} className="px-2 text-xs font-medium text-muted-foreground">
              {label}
            </div>
          ))}
          {matrix.map(({ date, key, events: dayEvents }) => {
            const isCurrentMonth = date.getUTCMonth() === currentDate.getUTCMonth();
            const intensityClass = heatLevel(dayEvents.length, Math.max(1, Math.round(weeklyQuota / 5)));
            return (
              <div
                key={key}
                onDoubleClick={() => openModal(key)}
                className={`min-h-[120px] rounded-lg border p-2 text-xs transition-colors ${
                  isCurrentMonth ? "bg-background" : "bg-muted"
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className={`font-medium ${isCurrentMonth ? "" : "text-muted-foreground"}`}>
                    {date.getUTCDate()}
                  </span>
                  <span className={`h-3 w-12 rounded-full ${intensityClass}`} />
                </div>
                <div className="space-y-1">
                  {dayEvents.map((event) => (
                    <div key={event.id} className="rounded bg-primary/10 p-2 text-[11px]">
                      <Link to={`/app/contents/${event.contentId}`} className="font-medium hover:underline">
                        {event.title}
                      </Link>
                      <div className="mt-1 flex items-center justify-between">
                        <span>{event.channel}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[11px]"
                          onClick={() => onReplan(event.id)}
                        >
                          Replanifier
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "week" && (
        <div className="space-y-3">
          {weekEvents.length > 0 ? (
            weekEvents.map((event) => (
              <div key={event.id} className="flex flex-wrap items-center justify-between rounded-lg border p-4">
                <div>
                  <Link to={`/app/contents/${event.contentId}`} className="font-medium hover:underline">
                    {event.title}
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    {toDateKey(event.plannedAt)} • {event.channel} • {event.status}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/app/contents/${event.contentId}`}>Détail</Link>
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => onReplan(event.id)}>
                    Replanifier
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Aucun contenu programmé cette semaine.
            </div>
          )}
        </div>
      )}

      {view === "list" && (
        <div className="space-y-3">
          {upcomingList.map((event) => (
            <div key={event.id} className="flex flex-wrap items-center justify-between rounded-lg border p-3">
              <div>
                <Link to={`/app/contents/${event.contentId}`} className="font-medium hover:underline">
                  {event.title}
                </Link>
                <div className="text-xs text-muted-foreground">
                  {toDateKey(event.plannedAt)} • {event.channel} • Statut {event.status}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onReplan(event.id)}>
                Replanifier
              </Button>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-xl">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Nouveau contenu</h2>
              <p className="text-sm text-muted-foreground">Création rapide pour le {modal.date}</p>
            </div>
            <form className="space-y-4" onSubmit={submitModal}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Titre</label>
                <Input
                  value={modal.title}
                  onChange={(event) => setModal((state) => ({ ...state, title: event.target.value }))}
                  placeholder="Titre du contenu"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Canal</label>
                <select
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={modal.channel}
                  onChange={(event) => setModal((state) => ({ ...state, channel: event.target.value }))}
                >
                  {Object.keys(organization.quotas.weekly).map((channel) => (
                    <option key={channel} value={channel}>
                      {channel}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Annuler
                </Button>
                <Button type="submit">Planifier</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
