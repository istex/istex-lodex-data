setTimeout(function(){
  YASGUI.YASQE.defaults.value = `SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`;
  var options = {
    catalogueEndpoints: [
      { endpoint: "https://data.istex.fr/sparql/", title: "ISTEX" },
      { endpoint: "http://data.persee.fr/sparql/", title: "Persée" },
      { endpoint: "https://lod.abes.fr/sparql", title: "ABES" },
      { endpoint: "http://www.rechercheisidore.fr/sparql", title: "ISIDORE" },
      {
        endpoint: "http://sparql.archives-ouvertes.fr/sparql",
        title: "HAL Archives Ouvertes"
      },
      { endpoint: "http://lod.springer.com/sparql", title: "Springer" },
      {
        endpoint: "https://www.europeandataportal.eu/sparql",
        title: "Portail européen de données"
      },
      { endpoint: "https://data.idref.fr/sparql", title: "IdRef" }
    ]
  };
  YASGUI.defaults.catalogueEndpoints = options.catalogueEndpoints;
  YASGUI.defaults.yasqe.sparql.endpoint = "https://data.istex.fr/sparql/";
  var yasgui = YASGUI(document.getElementById("YASGUI"), options);

  //chargement des exemples depuis le fichier json
  var examplesDiv = document.getElementById("examples"); 
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var examplesJson = JSON.parse(this.responseText);
      examplesJson.forEach((elem) => {
        //creation du html correspondant
        var li = document.createElement("li");
        li.classList.add("itemExample");
        li.appendChild(document.createTextNode(elem.title));
        examplesDiv.appendChild(li);
      });
    }
  }
  xmlhttp.open("GET", "/triplestore/sparql/examples.json", true);
  xmlhttp.send();

  //affichage des exemples lors du click sur le bouton "voir des exemples"
  document.getElementById("showExamples").addEventListener('click', function(){ 
    if(examplesDiv.classList.contains("showExamples")){
      examplesDiv.classList.remove('showExamples');
      examplesDiv.classList.add('hideExamples');
    }else{
      examplesDiv.classList.remove('hideExamples');
      examplesDiv.classList.add('showExamples');
    }
  });
  
}, 1000);