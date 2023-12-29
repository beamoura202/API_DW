var req = new XMLHttpRequest();
var url = "https://api.nasa.gov/planetary/apod?api_key=";
var api_key = "uchmIemEXq0Q0VhKvfIbdBd0yoLYDfCoTWmtBF4K";
var articles = [];

window.addEventListener("DOMContentLoaded", function () {
    //ainda nao funciona
    displayInitialMessage();

    // faz Fetch das 5 imagens assim que a pagina é loaded
    fetchLastFiveImages();

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
//apresenta inicialmente as 5 ultimas imagens da API
function fetchLastFiveImages() {
    const today = new Date();
    const dates = [];

    for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        dates.push(formatDate(date));
    }
    fetchArticlesWithDates(dates);
}

function formatDate(date) {
    return date.toISOString().split('T')[0];// Output: 'YYYY-MM-DD' formato ISO 8601
}
//ainda n funciona
function displayInitialMessage() {
    var articleContainer = document.getElementById("article-container");
    if (articleContainer) {
        var header = document.createElement('h1');
        header.textContent = "Últimas 5 fotos";
        articleContainer.appendChild(header);
    } else {
        console.error("Article container not found");
    }
}

function fetchArticlesWithDates(dates) {
    articles = [];
    dates.forEach((date) => {
        let apiUrl = url + api_key + `&date=${date}`;
        req.open("GET", apiUrl, false); //Solicitação síncrona
        req.send();

        req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status === 200) {
                var response = JSON.parse(req.responseText);
                articles.push(response);
                updatePage(); //Atualize a página com cada nova imagem
            }
        };
    });
}

//Filtragem 5,10,15,20, das imagens de forma random
function displayRandomImages(number) {
    const shuffledArticles = articles.sort(() => 0.5 - Math.random()); // sort 
    const selectedArticles = shuffledArticles.slice(0, number); // seleciona um numero especifico pedido, 

    const articleContainer = document.getElementById("article-container");
    articleContainer.innerHTML = ""; // Limpa o conteudo existente

    selectedArticles.forEach((article, index) => {
        const articleDiv = document.createElement("div");

        // Adiciona a classe base e depois de acordo se é par ou impar adiciona as respetovas classes
        articleDiv.classList.add("articleBase");
        articleDiv.classList.add(index % 2 === 0 ? "articlePar" : "articleImpar");


        articleDiv.innerHTML = `
                <div class="imagem">
                    <img src="${article.hdurl}" alt="${article.title}" width="100%">
                </div>
                
                <div class="${index % 2 === 0 ? 'textoArticBase textoArticPar' : 'textoArticBase textoArticImpar'}">
                    <h2>${article.title}</h2>
                    <h3>Date: <span>${article.date}</span></h3>
                    <p>${article.explanation}</p>
                </div>
                
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
            return; // para se a data final for menor que a inicial
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
                        //ordena asc ou des
                        sortArticles(sortOrder);
                    }
                    updatePage();
                } else {
                    console.error('Invalid API response: Expected an array');
                }
            }
        });
    } else {
        displayError('Please provide both start and end dates.');
    }
}
//ordena asc ou des
function sortArticles(sortOrder) {
    articles.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === "ASC" ? dateA - dateB : dateB - dateA;
    });
}

//enviar a info de cada artigo para o html
function updatePage() {
    const articleContainer = document.getElementById("article-container");
    articleContainer.innerHTML = "";


    articles.forEach((article, index) => {
        const articleDiv = document.createElement("div");

        // Adiciona a classe base e depois de acordo se é par ou impar adiciona as respetovas classes
        articleDiv.classList.add("articleBase");
        articleDiv.classList.add(index % 2 === 0 ? "articlePar" : "articleImpar");

        articleDiv.innerHTML = `
                <div class="imagem">
                    <img src="${article.hdurl}" alt="${article.title}" width="100%">
                </div>
                <div class="${index % 2 === 0 ? 'textoArticBase textoArticPar' : 'textoArticBase textoArticImpar'}">
                    <h2>${article.title}</h2>
                    <h3>Date: <span>${article.date}</span></h3>
                    <p>${article.explanation}</p>
                </div>
            `;
        articleContainer.appendChild(articleDiv);
    });

}
//erros
function displayError(message) {
    const articleContainer = document.getElementById("article-container");
    articleContainer.innerHTML = `<p class="error-message">${message}</p>`;
}



//abre e fecha a navegação
document.addEventListener('DOMContentLoaded', function () {
    const navigation = document.querySelector('.navegação');
    const toggleButton = document.getElementById('toggleButton');

    toggleButton.addEventListener('click', function () {
        navigation.classList.toggle('open');
    });
});