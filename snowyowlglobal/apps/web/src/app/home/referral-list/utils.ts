import { useEffect } from "react";
export const rangeRandom = (min:number, max:number) => Math.floor(Math.random() * (max - min)) + min;

export const useLocalStorage = (key: string, fallback?:string) => {
    return localStorage.getItem(key) || fallback;
}

export const referralPhotoUrl = (photoUrl?: string) => {
    const index = rangeRandom(0, 64) | 0;
    const actualUrl = photoUrl ||  `/assets/img/people/person-${index}.png`
    
    return actualUrl;    
}