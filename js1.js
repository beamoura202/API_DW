var req = new XMLHttpRequest();
var url = "https://api.nasa.gov/planetary/apod?api_key=";
var api_key = "uchmIemEXq0Q0VhKvfIbdBd0yoLYDfCoTWmtBF4K";
var articles = [];

window.addEventListener("DOMContentLoaded", function () {

//botoes de filtragem
//5imagens random
    document.getElementById('5img').addEventListener('click', function () {
        displayRandomImages(5);
    });
//10imagens random
    document.getElementById('10img').addEventListener('click', function () {
        displayRandomImages(10);
    });
//15imagens random
    document.getElementById('15img').addEventListener('click', function () {
        displayRandomImages(15);
    });
//20imagens random
    document.getElementById('20img').addEventListener('click', function () {
        displayRandomImages(20);

    });


//formulario data
    document.getElementById('formula').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const start_date = formData.get('start-date');
        const end_date = formData.get('end-date');
        fetchArticlesWithOrder(start_date, end_date);
    });
//filtragem por asc e desc
    document.getElementById('asc-button').addEventListener('click', function (event) {
        event.preventDefault();
        sortArticles('ASC');
        updatePage();
    });

    document.getElementById('desc-button').addEventListener('click', function (event) {
        event.preventDefault();
        sortArticles('DESC');
        updatePage();
    });
});

//Filtragem 5,10,15,20, das imagens de forma random
function displayRandomImages(number) {
    const shuffledArticles = articles.sort(() => 0.5 - Math.random()); // Shuffle the array
    const selectedArticles = shuffledArticles.slice(0, number); // Select the specified number of images

    const articleContainer = document.getElementById("article-container");
    articleContainer.innerHTML = ""; // Clear existing content

    selectedArticles.forEach((article) => {
        const articleDiv = document.createElement("div");
        articleDiv.innerHTML = 
        
            `<article class="article">
                
            <div class="imagem">
                <img src="${article.hdurl}" alt="${article.title}" width="100%">
            </div>
            
            <div class="textoArtic">
                <h2>${article.title}</h2>
                <h3>Date: <span>${article.date}</span></h3>
                <p>${article.explanation}</p>
            </div>

        </article>
            
            
            
            `;
        articleContainer.appendChild(articleDiv);
    });
}


//ordenar
function fetchArticlesWithOrder(start_date, end_date, sortOrder) {
    if (start_date && end_date) {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (startDate > endDate) {
            displayError('Start date must be before end date.');
            return; // Stop the function if dates are invalid
        }

        let apiUrl = url + api_key + `&start_date=${start_date}&end_date=${end_date}`;
        console.log("API URL:", apiUrl);

        req.open("GET", apiUrl);
        req.send();

        req.addEventListener("load", function () {
            if (req.status === 200 && req.readyState === 4) {
                var response = JSON.parse(req.responseText);
                console.log("API Response:", response);

                if (Array.isArray(response)) {
                    articles = response;
                    if (sortOrder) {
                        sortArticles(sortOrder);
                    }
                    updatePage();
                } else {
                    console.error('Invalid API response: Expected an array');
                }
            } else {
                console.error('API Request Failed:', req.status, req.statusText);
            }
        });
    } else {
        displayError('Please provide both start and end dates.');
    }
}

function sortArticles(sortOrder) {
    articles.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === "ASC" ? dateA - dateB : dateB - dateA;
    });
}

//enviar a info para os artigos
function updatePage() {
    const articleContainer = document.getElementById("article-container");
    articleContainer.innerHTML = "";

    if (Array.isArray(articles) && articles.length > 0) {
        articles.forEach((article) => {
            const articleDiv = document.createElement("div");
            articleDiv.innerHTML = 
            `<article class="article">
                
                <div class="imagem">
                    <img src="${article.hdurl}" alt="${article.title}" width="100%">
                </div>
                
                <div class="textoArtic">
                    <h2>${article.title}</h2>
                    <h3>Date: <span>${article.date}</span></h3>
                    <p>${article.explanation}</p>
                </div>

            </article>
                
                
                
                `;


            articleContainer.appendChild(articleDiv);
        });
    } else {
        console.error('Empty or invalid API response.');
    }
}
//erros
function displayError(message) {
    const articleContainer = document.getElementById("article-container");
    articleContainer.innerHTML = `<p class="error-message">${message}</p>`;
}