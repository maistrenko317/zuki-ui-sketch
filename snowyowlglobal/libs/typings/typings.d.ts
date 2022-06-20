/** Dictionaries related */
declare type Dict<T, K extends string | number = string> = { [key in K]: T };
declare type DictValues<T> = T extends Dict<infer U> ? U : never;


/** Like Partial but recursive */
declare type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : DeepPartial<T[P]>
};
