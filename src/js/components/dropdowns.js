// ========================================
// SHARED GLASS DROPDOWNS
// ========================================

(function () {
  'use strict';

  function createDropdown(select) {
    if (select.dataset.dropdownReady === 'true' || !select.options.length) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'dropdown';
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    select.dataset.dropdownReady = 'true';
    select.classList.add('dropdown-native');

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'dropdown-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    const menu = document.createElement('div');
    menu.className = 'dropdown-menu';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;

    const options = Array.from(select.options).map((option) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'dropdown-option';
      item.textContent = option.textContent;
      item.dataset.value = option.value;
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', option.selected ? 'true' : 'false');

      item.addEventListener('click', () => {
        select.value = item.dataset.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        updateDropdown();
        closeDropdown();
      });

      menu.appendChild(item);
      return item;
    });

    wrapper.appendChild(trigger);
    wrapper.appendChild(menu);

    function updateDropdown() {
      const selected = select.options[select.selectedIndex];
      trigger.textContent = selected ? selected.textContent : '';
      options.forEach((item) => {
        const isSelected = item.dataset.value === select.value;
        item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      });
    }

    function closeDropdown() {
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      wrapper.classList.remove('is-open');
    }

    function openDropdown() {
      document.querySelectorAll('.dropdown.is-open').forEach((openWrapper) => {
        if (openWrapper !== wrapper) openWrapper.querySelector('.dropdown-trigger')?.click();
      });
      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      wrapper.classList.add('is-open');
    }

    trigger.addEventListener('click', () => {
      if (menu.hidden) openDropdown();
      else closeDropdown();
    });

    select.addEventListener('change', updateDropdown);

    updateDropdown();
  }

  document.querySelectorAll('select').forEach(createDropdown);

  document.addEventListener('click', (event) => {
    document.querySelectorAll('.dropdown.is-open').forEach((wrapper) => {
      if (!wrapper.contains(event.target)) {
        wrapper.querySelector('.dropdown-trigger')?.click();
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.querySelectorAll('.dropdown.is-open .dropdown-trigger').forEach((trigger) => trigger.click());
    }
  });
})();
