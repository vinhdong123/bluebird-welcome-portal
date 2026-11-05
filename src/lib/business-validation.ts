/** Vietnamese tax code (mã số thuế): 10 digits, or 10 digits + "-" + 3-digit branch code. */
export function isValidTaxCode(value: string): boolean {
  return /^\d{10}(-\d{3})?$/.test(value.trim());
}

/** Vietnamese mobile number: starts with 0 or +84, then a 3/5/7/8/9 prefix and 8 more digits. */
export function isValidVnPhone(value: string): boolean {
  const cleaned = value.replace(/[\s.-]/g, "");
  return /^(0|\+84)[35789]\d{8}$/.test(cleaned);
}

export const companySizes = [
  "1 – 10 nhân sự",
  "11 – 50 nhân sự",
  "51 – 200 nhân sự",
  "201 – 1000 nhân sự",
  "Trên 1000 nhân sự",
] as const;
