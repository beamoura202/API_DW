
var req = new XMLHttpRequest();
var url = "https://api.nasa.gov/planetary/apod?api_key=";
var api_key = "uchmIemEXq0Q0VhKvfIbdBd0yoLYDfCoTWmtBF4K";
//var start_date= "$2017-10-10$";
//var end_date = "2023-10-10";
var date = "&start_date=2017-07-08&end_date=2017-07-10"

req.open("GET","https://api.nasa.gov/planetary/apod?api_key=uchmIemEXq0Q0VhKvfIbdBd0yoLYDfCoTWmtBF4K&date=2020-10-10");
req.send();

window.addEventListener("DOMContentLoaded",function(){

    document.getElementById('formula').addEventListener('submit', function (event) {
        event.preventDefault();  // Prevents the form from submitting the traditional way

        // Get form data
        const formData = new FormData(event.target);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        // Log or process the form data
        console.log(formDataObject.data);



        req.open("GET","https://api.nasa.gov/planetary/apod?api_key=uchmIemEXq0Q0VhKvfIbdBd0yoLYDfCoTWmtBF4K&date="+formDataObject.data);
        req.send();
    console.log("https://api.nasa.gov/planetary/apod?api_key=uchmIemEXq0Q0VhKvfIbdBd0yoLYDfCoTWmtBF4K&date="+formDataObject.data);
        req.addEventListener("load", function(){
            if(req.status == 200 && req.readyState == 4){
              var response = JSON.parse(req.responseText);
            document.getElementById("title").textContent = response.title;
            document.getElementById("date").textContent = response.date;
            document.getElementById("pic").src = response.hdurl;
            document.getElementById("explanation").textContent = response.explanation;
          }
        })
        
    });

 
    
});

req.addEventListener("load", function(){
	if(req.status == 200 && req.readyState == 4){
  	var response = JSON.parse(req.responseText);
    document.getElementById("title").textContent = response.title;
    document.getElementById("date").textContent = response.date;
    document.getElementById("pic").src = response.hdurl;
    document.getElementById("explanation").textContent = response.explanation;
  }
})
