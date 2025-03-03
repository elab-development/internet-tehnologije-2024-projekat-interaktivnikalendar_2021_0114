import { formatDateTimeForTask } from "./utils";

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
  const header = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Your Organization//Your Product//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n`;

  const footer = `END:VCALENDAR\r\n`; // End of file

  const formatDateTimeForTask = (date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  function foldLine(line) {
    const parts = [];
    let length = 75;
    while (line.length > length) {
      parts.push(line.slice(0, length));
      line = line.slice(length);
      length = 74;
    }
    parts.push(line);
    return parts.join("\r\n\t");
  }

  const events = tasks.map((task) => {
    const startDate = new Date(task.start);
    const endDate = new Date(task.end);
    const dtstamp = formatDateTimeForTask(new Date());

    return `BEGIN:VEVENT\r\nUID:${task.id + "-" + dtstamp}\r\n${foldLine(
      "SUMMARY:" + task.name
    )}\r\n${foldLine(
      "DESCRIPTION:" + task.description.replace(/\n/g, " ")
    )}\r\nDTSTAMP:${dtstamp}\r\nDTSTART:${formatDateTimeForTask(
      startDate
    )}\r\nDTEND:${formatDateTimeForTask(endDate)}\r\nEND:VEVENT\r\n`;
  });

  return header + events.join("") + footer;
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
    const formattedEndDate = endDate
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "");

    return `BEGIN:VEVENT
UID:${sprint.id}
SUMMARY:${sprint.name}
DTSTART;VALUE=DATE:${startDate}
DTEND;VALUE=DATE:${formattedEndDate}
X-MICROSOFT-CDO-ALLDAYEVENT:TRUE
END:VEVENT`;
  });

  return [header, ...events, footer].join("\r\n");
};
