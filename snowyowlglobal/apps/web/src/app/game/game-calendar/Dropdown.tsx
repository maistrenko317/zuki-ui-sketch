import React, { ChangeEvent } from 'react';
import { DropdownOption, DropdownProperties } from './types';

export const Dropdown = <T,>(): React.FC<DropdownProperties<T>> =>
  ({onSelect, selectedIndex, className, options}) => {
    const enhancedClassName = 'dropdown' + (className ? ` ${className}` : '');
    const onChange = (event: ChangeEvent) => {
        event.preventDefault();
        const index  = (event.target as any).selectedIndex;
        const option = options[index].value;
        onSelect(option, index);
    };

    return (
        <select className={enhancedClassName} onChange={onChange}>
            {options.map((option:DropdownOption<T>, index:number) => <option key={index} selected={selectedIndex === index}>{option.label}</option>)}
        </select>    
    );
  };
