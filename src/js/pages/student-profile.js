const profilePage = document.querySelector('[data-page="student-profile"]');

if (profilePage) {
  const programmeNames = {
    EEE: 'Bachelor of Environmental Engineering and Management',
  };

  const classNames = {
    PE: 'Evening',
    PD: 'Day',
    GV: 'Day',
  };

  function normalizeRegistrationNumber(value) {
    return String(value || '')
      .trim()
      .toUpperCase()
      .replace(/[∕／]/g, '/')
      .replace(/\s*\/\s*/g, '/')
      .replace(/\s+/g, '');
  }

  function parseRegistrationNumber(registrationNumber) {
    const match = /^(\d{2})\/[A-Z0-9]+\/([A-Z0-9]+)\/(\d{5})\/([A-Z0-9]+)$/i
      .exec(normalizeRegistrationNumber(registrationNumber));

    if (!match) return null;

    const [, admissionYear, programme, sequence, classCode] = match;
    const fullYear = 2000 + Number(admissionYear);
    const studentNumber = `${admissionYear}008${sequence}`;

    return {
      registrationNumber: normalizeRegistrationNumber(registrationNumber),
      admissionYear,
      year: String(fullYear),
      programme,
      programmeFull: programmeNames[programme] || programme,
      classCode,
      className: classNames[classCode] || classCode,
      studentNumber,
      email: `${studentNumber}@std.kyu.ac.ug`,
    };
  }

  function getSavedProfile() {
    try {
      return JSON.parse(localStorage.getItem('clareon-current-student') || 'null');
    } catch {
      return null;
    }
  }

  const saved = getSavedProfile();
  const registrationNumber = normalizeRegistrationNumber(
    saved?.registrationNumber || '24/U/EEE/05433/PE',
  );
  const parsed = parseRegistrationNumber(registrationNumber);
  const name = saved?.name || 'Student';
  const email = saved?.email || parsed?.email || '';
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'S';

  profilePage.querySelectorAll('[data-profile-avatar]').forEach((element) => {
    element.textContent = initials;
  });
  profilePage.querySelectorAll('[data-profile-name]').forEach((element) => {
    element.textContent = name;
  });
  profilePage.querySelectorAll('[data-profile-registration]').forEach((element) => {
    element.textContent = parsed?.registrationNumber || registrationNumber;
  });
  profilePage.querySelectorAll('[data-profile-student-number]').forEach((element) => {
    element.textContent = parsed?.studentNumber || '--';
  });
  profilePage.querySelectorAll('[data-profile-email]').forEach((element) => {
    element.textContent = email;
  });
  profilePage.querySelectorAll('[data-profile-programme]').forEach((element) => {
    element.textContent = parsed?.programme || '--';
  });
  profilePage.querySelectorAll('[data-profile-programme-full]').forEach((element) => {
    element.textContent = parsed?.programmeFull || '--';
  });
  profilePage.querySelectorAll('[data-profile-year]').forEach((element) => {
    element.textContent = parsed?.year || '--';
  });
  profilePage.querySelectorAll('[data-profile-class]').forEach((element) => {
    element.textContent = parsed?.className || '--';
  });
}
