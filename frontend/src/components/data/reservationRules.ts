const reservationWeekdays: Record<number, true> = { 0: true, 3: true, 4: true, 5: true, 6: true };

export const reservationDaysLabel = 'Miércoles — Domingo';
export const reservationHoursLabel = '18:00 — 23:00';
export const reservationDurationMinutes = 90;
export const reservationMinGuests = 1;
export const reservationMaxGuestsLabel = 'capacidad de la mesa asignada';
export const reservationTimeSlots = Array.from({ length: 8 }, (_, index) => {
  const totalMinutes = 18 * 60 + index * 30;
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
});

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayInputDate() {
  return formatDateInput(new Date());
}

export function getNextReservationDate() {
  const date = new Date();
  date.setHours(12, 0, 0, 0);

  while (reservationWeekdays[date.getDay()] !== true) {
    date.setDate(date.getDate() + 1);
  }

  return formatDateInput(date);
}

export function isReservationDate(value: string) {
  if (!value) {
    return false;
  }

  const selectedDate = new Date(`${value}T12:00:00`);
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  return selectedDate >= today && reservationWeekdays[selectedDate.getDay()] === true;
}

export function isReservationStartAvailable(date: string, startTime: string) {
  if (!isReservationDate(date) || !reservationTimeSlots.includes(startTime)) {
    return false;
  }

  return new Date(`${date}T${startTime}:00`) > new Date();
}

export function getReservationEndTime(startTime: string) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const endMinutes = hours * 60 + minutes + reservationDurationMinutes;
  const endHours = Math.floor(endMinutes / 60).toString().padStart(2, '0');
  const endMinutesValue = (endMinutes % 60).toString().padStart(2, '0');
  return `${endHours}:${endMinutesValue}`;
}
