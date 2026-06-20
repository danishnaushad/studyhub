const currentDate = new Date(2026, 5, 18); // June 18, 2026
const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

console.log('daysInMonth:', daysInMonth);
console.log('firstDayOfMonth:', firstDayOfMonth);

const days = [];
for (let i = 0; i < firstDayOfMonth; i++) {
  days.push(`empty-${i}`);
}
for (let i = 1; i <= daysInMonth; i++) {
  days.push(`day-${i}`);
}

console.log('Total days array length:', days.length);
console.log('Expected rows:', Math.ceil(days.length / 7));

// check if there's anything wrong with getDayString
const year = currentDate.getFullYear();
const getDayString = (day: number) => {
  const d = new Date(year, currentDate.getMonth(), day);
  const tzOffset = d.getTimezoneOffset() * 60000;
  return (new Date(d.getTime() - tzOffset)).toISOString().split('T')[0];
};

try {
  console.log('getDayString(30):', getDayString(30));
} catch (e) {
  console.error('getDayString error:', e);
}
