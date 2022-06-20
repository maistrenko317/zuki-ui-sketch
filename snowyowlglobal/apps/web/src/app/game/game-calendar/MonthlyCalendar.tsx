import React, { useEffect, useRef, useState } from 'react';
import { useStyle } from 'apps/web/src/react-hooks';
import { stylesheet } from './MonthlyCalendar.style';
import { MonthlyCalendarProperties } from './types';
import { addCalendarEntries, currentMonth, groupGamesByDay, useLocalizedMonths } from './utils';
import { Dropdown } from './Dropdown';

const MonthDropdown = Dropdown<string>();

export const MonthlyCalendar: React.FC<MonthlyCalendarProperties> = ({payload, onCellClick, onPreviousMonthClick, onNextMonthClick, onMonthSelectorClick}) => {
    const tableRef = useRef(null);
    const containerRef = useRef(null);
    const [selectedMonth, setSelectedMonth] = useState(payload.currentDate.getMonth());
    const localizedMonths = useLocalizedMonths().map(value => ({value: value, label: value}));
    const onSelectMonth = (_: string, index: number) => onMonthSelectorClick(index)
    
    useStyle(stylesheet, containerRef, payload.games)    ;
    useEffect(() => {
        if(tableRef && tableRef.current) {
            const table = (tableRef.current as unknown) as HTMLTableElement;
            const dayGames = groupGamesByDay(payload.games);    
            const firstDate = payload.currentDate;
            addCalendarEntries(firstDate, table, dayGames, onCellClick);
            setSelectedMonth(payload.currentDate.getMonth());
        }

    },[payload])    

    return (
        <div ref={containerRef}>
            <table ref={tableRef}>
                <thead>
                    <tr>
                        <th className='point-left' onClick={onPreviousMonthClick}>«</th>
                        <th colSpan={5} className='month-selector-cell'>
                            <MonthDropdown className='month-selector' onSelect={onSelectMonth} selectedIndex={selectedMonth}  options={localizedMonths}/>
                        </th>
                        <th className='point-right'  onClick={onNextMonthClick}>»</th>
                    </tr>
                    <tr>
                        <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sun</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                    </tr>
                    <tr>
                        <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                    </tr>
                    <tr>
                        <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                    </tr>
                    <tr>
                        <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                    </tr>
                    <tr>
                        <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                    </tr>
                    <tr>
                        <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                    </tr>                                                                
                </tbody>
            </table>
        </div>
    )
}

