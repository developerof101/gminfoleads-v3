export type Row = string[];

export type RowObj = {
  [key: string]: any;
};

export interface ValidationError {
  row: Row;
  rowNumber: number;
  errors: string[];
}

export const equalsIgnoreOrder = (a: any[], b: any[]) => {
  if (a.length !== b.length) return false;
  const uniqueValues = new Set([...a, ...b]);
  for (const v of uniqueValues) {
    const aCount = a.filter((e) => e === v).length;
    const bCount = b.filter((e) => e === v).length;
    if (aCount !== bCount) return false;
  }
  return true;
};
