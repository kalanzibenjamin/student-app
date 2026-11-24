const form = document.querySelector('#signup-form');

if (form) {
  const input = form.querySelector('#registration-number');
  const message = document.querySelector('#signup-message');
  const submit = form.querySelector('button[type="submit"]');
  const directoryUrl = form.dataset.directoryUrl || '/data/student-directory.json';
  let studentDirectoryPromise;

  function normalizeRegistrationNumber(value) {
    return value
      .trim()
      .toUpperCase()
      .replace(/[∕／]/g, '/')
      .replace(/\s*\/\s*/g, '/')
      .replace(/\s+/g, '');
  }

  async function loadStudentDirectory() {
    if (!studentDirectoryPromise) {
      studentDirectoryPromise = fetch(directoryUrl, {
        headers: { Accept: 'application/json' },
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`Student directory unavailable: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Student directory must be a JSON array.');
        }

        return data;
      });
    }

    return studentDirectoryPromise;
  }

  function findStudent(students, registrationNumber, studentEmail) {
    return students.find((student) => {
      const studentRegistration = normalizeRegistrationNumber(student.registrationNumber || '');
      const studentEmailValue = String(student.email || '').trim().toLowerCase();

      return studentRegistration === registrationNumber
        || studentEmailValue === studentEmail.toLowerCase();
    });
  }

  function deriveStudentEmail(registrationNumber) {
    const match = /^(\d{2})\/[A-Z0-9]+\/[A-Z0-9]+\/(\d{5})\/[A-Z0-9]+$/i.exec(registrationNumber);

    if (!match) return null;

    const [, year, studentNumber] = match;
    return `${year}008${studentNumber}@std.kyu.ac.ug`;
  }

  function showMessage(text, type = 'info') {
    message.textContent = text;
    message.dataset.type = type;
  }

  function setLoading(isLoading) {
    submit.disabled = isLoading;
    submit.innerHTML = isLoading
      ? '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i><span>Checking</span>'
      : '<i class="fas fa-arrow-right" aria-hidden="true"></i><span>Continue</span>';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const registrationNumber = normalizeRegistrationNumber(input.value);

    input.value = registrationNumber;
    input.setAttribute('aria-invalid', 'false');

    if (!input.checkValidity()) {
      input.setAttribute('aria-invalid', 'true');
      showMessage('Enter a valid registration number, for example 24/U/EEE/05433/PE.', 'error');
      input.focus();
      return;
    }

    const studentEmail = deriveStudentEmail(registrationNumber);

    if (!studentEmail) {
      showMessage('This registration number could not be parsed.', 'error');
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }

    setLoading(true);
    showMessage('Checking the student directory...');

    try {
      const students = await loadStudentDirectory();
      const student = findStudent(students, registrationNumber, studentEmail);

      if (!student?.name) {
        showMessage('No student record was found for this registration number.', 'error');
        return;
      }

      showMessage(
        `Hello ${student.name}. Identity verification is available through ${studentEmail}.`,
        'success',
      );
      localStorage.setItem('clareon-current-student', JSON.stringify({
        name: student.name,
        registrationNumber,
        email: student.email || studentEmail,
      }));
      input.disabled = true;
      submit.hidden = true;
    } catch (error) {
      showMessage('The student directory is unavailable. Please try again later.', 'error');
      console.error(error);
    } finally {
      if (!submit.hidden) setLoading(false);
    }
  });
}
