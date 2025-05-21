import { useState, useEffect } from "react";

function DigitalClock() {
    const [time, setTime] = useState(new Date());
    const [timezone, setTimezone] = useState<string>();

    useEffect(() => {
        const storedTz =
            localStorage.getItem("user-timezone") ||
            Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(storedTz);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formattedTime = time.toLocaleTimeString(undefined, {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <div className="text-sm absolute right-8 bottom-5 text-gray-500 font-mono text-center">
            {formattedTime}
        </div>
    );
}

export default DigitalClock;