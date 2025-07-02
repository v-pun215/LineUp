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
    const badge = document.getElementById('badge');
    const badgeContainer = document.getElementById('badgeContainer');
    const badgeStyle = document.getElementById('style').value;
    const color = document.getElementById('color').value;
    badge.style.display = 'block';
    badgeContainer.style.display = 'block';

    //data = parseData(data, true);
    console.log(data1); 
    

    const totalEntry = data1.find(entry => entry.language.toLowerCase() === "total");

    //alert(`Total lines of code: ${totalEntry.linesOfCode}`);
    badge.innerHTML = `<img src="https://img.shields.io/badge/Lines_of_Code-${totalEntry.linesOfCode}-blue?style=${badgeStyle}&color=${color}" alt="Lines of Code">`;

    const badgeURL = document.getElementById('badgeUrl');
    badgeURL.value = `[![LineUp Badge](https://img.shields.io/badge/Lines_of_Code-${totalEntry.linesOfCode}-blue?style=${badgeStyle}](https://lineup-github.vercel.app)`
}

function parseData(data, includeTotal = True) {
  const result = {};

  data.forEach(entry => {
    if (!includeTotal && entry.language.toLowerCase() === "total") return;
    result[entry.language] = entry.linesOfCode;
  });

  return result;
}

const colorPicker = document.getElementById('color');
const colorPreview = document.querySelector('.color-preview');

colorPicker.addEventListener('input', function() {
  colorPreview.style.backgroundColor = this.value;
});

// Initial color preview update
colorPreview.style.backgroundColor = colorPicker.value;