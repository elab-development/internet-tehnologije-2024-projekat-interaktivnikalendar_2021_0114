import { formatDateTimeForTask} from "./utils";

export const downloadTasksIcsFile = (tasks) => {
  const icsContent = generateICSContentForTasks(tasks);
  const blob = new Blob([icsContent], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tasks.ics";
  a.click();
  URL.revokeObjectURL(url);
};

const generateICSContentForTasks = (tasks) => { 
  const header = `BEGIN:VCALENDAR 
                VERSION:2.0
                PRODID:-//Your Organization//Your Product//EN
                CALSCALE:GREGORIAN
                METHOD:PUBLISH`;

  const footer = `END:VCALENDAR`; //kraj fajla

  const events = tasks.map((task) => {
    const startDate = new Date(task.start);
    const endDate = new Date(task.end);

    return `BEGIN:VEVENT
        UID:${task.id}
        SUMMARY:${task.name}
        DESCRIPTION:${task.description}
        STATUS:${task.status}
        DTSTART:${formatDateTimeForTask(startDate).replace(/[-:]/g, "")}
        DTEND:${formatDateTimeForTask(endDate).replace(/[-:]/g, "")}
        END:VEVENT`;
  });

  return [header, ...events, footer].join("\n");
};

export const downloadSprintsIcsFile = (sprints) => {
    const icsContent = generateICSContentForSprints(sprints);
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sprints.ics";
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const generateICSContentForSprints = (sprints) => {
    const header = `BEGIN:VCALENDAR
                    VERSION:2.0
                    PRODID:-//Your Organization//Your Product//EN
                    CALSCALE:GREGORIAN
                    METHOD:PUBLISH`;
  
    const footer = `END:VCALENDAR`; // kraj fajla
  
    const events = sprints.map((sprint) => {
        const startDate = sprint.start.replace(/-/g, ""); // YYYYMMDD format
        const endDate = new Date(sprint.end);
        endDate.setDate(endDate.getDate() + 1); // Google traži dan posle kraja
        const formattedEndDate = endDate.toISOString().split("T")[0].replace(/-/g, "");
    
      return `BEGIN:VEVENT
            UID:${sprint.id}
            SUMMARY:${sprint.name}
            DTSTART;VALUE=DATE:${startDate}
            DTEND;VALUE=DATE:${formattedEndDate}
            END:VEVENT`;
    });
  
    return [header, ...events, footer].join("\n");
  };
