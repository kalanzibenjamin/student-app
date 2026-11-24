const attendancePage = document.querySelector('[data-page="student-attendance"]');

if (attendancePage) {
  const units = [...attendancePage.querySelectorAll('.attendance-unit')];

  units.forEach((unit) => {
    unit.setAttribute('tabindex', '0');
    unit.setAttribute('role', 'button');
    unit.setAttribute('aria-label', `View attendance details for ${unit.querySelector('h2').textContent}`);

    const showDetails = () => {
      const code = encodeURIComponent(unit.dataset.unitCode);
      const name = encodeURIComponent(unit.dataset.unitName);
      window.location.href = `/pages/attendance/detail/?code=${code}&name=${name}`;
    };

    unit.addEventListener('click', showDetails);
    unit.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showDetails();
      }
    });
  });
}
