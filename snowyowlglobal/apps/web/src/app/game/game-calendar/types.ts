import React from 'react';
import { GameDTO } from "apps/web/src/react-models";

export type onMonthMoveClickHandler = () => void;

export type onCellClickHanler = (day: Date) => void;

export interface GameCalendarProperties {
    pivotDate: Date;
    domain: string;
}

export interface CalendarPayLoad {
    currentDate: Date;
    games: GameDTO[];
}

export type DailyCalendarHeader = React.FC<Record<string, any>>;

export interface DailyCalendarProperties {
    payload: CalendarPayLoad;
    header?: DailyCalendarHeader;
}

export type onMonthSelectorClickHandler = (index: number) => void;

export interface MonthlyCalendarProperties {
    payload: CalendarPayLoad;
    onPreviousMonthClick: onMonthMoveClickHandler;
    onNextMonthClick: onMonthMoveClickHandler;
    onCellClick: onCellClickHanler;
    onMonthSelectorClick: onMonthSelectorClickHandler;
}

export type GameCalendarViewStyle = 'MONTHLY' | 'DAILY';

export interface GameCalendarViewProperties {
    games: GameDTO[] | null;
    pivotDate:Date;
    domain: string;
}

export interface DropdownOption<T> {
    label:string;
    value:T;
}

export type onDropDownSelectHandler<T> = (option: T, index: number) => void;

export interface DropdownProperties<T> {
    options: DropdownOption<T>[];
    onSelect: onDropDownSelectHandler<T>;
    selectedIndex: number;
    className?: string;
}