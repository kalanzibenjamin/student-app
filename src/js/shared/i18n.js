const locale = document.documentElement.lang || "en";

fetch(`/i18n/${locale}.json`)
  .then((response) => {
    if (!response.ok) throw new Error(`Could not load ${locale} locale`);
    return response.json();
  })
  .then((messages) => {
    document.documentElement.dataset.messagesLoaded = "true";
    window.i18n = messages;
  })
  .catch((error) => {
    document.documentElement.dataset.messagesLoaded = "false";
    console.error("Failed to load locale messages", error);
  });
