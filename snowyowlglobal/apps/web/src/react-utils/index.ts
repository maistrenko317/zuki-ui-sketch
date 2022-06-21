export const toShortDate = (date: Date) => {
    const string = date.toISOString();
    return string.substring(0, string.indexOf('T'));;
}

export const addDay = (date: Date, days?: number) => {
    const result = new Date(date.valueOf());
    result.setDate(date.getDate() + (days || 0));
    return result;
}

export const addMonth = (date: Date, months?: number) => {
    const result = new Date(date.valueOf());
    result.setMonth(date.getMonth() + (months || 0));
    return result;
}

export const firstDay = (date: Date) => {
    const result = new Date(date.valueOf());
    result.setDate(1);
    return result;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const yearMonth = (date: Date) => date.getFullYear() + '-' + months[date.getMonth()];