import React, { useEffect, useRef } from "react";
import { createApp } from "vue";
import DateCalendar from "./DateCalendar.vue";

export default function VueCalendarBridge({ slots, selectedIds, onSelect }) {
  const hostRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    if (!hostRef.current) return undefined;

    appRef.current = createApp(DateCalendar, {
      slots,
      selectedIds,
      pickSlot: onSelect,
    });
    appRef.current.mount(hostRef.current);

    return () => {
      appRef.current?.unmount();
      appRef.current = null;
    };
  }, [slots, selectedIds, onSelect]);

  return <div ref={hostRef} />;
}
