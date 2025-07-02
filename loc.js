document.getElementById('repoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const repoInput = document.getElementById('repoInput').value;
    console.log('Form submitted with value:', repoInput);

    sendtoAPI(repoInput);
});

function sendtoAPI(value) {
    document.getElementById('status').style.display = 'block';
    document.getElementById('status').innerText = 'Fetching repository...';
    fetchData(value);
}
async function fetchData(value) {
  try {
    const response = await fetch(`https://api.codetabs.com/v1/loc/?github=${value}`);
    if (!response.ok) {
      throw new Error('Invalid user/repo format or repository/user not found.');
    }
    const data = await response.json();
    console.log(data);
    document.getElementById('status').style.display = 'none';
    getBadge(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('status').style.display = 'block';
    document.getElementById('status').innerText =error.message;
  }
}

function getBadge(data1) {
    const badgeContainer = document.getElementById('badgeContainer');
    const allBadges = document.getElementById('allBadges');
    const badgeStyle = document.getElementById('style').value;
    const color = document.getElementById('color').value;

    badgeContainer.style.display = 'block';
    allBadges.innerHTML = '';

    const badgeUrlInput = document.getElementById('badgeUrl');


    const createBadge = (label, count) => {
        const badgeURL = `https://img.shields.io/badge/${encodeURIComponent(label)}-${count}-blue?style=${badgeStyle}&color=${color}`;
        const markdown = `[![${label} LOC](${badgeURL})](https://lineup-github.vercel.app)`;

        const badge = document.createElement('img');
        badge.src = badgeURL;
        badge.alt = `${label} LOC`;
        badge.style.cursor = 'pointer';
        badge.style.margin = '5px';

        badge.onclick = () => {
            badgeUrlInput.value = markdown;
        };

        allBadges.appendChild(badge);

        return markdown;
    };


    const totalEntry = data1.find(entry => entry.language.toLowerCase() === "total");
    if (totalEntry) {
        const totalMarkdown = createBadge('Total', totalEntry.linesOfCode);
        
        badgeUrlInput.value = totalMarkdown;
    }

    
    data1.forEach(entry => {
        if (entry.language.toLowerCase() === "total") return;
        createBadge(entry.language, entry.linesOfCode);
    });
}
function parseData(data, includeTotal = True) {
  const result = {};

  data.forEach(entry => {
    if (!includeTotal && entry.language.toLowerCase() === "total") return;
    result[entry.language] = entry.linesOfCode;
  });

  return result;
}