import { useState, useEffect } from 'react'

type TimeType = { hours: string, minutes: string, seconds: string, timeWarning: boolean };

type WarningType = (hours: number, minutes: number, seconds: number, warningInterval: number) => boolean;


export const useMsToTime = (duration: string | undefined) => {
    const [counter, setCounter] = useState<number>(0);
    
    const countDuration = Date.now()

    useEffect(() => {
        const endTimeNumber = Number(duration?.split(',').join(''))
        const interval = setInterval(() => {
            setCounter(endTimeNumber - Date.now())
        }, 1000);
        return () => clearInterval(interval);
    }, [countDuration, counter, duration]);


    const warningCheck: WarningType = (hours, minutes, seconds, warningInterval) => (!!hours && !!minutes && (seconds > warningInterval));

    const getReturnValues = (timeLeft: number): TimeType => {
        const hoursTemp = Math.floor(timeLeft / 1000 / 60 / 60);
        const minutesTemp = Math.floor((timeLeft / 1000 / 60 / 60 - hoursTemp) * 60);
        const secondsTemp = Math.floor(((timeLeft / 1000 / 60 / 60 - hoursTemp) * 60 - minutesTemp) * 60);

        const timeLessTen = (time: number): string => time > 0 ? `0${time.toString()}` : '00'

        const hours = hoursTemp >= 10 ? hoursTemp.toString() : timeLessTen(hoursTemp);
        const minutes = minutesTemp >= 10 ? minutesTemp.toString() : timeLessTen(minutesTemp);
        const seconds = secondsTemp >= 10 ? secondsTemp.toString() : timeLessTen(secondsTemp)
        const timeWarning = warningCheck(hoursTemp, minutesTemp, secondsTemp, 20)

        return { hours, minutes, seconds, timeWarning };
    }

    return getReturnValues(counter)
};

