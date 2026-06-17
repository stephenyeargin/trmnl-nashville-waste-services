function transform(input) {
  const events = Array.isArray(input?.events) ? input.events : [];

  const reducedEvents = events
    .filter((event) => event && event.day)
    .map((event) => ({
      day: event.day,
      is_holiday: event.is_holiday,
      flags: Array.isArray(event.flags)
        ? event.flags
            .map((flag) => {
              const reducedFlag = {
                name: flag?.name,
                opts: {
                  event_type: flag?.opts?.event_type,
                },
              };

              const holidaySubject = flag?.subject_hash?.["en-US"];
              if (holidaySubject) {
                reducedFlag.subject_hash = {
                  "en-US": holidaySubject,
                };
              }

              return reducedFlag;
            })
            .filter((flag) => flag.name || flag.opts.event_type || flag.subject_hash)
        : [],
    }));

  return {
    // Keep a daily-changing marker so the screen still refreshes at least once/day.
    generated: new Date().toISOString().slice(0, 10),
    events: reducedEvents,
  };
}