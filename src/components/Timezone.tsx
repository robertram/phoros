import React, { useMemo, useState } from "react";
import spacetime from "spacetime";
import TimezoneSelect, { allTimezones } from "react-timezone-select";

interface TimezoneProps {
  value?: any
  onChange: (timezone: any) => void
}

export const Timezone = ({ value, onChange }: TimezoneProps) => {
  const [tz, setTz] = useState<any>(
    value ? value : Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [datetime, setDatetime] = useState(spacetime.now());

  useMemo(() => {
    const tzValue = tz.value ?? tz;
    setDatetime(datetime.goto(tzValue));
    onChange(tzValue)
  }, [tz]);

  return (
    <div className="text-black">
      <TimezoneSelect
        value={tz}
        onChange={setTz}
        labelStyle="altName"
        timezones={{
          ...allTimezones,
          "America/Lima": "Pittsburgh",
          "Europe/Berlin": "Frankfurt"
        }}
      />
      {/* <div className="output-wrapper">
        <div>
          Current Date / Time in{" "}
          {tz.value ? tz.value.split("/")[1] : tz.split("/")[1]}:{" "}
          <pre>{datetime.unixFmt("dd.MM.YY HH:mm:ss")}</pre>
        </div>
        <div>
          <div>Selected Timezone:</div>
          <pre>{JSON.stringify(tz, null, 2)}</pre>
        </div>
      </div> */}
    </div>
  );
}
