export function enableJSONDates(): void {
  const oldParse = JSON.parse;
  const reISO = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

  const dateParser = function(key: any, value: any) {
    if (typeof value === 'string') {
      if (reISO.exec(value)) return new Date(value);
    }
    return value;
  };

  // Overrides the JSON.parse function to automatically convert date strings into dates
  JSON.parse = function(json) {
    return oldParse(json, dateParser);
  };
}
