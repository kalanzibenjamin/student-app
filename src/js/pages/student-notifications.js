const notificationsPage = document.querySelector('[data-page="student-notifications"]');

if (notificationsPage) {
  const filters = [...notificationsPage.querySelectorAll('[data-notification-filter]')];
  const items = [...notificationsPage.querySelectorAll('[data-notification-category]')];
  const empty = notificationsPage.querySelector('[data-notification-empty]');
  const markAllButton = notificationsPage.querySelector('[data-mark-all-read]');
  let activeFilter = 'all';

  function updateUnreadCount() {
    const unreadCount = items.filter((item) => item.dataset.notificationState === 'unread').length;
    document.querySelectorAll('.student-notification-count').forEach((badge) => {
      badge.dataset.count = String(unreadCount);
      badge.textContent = String(unreadCount);
      badge.hidden = unreadCount === 0;
    });
  }

  function applyFilter() {
    let visibleCount = 0;

    items.forEach((item) => {
      const matchesFilter =
        activeFilter === 'all'
        || (activeFilter === 'unread' && item.dataset.notificationState === 'unread')
        || item.dataset.notificationCategory === activeFilter;

      item.hidden = !matchesFilter;
      if (matchesFilter) visibleCount += 1;
    });

    if (empty) empty.hidden = visibleCount !== 0;
  }

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.notificationFilter;
      filters.forEach((item) => item.classList.toggle('is-active', item === button));
      applyFilter();
    });
  });

  items.forEach((item) => {
    item.querySelector('[data-mark-read]')?.addEventListener('click', () => {
      item.classList.remove('is-unread');
      item.dataset.notificationState = 'read';
      item.querySelector('[data-mark-read]')?.remove();
      updateUnreadCount();
      applyFilter();
    });
  });

  markAllButton?.addEventListener('click', () => {
    items.forEach((item) => {
      item.classList.remove('is-unread');
      item.dataset.notificationState = 'read';
      item.querySelector('[data-mark-read]')?.remove();
    });
    updateUnreadCount();
    applyFilter();
  });

  updateUnreadCount();
  applyFilter();
}
