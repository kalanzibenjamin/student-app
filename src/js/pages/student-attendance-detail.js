const detailPage = document.querySelector('[data-page="student-attendance-detail"]');

if (detailPage) {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code') || 'Course unit';
  const name = params.get('name') || 'Attendance sessions';
  const sessionList = detailPage.querySelector('[data-session-list]');
  const filterButtons = [...detailPage.querySelectorAll('[data-session-filter]')];

  detailPage.querySelectorAll('[data-detail-code]').forEach((element) => {
    element.textContent = code;
  });
  detailPage.querySelectorAll('[data-detail-name]').forEach((element) => {
    element.textContent = name;
  });
  const attendanceRates = {
    'CSN 2101': '88%',
    'SWE 2202': '75%',
    'DBS 2301': '92%',
    'OSY 2204': '73%',
  };
  const rateElement = detailPage.querySelector('[data-detail-rate]');
  if (rateElement) rateElement.textContent = attendanceRates[code] || '--';
  document.title = `${name} Attendance | Student Portal`;

  const sessions = [
    {
      status: 'attended',
      date: 'Mon, 24 Nov',
      time: '09:00 - 11:00',
      topic: 'Network layers and protocol architecture',
      lecturer: 'Dr. Sarah Nansubuga',
      venue: 'ICT Building - Room 2',
    },
    {
      status: 'attended',
      date: 'Mon, 17 Nov',
      time: '09:00 - 11:00',
      topic: 'IP addressing and subnetting',
      lecturer: 'Dr. Sarah Nansubuga',
      venue: 'ICT Building - Room 2',
    },
    {
      status: 'missed',
      date: 'Mon, 10 Nov',
      time: '09:00 - 11:00',
      topic: 'Packet switching and routing',
      lecturer: 'Dr. Sarah Nansubuga',
      venue: 'ICT Building - Room 2',
    },
  ];

  function renderSessions(filter = 'all') {
    const visibleSessions = filter === 'all'
      ? sessions
      : sessions.filter((session) => session.status === filter);

    if (!visibleSessions.length) {
      sessionList.innerHTML = '<p class="attendance-sessions-empty">No sessions match this filter.</p>';
      return;
    }

    sessionList.innerHTML = visibleSessions.map((session) => `
      <article class="attendance-session">
        <div class="attendance-session__status attendance-session__status--${session.status}">
          <i class="fas fa-${session.status === 'attended' ? 'check' : 'xmark'}" aria-hidden="true"></i>
          <span>${session.status === 'attended' ? 'Attended' : 'Missed'}</span>
        </div>
        <div class="attendance-session__main">
          <p>${session.date} · ${session.time}</p>
          <h3>${session.topic}</h3>
          <div class="attendance-session__meta">
            <span><i class="fas fa-user" aria-hidden="true"></i>${session.lecturer}</span>
            <span><i class="fas fa-location-dot" aria-hidden="true"></i>${session.venue}</span>
          </div>
        </div>
      </article>
    `).join('');
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      renderSessions(button.dataset.sessionFilter);
    });
  });

  renderSessions();
}
