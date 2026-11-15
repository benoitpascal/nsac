import { WORLD_CONDITIONS } from '../../core/station/conditions';
import { startStores } from '../../core/station/resources';
import { batteryShare } from '../../core/excavator/excavator-power';
import { DAY_ONE } from '../../core/mission/day-one';
import type { ExcavatorStore } from '../../core/excavator/excavator-power';
import type { StationReadings } from '../../core/station/readings';

/** The base's stocks as shares (%), as the rest of the demo shows them. */
export type BaseShares = { energy: number; oxygen: number; water: number; food: number };

/** A resource line of the dashboard: its icon, name, value as shown, and fill (0–100). */
export type ResourceRow = { icon: string; name: string; value: string; level: number };

const PERCENT = 100;
const EARTH_RADIATION = WORLD_CONDITIONS.earth.radiationMicroSvPerHour;
const whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const START = startStores();

const share = (value: number, full: number) =>
  Math.round(Math.min(PERCENT, Math.max(0, (value / full) * PERCENT)));

/** Without a demo campaign (free walk), the station's own stores as shares of their start. */
export const sharesOf = (readings: StationReadings): BaseShares => ({
  energy: share(readings.batteryShare, 1),
  oxygen: share(readings.oxygenKg, START.oxygenKg),
  water: share(readings.waterLiters, START.waterLiters),
  food: share(readings.foodKg, START.foodKg),
});

const percentRow = (icon: string, name: string, level: number): ResourceRow => ({
  icon,
  name,
  value: `${level} %`,
  level,
});

/** The base's stocks, then the robot's battery and the regolith it brought back. */
export const resourceRows = (base: BaseShares, excavator: ExcavatorStore): ResourceRow[] => {
  const delivered = Math.floor(excavator.deliveredKg / DAY_ONE.kgPerUnit);
  return [
    percentRow('bolt', 'Power', base.energy),
    percentRow('oxygen', 'Oxygen', base.oxygen),
    percentRow('drop', 'Water', base.water),
    percentRow('food', 'Food', base.food),
    percentRow('battery', 'Robot battery', Math.round(batteryShare(excavator) * PERCENT)),
    {
      icon: 'rock',
      name: 'Regolith at the base',
      value: `${delivered} / ${DAY_ONE.goalUnits}`,
      level: share(delivered, DAY_ONE.goalUnits),
    },
  ];
};

/** One line about outside: temperature, radiation compared with Earth, day or night. */
export const outsideLine = (readings: StationReadings) =>
  `Outside: ${whole.format(readings.outsideCelsius)} °C · radiation ` +
  `${whole.format(readings.radiationMicroSvPerHour / EARTH_RADIATION)}× Earth · ` +
  `${readings.daytime ? 'day' : 'night'}`;
