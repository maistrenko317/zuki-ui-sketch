import { GameDTO } from 'apps/web/src/react-models';
import React, { useRef } from 'react';
import { DailyCalendarProperties } from './types';
import { extractTime } from './utils';
import { stylesheet } from './DailyCalendar.style';
import { useStyle } from 'apps/web/src/react-hooks';

const DailyCalendarRow: React.FC<{game: GameDTO}> = ({game}) => (
    <tr key={game.id}>
        <td className='game-photo'>
            <div className='container'>
                <img src={game.photoUrl}></img>
            </div>
        </td>
        <td className='game-name'>
            <span>{game.name}</span>
            <span className='time'>{extractTime(game.pendingDate)}</span>
        </td>
        <td className='game-award'><span>{game.topPrize}</span></td>
    </tr>
)

const EmptyHeader: React.FC = () => <></>

export const DailyCalendar: React.FC<DailyCalendarProperties> = ({payload, header}) => {
    const tableRef = useRef(null);
    const containerRef = useRef(null);
    const Header = header || EmptyHeader;

    useStyle(stylesheet, containerRef, payload.games)    ;    
    const games = payload.games;
    return (
        <div ref={containerRef}>
            <table ref={tableRef}>
                <thead>
                    <tr>
                        <th><Header /></th>
                    </tr>
                    <tr>
                        <th></th>
                        <th className='game-name-h'>Name</th>
                        <th className='game-award-h'>Award</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map(game => <DailyCalendarRow game={game} />)}
                </tbody>
            </table>
        </div>
    )
}