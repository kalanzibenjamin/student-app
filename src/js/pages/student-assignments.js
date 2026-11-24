const assignmentsPage = document.querySelector('[data-page="student-assignments"]');

if (assignmentsPage) {
  const buttons = [...assignmentsPage.querySelectorAll('[data-assignment-filter]')];
  const assignments = [...assignmentsPage.querySelectorAll('[data-assignment-status]')];

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.assignmentFilter;
      buttons.forEach((item) => item.classList.toggle('is-active', item === button));
      assignments.forEach((assignment) => {
        assignment.hidden = selected !== 'all' && assignment.dataset.assignmentStatus !== selected;
      });
    });
  });
}
