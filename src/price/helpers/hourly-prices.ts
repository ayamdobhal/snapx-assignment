import { Price } from '../entities/price.entity';
import { HourlyPrice } from '../interfaces/hourly-price.interface';

export function getHourlyPrices(priceHistory: Price[]): HourlyPrice[] {
  const sortedData = [...priceHistory].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  );

  const hourlyGroups = new Map<string, Price[]>();

  sortedData.forEach((point) => {
    const hourKey = new Date(point.timestamp).setMinutes(0, 0, 0).toString();

    if (!hourlyGroups.has(hourKey)) {
      hourlyGroups.set(hourKey, []);
    }
    hourlyGroups.get(hourKey).push(point);
  });

  const hourlyPrices: HourlyPrice[] = Array.from(hourlyGroups.entries())
    .map(([hourKey, points]) => {
      const timestamp = new Date(parseInt(hourKey));

      return {
        timestamp,
        open: points[0].price,
        close: points[points.length - 1].price,
        high: Math.max(...points.map((p) => p.price)),
        low: Math.min(...points.map((p) => p.price)),
      };
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return hourlyPrices;
}

export function get24HourlyPrices(priceHistory: Price[]): HourlyPrice[] {
  const hourlyPrices = getHourlyPrices(priceHistory);
  const complete24Hours: HourlyPrice[] = [];

  const now = new Date();
  now.setMinutes(0, 0, 0);

  for (let i = 0; i < 24; i++) {
    const hourTimestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const existingHourData = hourlyPrices.find(
      (h) => h.timestamp.getTime() === hourTimestamp.getTime(),
    );

    if (existingHourData) {
      complete24Hours.push(existingHourData);
    } else {
      complete24Hours.push({
        timestamp: hourTimestamp,
        open: null,
        close: null,
        high: null,
        low: null,
      });
    }
  }

  return complete24Hours;
}
