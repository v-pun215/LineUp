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
      throw new Error('Invalid user/repo format or repository/user not found');
    }
    const data = await response.json();
    console.log(data);
    document.getElementById('status').style.display = 'none';
    getBadge(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('status').style.display = 'none';
    alert(error.message);
  }
}

function getBadge(data1) {
    const badge = document.getElementById('badge');
    const badgeContainer = document.getElementById('badgeContainer');
    badge.style.display = 'block';
    badgeContainer.style.display = 'block';

    //data = parseData(data, true);
    console.log(data1); 
    

    const totalEntry = data1.find(entry => entry.language.toLowerCase() === "total");

    //alert(`Total lines of code: ${totalEntry.linesOfCode}`);
    badge.innerHTML = `<img src="https://img.shields.io/badge/Lines_of_Code-${totalEntry.linesOfCode}-blue" alt="Lines of Code">`;

    const badgeURL = document.getElementById('badgeUrl');
    badgeURL.value = `[![LineUp badge](https://img.shields.io/badge/Lines_of_Code-${totalEntry.linesOfCode}-blue](https://lineup-github.vercel.app)`
}

function parseData(data, includeTotal = True) {
  const result = {};

  data.forEach(entry => {
    if (!includeTotal && entry.language.toLowerCase() === "total") return;
    result[entry.language] = entry.linesOfCode;
  });

  return result;
}