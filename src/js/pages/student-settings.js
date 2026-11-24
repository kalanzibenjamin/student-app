import { getTheme, setTheme } from '../components/theme.js';

const settingsPage = document.querySelector('[data-page="student-settings"]');

if (settingsPage) {
  const themeChoices = [...settingsPage.querySelectorAll('[data-theme-choice]')];
  const languageSelect = settingsPage.querySelector('[data-setting-language]');
  const attendanceNotifications = settingsPage.querySelector('[data-setting-attendance-notifications]');
  const assignmentReminders = settingsPage.querySelector('[data-setting-assignment-reminders]');
  const locationToggle = settingsPage.querySelector('[data-location-toggle]');

  function updateThemeChoices() {
    let storedTheme = localStorage.getItem('clareon-theme');
    if (!storedTheme) storedTheme = 'system';

    themeChoices.forEach((choice) => {
      const selected = choice.dataset.themeChoice === storedTheme;
      choice.classList.toggle('is-active', selected);
      choice.setAttribute('aria-checked', String(selected));
    });
  }

  themeChoices.forEach((choice) => {
    choice.addEventListener('click', () => {
      setTheme(choice.dataset.themeChoice);
      updateThemeChoices();
    });
  });

  const savedLanguage = localStorage.getItem('clareon-language') || 'en';
  if (languageSelect) {
    languageSelect.value = savedLanguage;
    languageSelect.addEventListener('change', () => {
      localStorage.setItem('clareon-language', languageSelect.value);
    });
  }

  attendanceNotifications.checked =
    localStorage.getItem('clareon-attendance-notifications') !== 'false';
  assignmentReminders.checked =
    localStorage.getItem('clareon-assignment-reminders') !== 'false';

  attendanceNotifications.addEventListener('change', () => {
    localStorage.setItem(
      'clareon-attendance-notifications',
      String(attendanceNotifications.checked),
    );
  });

  assignmentReminders.addEventListener('change', () => {
    localStorage.setItem(
      'clareon-assignment-reminders',
      String(assignmentReminders.checked),
    );
  });

  async function requestLocation() {
    if (!navigator.geolocation) {
      locationToggle.querySelector('span').textContent = 'Unavailable';
      locationToggle.disabled = true;
      return;
    }

    locationToggle.disabled = true;
    locationToggle.querySelector('span').textContent = 'Requesting';

    navigator.geolocation.getCurrentPosition(
      () => {
        localStorage.setItem('clareon-location-enabled', 'true');
        locationToggle.querySelector('span').textContent = 'Enabled';
        locationToggle.classList.add('is-active');
      },
      () => {
        localStorage.setItem('clareon-location-enabled', 'false');
        locationToggle.querySelector('span').textContent = 'Enable';
        locationToggle.classList.remove('is-active');
        locationToggle.disabled = false;
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }

  if (localStorage.getItem('clareon-location-enabled') === 'true') {
    locationToggle.querySelector('span').textContent = 'Enabled';
    locationToggle.classList.add('is-active');
  }

  locationToggle.addEventListener('click', requestLocation);
  updateThemeChoices();
  getTheme();
}
