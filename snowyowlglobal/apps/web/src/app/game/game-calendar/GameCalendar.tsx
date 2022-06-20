import React, { useState } from 'react';
import { useFetch } from 'apps/web/src/react-hooks/useFetch';
import { GameDTO } from 'apps/web/src/react-models';
import { GameCalendarProperties, GameCalendarViewProperties, GameCalendarViewStyle, CalendarPayLoad, DailyCalendarHeader } from './types';
import { MonthlyCalendar } from './MonthlyCalendar';
import { addMonth, firstDay } from 'apps/web/src/react-utils';
import { encodeDate, setMonth } from './utils';
import { DailyCalendar } from './DailyCalendar';
import axios from 'axios';

const fetchMonthlyData = async (domain: string, date: Date, onLoad: (payload: CalendarPayLoad) => void) => {
    const response = await axios.get(`${domain}/game/in-month?pivot-date=${encodeDate(date)}`);
    const gameList = response.data.entity as GameDTO[];
    onLoad({games: gameList, currentDate: date});    
}

const GameCalendarView: React.FC<GameCalendarViewProperties> = ({games, pivotDate, domain}) => {
    const [dailyPayLoad, setDailyPayLoad] = useState<CalendarPayLoad>({games: [], currentDate: pivotDate});
    const [monthlyPayload, setMonthlyPayLoad] = useState<CalendarPayLoad>({games: games || [], currentDate: pivotDate});
    const [viewStyle, setViewStyle] = useState<GameCalendarViewStyle>('MONTHLY');    
    const reload = (date: Date) => fetchMonthlyData(domain, date, setMonthlyPayLoad);       
    const onPreviousMonthClick = () => reload(addMonth(monthlyPayload.currentDate, -1));
    const onNextMonthClick = () => reload(addMonth(monthlyPayload.currentDate, 1));
    const onMonthSelectorClick = (index: number) => reload(setMonth(monthlyPayload.currentDate, index));
    const onBackButtonClick = () => setViewStyle('MONTHLY');
    const BackToMonthlyView: DailyCalendarHeader = (properties: Record<string, any>) => <button onClick={onBackButtonClick}>«</button>;

    const onCellClick = (day: Date) => {
        const dailyPayLoad = monthlyPayload.games.filter((game: GameDTO) => encodeDate(game.pendingDate) === encodeDate(day));

        setDailyPayLoad({games: dailyPayLoad, currentDate: day});       
        setViewStyle('DAILY') ;
    }
    
    return (
        viewStyle === 'MONTHLY' ?
        <MonthlyCalendar payload={monthlyPayload} onMonthSelectorClick={onMonthSelectorClick} onCellClick={onCellClick} onPreviousMonthClick={onPreviousMonthClick} onNextMonthClick={onNextMonthClick}/> :
        <DailyCalendar payload={dailyPayLoad} header={BackToMonthlyView}/>
    )
    
}
 
const GameCalendarError: React.FC<{error?: any}> = ({error}) => (<p>{error ? error.toString() : ''}</p>)

export const GameCalendar: React.FC<GameCalendarProperties> = ({pivotDate, domain}) => {
    const encodedPivotDate = encodeDate(pivotDate);
    const { response, error, isLoading } = useFetch<GameDTO[]>(`${domain}/game/in-month?pivot-date=${encodedPivotDate}`)
    return isLoading ? <></> :  (error ? <GameCalendarError error={error} /> : <GameCalendarView games={response} pivotDate={pivotDate} domain={domain}/>);
}