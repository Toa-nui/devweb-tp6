
const originURL = "http://localhost:8080/";

const linkCountEl = document.getElementById('link-count');
const formEl = document.getElementById('shorten-form');
const urlInputEl = document.getElementById('url');
const resultBoxEl = document.getElementById('result-box');
const shortUrlLinkEl = document.getElementById('short-url-link');
const copyBtnEl = document.getElementById('copy-btn');
const errorBoxEl = document.getElementById('error-box');

let currentShortUrl = "";

// Récupérer le nombre de liens au chargement de la page
async function fetchLinkCount() {
  try {
    const res = await fetch(`${originURL}api-v2/`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      linkCountEl.textContent = `There are ${data.count} links`;
    }
  } catch (err) {
    console.error('Erreur lors de la récupération du nombre de liens:', err);
  }
}

// Intercepter la soumission du formulaire pour faire un appel fetch POST
formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  errorBoxEl.style.display = 'none';
  resultBoxEl.style.display = 'none';
  copyBtnEl.style.display = 'none';

  const targetUrl = urlInputEl.value;

  try {
    const res = await fetch(`${originURL}api-v2/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ url: targetUrl })
    });

    const data = await res.json();

    if (res.ok) {
      currentShortUrl = `${originURL}api-v2/${data.short_url}`;
      
      shortUrlLinkEl.innerHTML = `<a href="${currentShortUrl}" target="_blank">${currentShortUrl}</a>`;
      resultBoxEl.style.display = 'block';
      copyBtnEl.style.display = 'block';

      // Mise à jour dynamique du compteur sans rechargement
      fetchLinkCount();
    } else {
      errorBoxEl.textContent = data.error || 'Une erreur est survenue';
      errorBoxEl.style.display = 'block';
    }
  } catch (err) {
    errorBoxEl.textContent = 'Impossible de contacter le serveur';
    errorBoxEl.style.display = 'block';
  }
});

// Bouton de copie avec Clipboard API
copyBtnEl.addEventListener('click', () => {
  if (currentShortUrl) {
    navigator.clipboard.writeText(currentShortUrl)
      .then(() => {
        const originalText = copyBtnEl.textContent;
        copyBtnEl.textContent = 'Copied!';
        setTimeout(() => {
          copyBtnEl.textContent = originalText;
        }, 2000);
      })
      .catch(err => {
        console.error('Erreur de copie:', err);
      });
  }
});

fetchLinkCount();