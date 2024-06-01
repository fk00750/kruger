interface TimeValidityResult {
  isTimeValid: boolean;
  timePeriodNumber: number | null;
  timePeriodType: "M" | "H" | "D" | "Y" | null;
}

export { TimeValidityResult };
