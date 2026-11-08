export type CampaignConfiguration = { endsAt: string | null };

function validateEndsAt(endsAt: string | null): string | null {
  if (endsAt === null) return null;

  const match =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/.exec(
      endsAt,
    );

  if (!match || !Number.isFinite(Date.parse(endsAt))) {
    throw new Error(
      "Invalid campaign end date. Use an ISO 8601 date/time with an explicit timezone offset.",
    );
  }

  const [, year, month, day, hour, minute, second, timezone, , offsetHour, offsetMinute] = match;
  const yearNumber = Number(year);
  const monthNumber = Number(month);
  const dayNumber = Number(day);
  const offsetHourNumber = offsetHour === undefined ? 0 : Number(offsetHour);
  const offsetMinuteNumber = offsetMinute === undefined ? 0 : Number(offsetMinute);
  const isLeapYear = yearNumber % 4 === 0 && (yearNumber % 100 !== 0 || yearNumber % 400 === 0);
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const isValidDate =
    monthNumber >= 1 &&
    monthNumber <= 12 &&
    dayNumber >= 1 &&
    dayNumber <= daysInMonth[monthNumber - 1] &&
    Number(hour) <= 23 &&
    Number(minute) <= 59 &&
    Number(second) <= 59;
  const isValidOffset =
    timezone === "Z" ||
    (offsetHourNumber <= 14 &&
      offsetMinuteNumber <= 59 &&
      (offsetHourNumber !== 14 || offsetMinuteNumber === 0));

  if (!isValidDate || !isValidOffset) {
    throw new Error(
      "Invalid campaign end date. Use a valid ISO 8601 date/time with an explicit timezone offset.",
    );
  }

  return endsAt;
}

export function validateCampaign<T extends CampaignConfiguration>(campaign: T): T {
  validateEndsAt(campaign.endsAt);
  return campaign;
}
