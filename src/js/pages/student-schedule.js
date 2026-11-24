const schedulePage = document.querySelector('[data-page="student-schedule"]');

if (schedulePage) {
  const weekLabel = schedulePage.querySelector('[data-week-label]');
  const currentTime = schedulePage.querySelector('[data-current-time]');
  const dayButtons = [...schedulePage.querySelectorAll('[data-day]')];
  const scheduleColumns = [...schedulePage.querySelectorAll('[data-schedule-day]')];
  let weekOffset = 0;
  let activeDay = 0;

  const baseMonday = new Date(2026, 10, 23);

  function updateCurrentTime() {
    if (!currentTime) return;

    const now = new Date();
    currentTime.dateTime = now.toISOString();
    currentTime.textContent = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  function formatWeek(offset) {
    const monday = new Date(baseMonday);
    monday.setDate(monday.getDate() + offset * 7);
    const friday = new Date(monday);
    friday.setDate(friday.getDate() + 4);

    const start = monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = friday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${start} - ${end}`;
  }

  function updateWeek() {
    weekLabel.textContent = formatWeek(weekOffset);

    const monday = new Date(baseMonday);
    monday.setDate(monday.getDate() + weekOffset * 7);

    dayButtons.forEach((button, index) => {
      const date = new Date(monday);
      date.setDate(date.getDate() + index);
      button.querySelector('strong').textContent = String(date.getDate()).padStart(2, '0');
    });

    scheduleColumns.forEach((column, index) => {
      column.querySelector('header strong').textContent =
        String(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index).getDate()).padStart(2, '0');
    });
  }

  function setActiveDay(index) {
    activeDay = index;
    dayButtons.forEach((button, buttonIndex) => {
      button.classList.toggle('is-active', buttonIndex === index);
      button.setAttribute('aria-pressed', String(buttonIndex === index));
    });
    scheduleColumns.forEach((column, columnIndex) => {
      column.classList.toggle('is-active', columnIndex === index);
    });
  }

  dayButtons.forEach((button) => {
    button.addEventListener('click', () => setActiveDay(Number(button.dataset.day)));
  });

  schedulePage.querySelectorAll('[data-week-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.weekAction;
      if (action === 'previous') weekOffset -= 1;
      if (action === 'next') weekOffset += 1;
      if (action === 'today') weekOffset = 0;
      updateWeek();
    });
  });

  setActiveDay(activeDay);
  updateWeek();
  updateCurrentTime();
  window.setInterval(updateCurrentTime, 1000);
}
