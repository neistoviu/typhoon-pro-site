/* ---------------------------------------------------------------------------
   Savings calculator.

   The arithmetic is lifted verbatim from `typhoon-roi-calculator/` — every
   constant, every formula, the same numbers on screen. Only two things
   changed: the inline `onclick` attributes became listeners so this can be a
   module, and the original's `document.title` write was dropped, because on
   a page it is not the only thing there it would have renamed the whole tab.

   Styling is the site's, not the original's. See `.calc-*` in style.css.
--------------------------------------------------------------------------- */

const $ = id => document.getElementById(id);

const KG_TO_LB = 2.20462;
const WEEKS_PER_MONTH = 4.33;
const TYPHOON_BATCHES_H = 7;
const WORK_HOURS_DAY = 8;
const WORK_DAYS_WEEK = 5;
const DRUM_BATCHES_H = 3.5;
const DRUM_LOAD = 0.90;
const TYPHOON_ENERGY_KG = 0.30;
const DRUM_ENERGY_KG = 0.75;
const TYPHOON_DEFECT = 0.01;
const DRUM_DEFECT = 0.06;

const COST_DEFAULTS = {
  EUR: { energy: 0.25, labor: 15, green: 10 },
  USD: { energy: 0.13, labor: 18, green: 5 },
};

const BATCH_OPTIONS_KG = [2.5, 5, 10, 20, 30];

const state = { currency: 'EUR', batchKg: 10, monthlyKg: 6500 };

function setCurrency(next) {
  state.currency = next;
  $('eurBtn').classList.toggle('active', next === 'EUR');
  $('usdBtn').classList.toggle('active', next === 'USD');
  syncSliderRanges();
  recalc();
}

function setBatchFromSlider(value) {
  const monthlyPercent = monthlySliderPercent();
  const index = Math.max(0, Math.min(BATCH_OPTIONS_KG.length - 1, parseInt(value, 10) || 0));
  state.batchKg = BATCH_OPTIONS_KG[index];
  syncSliderRanges(monthlyPercent);
  recalc();
}

function setMonthlyFromSlider(value) {
  state.monthlyKg = displayToKg(parseFloat(value));
  recalc();
}

const displayToKg = value => state.currency === 'USD' ? value / KG_TO_LB : value;
const kgToDisplay = value => state.currency === 'USD' ? value * KG_TO_LB : value;
const unit = () => state.currency === 'USD' ? 'lb' : 'kg';

function money(value) {
  const rounded = Math.round(value);
  const formatted = Math.abs(rounded).toLocaleString('en-US');
  const sign = rounded < 0 ? '-' : '';
  return state.currency === 'USD' ? sign + '$' + formatted : sign + '€' + formatted;
}

function costMoney(value) {
  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: value < 1 ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return state.currency === 'USD' ? '$' + formatted : '€' + formatted;
}

function massText(kg, kind) {
  const displayValue = kgToDisplay(kg);
  const options = kind === 'batch'
    ? { maximumFractionDigits: state.currency === 'USD' && displayValue >= 10 ? 0 : 1 }
    : { maximumFractionDigits: 0 };
  return displayValue.toLocaleString('en-US', options) + ' ' + unit();
}

const numberText = (value, digits) =>
  value.toLocaleString('en-US', { maximumFractionDigits: digits });

function batchIndexForKg(batchKg) {
  const exactIndex = BATCH_OPTIONS_KG.indexOf(batchKg);
  if (exactIndex >= 0) return exactIndex;
  return BATCH_OPTIONS_KG.reduce((bestIndex, option, index) =>
    Math.abs(option - batchKg) < Math.abs(BATCH_OPTIONS_KG[bestIndex] - batchKg) ? index : bestIndex, 0);
}

const maxWeeklyKgForBatch = batchKg =>
  batchKg * TYPHOON_BATCHES_H * WORK_HOURS_DAY * WORK_DAYS_WEEK;
const maxMonthlyKgForBatch = batchKg =>
  maxWeeklyKgForBatch(batchKg) * WEEKS_PER_MONTH;
const roundedDownToStep = (value, step) => Math.floor(value / step) * step;

function monthlySliderSettings(batchKg) {
  const monthlyStep = state.currency === 'USD' ? 500 : 250;
  const monthlyMin = state.currency === 'USD' ? 1000 : 500;
  const monthlyMax = Math.max(
    monthlyMin,
    roundedDownToStep(kgToDisplay(maxMonthlyKgForBatch(batchKg)), monthlyStep));
  return { monthlyMin, monthlyMax, monthlyStep };
}

function monthlySliderPercent() {
  const settings = monthlySliderSettings(state.batchKg);
  const minKg = displayToKg(settings.monthlyMin);
  const maxKg = displayToKg(settings.monthlyMax);
  if (maxKg <= minKg) return 0;
  return Math.max(0, Math.min(1, (state.monthlyKg - minKg) / (maxKg - minKg)));
}

function syncSliderRanges(monthlyPercent) {
  const batchRange = $('batchRange');
  const monthlyRange = $('monthlyRange');
  const currentUnit = unit();

  const batchIndex = batchIndexForKg(state.batchKg);
  state.batchKg = BATCH_OPTIONS_KG[batchIndex];
  batchRange.min = 0;
  batchRange.max = BATCH_OPTIONS_KG.length - 1;
  batchRange.step = 1;
  batchRange.value = batchIndex;

  const settings = monthlySliderSettings(state.batchKg);
  monthlyRange.min = settings.monthlyMin;
  monthlyRange.max = settings.monthlyMax;
  monthlyRange.step = settings.monthlyStep;

  const minKg = displayToKg(settings.monthlyMin);
  const maxKg = displayToKg(settings.monthlyMax);
  if (typeof monthlyPercent === 'number') {
    state.monthlyKg = minKg + Math.max(0, Math.min(1, monthlyPercent)) * (maxKg - minKg);
  } else {
    state.monthlyKg = Math.min(Math.max(state.monthlyKg, minKg), maxKg);
  }

  monthlyRange.value =
    Math.round(kgToDisplay(state.monthlyKg) / settings.monthlyStep) * settings.monthlyStep;
  state.monthlyKg = displayToKg(parseFloat(monthlyRange.value));

  $('monthlyUnitLabel').textContent = currentUnit;
  $('batchTicks').innerHTML = BATCH_OPTIONS_KG.map((batchKg, index) => {
    const activeClass = index === batchIndex ? ' class="active"' : '';
    return '<span' + activeClass + '>' + massText(batchKg, 'batch') + '</span>';
  }).join('');
  $('monthlyMin').textContent = numberText(parseFloat(monthlyRange.min), 0) + ' ' + currentUnit;
  $('monthlyMax').textContent = numberText(parseFloat(monthlyRange.max), 0) + ' ' + currentUnit;
  setRangeProgress(batchRange);
  setRangeProgress(monthlyRange);
}

function setRangeProgress(input) {
  const min = parseFloat(input.min);
  const max = parseFloat(input.max);
  const value = parseFloat(input.value);
  const pct = ((value - min) / (max - min)) * 100;
  input.style.setProperty('--progress', Math.max(0, Math.min(100, pct)) + '%');
}

function barWidth(value, scale) {
  if (!isFinite(value) || !isFinite(scale) || scale <= 0) return '0%';
  return Math.max(0, Math.min(100, (value / scale) * 100)) + '%';
}

function recalc() {
  const costs = COST_DEFAULTS[state.currency];
  const batchKg = Math.max(state.batchKg, 0.1);
  const maxMonthlyKg = maxMonthlyKgForBatch(batchKg);
  state.monthlyKg = Math.min(Math.max(state.monthlyKg, 0), maxMonthlyKg);
  const monthlyKg = state.monthlyKg;
  const weeklyKg = monthlyKg / WEEKS_PER_MONTH;
  const monthlyRange = $('monthlyRange');
  const monthlyStep = parseFloat(monthlyRange.step) || 1;
  const monthlyMin = parseFloat(monthlyRange.min) || 0;
  const monthlyMax = parseFloat(monthlyRange.max) || kgToDisplay(monthlyKg);
  monthlyRange.value = Math.min(monthlyMax,
    Math.max(monthlyMin, Math.round(kgToDisplay(monthlyKg) / monthlyStep) * monthlyStep));

  const typhoonKgPerHour = TYPHOON_BATCHES_H * batchKg;
  const drumKgPerHour = DRUM_BATCHES_H * batchKg * DRUM_LOAD;
  const greenCostPerKg = state.currency === 'USD' ? costs.green * KG_TO_LB : costs.green;

  const typhoonHoursMonth = monthlyKg / typhoonKgPerHour;
  const drumHoursMonth = monthlyKg / drumKgPerHour;
  const savedHoursMonth = drumHoursMonth - typhoonHoursMonth;
  const equivalentDrumBatchKg =
    weeklyKg / (DRUM_BATCHES_H * DRUM_LOAD * WORK_HOURS_DAY * WORK_DAYS_WEEK);
  const sameSizeDrumCount = weeklyKg / (drumKgPerHour * WORK_HOURS_DAY * WORK_DAYS_WEEK);

  const laborMonth = savedHoursMonth * costs.labor;
  const energyMonth = monthlyKg * (DRUM_ENERGY_KG - TYPHOON_ENERGY_KG) * costs.energy;
  const defectMonth = monthlyKg * (DRUM_DEFECT - TYPHOON_DEFECT) * greenCostPerKg;
  const totalMonth = laborMonth + energyMonth + defectMonth;

  const maxTyphoonHoursMonth = maxMonthlyKg / typhoonKgPerHour;
  const maxDrumHoursMonth = maxMonthlyKg / drumKgPerHour;
  const maxLaborMonth = (maxDrumHoursMonth - maxTyphoonHoursMonth) * costs.labor;
  const maxEnergyMonth = maxMonthlyKg * (DRUM_ENERGY_KG - TYPHOON_ENERGY_KG) * costs.energy;
  const maxDefectMonth = maxMonthlyKg * (DRUM_DEFECT - TYPHOON_DEFECT) * greenCostPerKg;
  const breakdownScale = Math.max(maxLaborMonth, maxEnergyMonth, maxDefectMonth, 1);

  $('headlineSavings').textContent = money(totalMonth) + '/month';
  $('monthlySavings').textContent = money(totalMonth);
  $('batchValue').textContent = massText(batchKg, 'batch');
  $('monthlyValue').textContent = massText(monthlyKg, 'monthly');

  $('valLabor').textContent = money(laborMonth);
  $('valEnergy').textContent = money(energyMonth);
  $('valDefect').textContent = money(defectMonth);
  $('barLabor').style.width = barWidth(laborMonth, breakdownScale);
  $('barEnergy').style.width = barWidth(energyMonth, breakdownScale);
  $('barDefect').style.width = barWidth(defectMonth, breakdownScale);

  updateCalculationDetails(monthlyKg, weeklyKg, maxMonthlyKg, typhoonHoursMonth,
    drumHoursMonth, savedHoursMonth, equivalentDrumBatchKg, sameSizeDrumCount,
    laborMonth, energyMonth, defectMonth, totalMonth);
  setRangeProgress($('batchRange'));
  setRangeProgress($('monthlyRange'));
}

function updateCalculationDetails(monthlyKg, weeklyKg, maxMonthlyKg, typhoonHoursMonth,
  drumHoursMonth, savedHoursMonth, equivalentDrumBatchKg, sameSizeDrumCount,
  laborMonth, energyMonth, defectMonth, totalMonth) {

  const costs = COST_DEFAULTS[state.currency];
  const greenUnit = state.currency === 'USD' ? 'lb' : 'kg';
  const greenCostPerKg = state.currency === 'USD' ? costs.green * KG_TO_LB : costs.green;

  $('calcIntro').textContent =
    'Current setup: ' + massText(state.batchKg, 'batch') + ' Typhoon and ' +
    massText(monthlyKg, 'monthly') + '/month. Max for this Typhoon in one 40-hour week: ' +
    massText(maxMonthlyKg, 'monthly') + '/month.';
  $('volumeFormula').textContent =
    massText(monthlyKg, 'monthly') + '/month = ' + massText(weeklyKg, 'weekly') + '/week';
  $('drumSetupFormula').textContent =
    'To match this output on Drum in a 40-hour week: about ' +
    numberText(sameSizeDrumCount, 1) + ' same-size drum roasters, or one ~' +
    massText(equivalentDrumBatchKg, 'batch') + ' drum.';
  $('laborFormula').textContent =
    'Typhoon ' + numberText(typhoonHoursMonth, 1) + ' h/month vs same-size Drum ' +
    numberText(drumHoursMonth, 1) + ' h/month = ' + numberText(savedHoursMonth, 1) +
    ' saved hours × ' + costMoney(costs.labor) + '/hour = ' + money(laborMonth);
  $('energyFormula').textContent =
    numberText(monthlyKg, 0) + ' kg/month × 0.45 kWh/kg × ' +
    costMoney(costs.energy) + '/kWh = ' + money(energyMonth);
  $('defectFormula').textContent =
    numberText(monthlyKg, 0) + ' kg/month × 5% × ' +
    costMoney(greenCostPerKg) + '/kg = ' + money(defectMonth);
  $('defaultCostList').innerHTML =
    '<li>Electricity: ' + costMoney(costs.energy) + '/kWh</li>' +
    '<li>Labour: ' + costMoney(costs.labor) + '/hour</li>' +
    '<li>Green coffee: ' + costMoney(costs.green) + '/' + greenUnit + '</li>' +
    '<li>Total current saving: ' + money(totalMonth) + '/month</li>';
}

/* --- wiring ------------------------------------------------------------- */

const modal = $('calcModal');
const openCalc  = () => { modal.classList.add('open');    modal.setAttribute('aria-hidden', 'false'); };
const closeCalc = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); };

$('eurBtn').addEventListener('click', () => setCurrency('EUR'));
$('usdBtn').addEventListener('click', () => setCurrency('USD'));
$('batchRange').addEventListener('input', e => setBatchFromSlider(e.target.value));
$('monthlyRange').addEventListener('input', e => setMonthlyFromSlider(e.target.value));
$('calcOpen').addEventListener('click', openCalc);
$('calcClose').addEventListener('click', closeCalc);
modal.addEventListener('click', e => { if (e.target === modal) closeCalc(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeCalc(); });

syncSliderRanges();
recalc();
