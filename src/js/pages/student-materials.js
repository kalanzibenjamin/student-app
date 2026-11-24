const materialsPage = document.querySelector('[data-page="student-course-materials"]');

if (materialsPage) {
  const search = materialsPage.querySelector('[data-material-search]');
  const filter = materialsPage.querySelector('[data-material-filter]');
  const units = [...materialsPage.querySelectorAll('.materials-unit')];
  const resources = [...materialsPage.querySelectorAll('.materials-resource')];
  const empty = materialsPage.querySelector('[data-material-empty]');

  function applyFilters() {
    const query = search?.value.trim().toLowerCase() || '';
    const type = filter?.value || 'all';
    let visibleResources = 0;

    resources.forEach((resource) => {
      const matchesType = type === 'all' || resource.dataset.resourceType === type;
      const searchableText = `${resource.dataset.resourceName} ${resource.closest('.materials-unit').dataset.unit} ${resource.textContent}`.toLowerCase();
      const matchesQuery = !query || searchableText.includes(query);
      resource.hidden = !(matchesType && matchesQuery);
      if (!resource.hidden) visibleResources += 1;
    });

    units.forEach((unit) => {
      unit.hidden = !unit.querySelector('.materials-resource:not([hidden])');
    });

    if (empty) empty.hidden = visibleResources !== 0;
  }

  search?.addEventListener('input', applyFilters);
  filter?.addEventListener('change', applyFilters);
}
