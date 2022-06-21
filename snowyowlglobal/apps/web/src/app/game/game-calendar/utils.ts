import { GameDTO } from "apps/web/src/react-models";
import { addDay, toShortDate } from "apps/web/src/react-utils";
import { defaultMaxListeners } from "stream";
import { onCellClickHanler } from './types';

export const encodeDate = (date: Date) => encodeURIComponent(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);
export const extractTime = (date: Date) => date.toLocaleTimeString();
export const setMonth = (date: Date, month: number) => {
    const result = new Date(date.valueOf());
    result.setMonth(month);
    return result;
}

export const groupGamesByDay = (games: GameDTO[]) => games.reduce(
    (dayGames: Record<string, number>, game: GameDTO) => {
        const date = toShortDate(game.pendingDate);
        const count = dayGames[date] || 0;
        return ({...dayGames, [date] : count + 1});
    },
    ({} as  Record<string, number>)
);

const ordinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n%100;
    return n + (s[(v-20)%10] || s[v] || s[0]);
}

const clearCell = (element: HTMLElement) => {
    let child = element.lastElementChild; 
    element.classList.remove('tournament-cell');
    element.classList.remove('higlighted-cell');
    
    if(element.getAttribute("data-onclick-set")) {
        element.removeAttribute("data-onclick-set");
        const onClickWrapper = (element as any).onClickWrapper;
        element.removeEventListener("click", onClickWrapper);
    }

    while (child) {
        element.removeChild(child);
        child = element.lastElementChild;
    }
}

const addCalendarEntry = (cell: HTMLTableCellElement, date: Date, onCellClick: onCellClickHanler, count?: number) => {
    const fragment = document.createDocumentFragment();
    const dayLabel = document.createElement('p');
    dayLabel.className = 'day-label';
    dayLabel.innerText = `${ordinal(date.getDate())}`;
    fragment.appendChild(dayLabel);
    
    if(count) {
        const gameCount = document.createElement('p')    ;
        gameCount.className = 'game-count';
        gameCount.innerText = count.toFixed(0);    
        fragment.appendChild(gameCount);        
        cell.classList.add('tournament-cell');

        if(!cell.getAttribute("data-onclick-set")) {
            const onClickWrapper  = (event: MouseEvent) => {
                onCellClick(date);
                event.preventDefault();

            };

            cell.addEventListener('click', onClickWrapper);            
            (cell as any).onClickWrapper = onClickWrapper;
            cell.setAttribute("data-onclick-set", "true");
        }
    } else {
        cell.classList.add('higlighted-cell')   
    }
    cell.appendChild(fragment);
}

export const addCalendarEntries = (startDate: Date,  table: HTMLTableElement, dayGames: Record<string, number>, onCellClick: onCellClickHanler) => {
    const tbody = table.tBodies[0];
    const rows = tbody.rows;    
    const firstDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const lastDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
    let rowIndex = 0;
    let columnIndex =  startDate.getDay();
    table.querySelectorAll('td').forEach(cell => clearCell(cell));
    

    for(let date = firstDate; date < lastDate; date = addDay(date, 1)) {
        const shortDate = toShortDate(date);        
        addCalendarEntry(rows[rowIndex].cells[columnIndex], date, onCellClick, dayGames[shortDate]);                
        rowIndex = columnIndex == 6 ? (rowIndex + 1) : rowIndex;
        columnIndex = columnIndex == 6 ? 0 : (columnIndex + 1);                
    }
}

const MONTHS = ['January', 'Februry', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const currentMonth = (index: number) => MONTHS[index];
export const useLocalizedMonths = () => ([...MONTHS]);