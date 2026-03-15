export function assertNonEmptyString(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName}不能为空`);
  }
  return normalized;
}

export function assertRegex(value: string, regex: RegExp, message: string): string {
  if (!regex.test(value)) {
    throw new Error(message);
  }
  return value;
}

export function assertFiniteNumber(value: number, fieldName: string): number {
  if (!Number.isFinite(value)) {
    throw new Error(`${fieldName}格式不正确`);
  }
  return value;
}

export function assertPositiveNumber(value: number, fieldName: string): number {
  assertFiniteNumber(value, fieldName);
  if (value <= 0) {
    throw new Error(`${fieldName}必须大于0`);
  }
  return value;
}

export function assertStringArray(values: string[], fieldName: string): string[] {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error(`${fieldName}不能为空`);
  }
  const normalized = values.map((item) => item.trim()).filter(Boolean);
  if (normalized.length === 0) {
    throw new Error(`${fieldName}不能为空`);
  }
  return normalized;
}

export function assertDateOrder(startTime: string, endTime: string): void {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    throw new Error("时间格式不正确");
  }
  if (start >= end) {
    throw new Error("结束时间必须晚于开始时间");
  }
}
