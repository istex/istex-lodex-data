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
  var examplesPopup = document.getElementById("popupExamples");
  var examplesDiv = document.getElementById("examples"); 
  fetch("/triplestore/sparql/examples.json").then(function(response){
    response.json().then(function(jsonData){
      jsonData.forEach((jsonElement) => {
        //creation du html correspondant
        var li = document.createElement("li");
        li.classList.add("exampleItem");
        li.setAttribute('title', 'Cliquez pour voir cet exemple');
        li.appendChild(document.createTextNode(jsonElement.title));
        
        //evenement de click sur chaque exemple
        li.addEventListener('click', function(){
          var newTab = yasgui.addTab();
          newTab.yasqe.setValue(jsonElement.content);
          hidePopup(examplesPopup);
        });
        
        //ajout des exemples dans le DOM
        examplesDiv.appendChild(li);
      });
    });
  });

  //interraction avec la pop-up
  document.querySelectorAll('.closePopup').forEach((e) => {
    e.addEventListener('click', function(){
      hidePopup(e.closest('.popupContainer'));
    })
  });

  //affichage des exemples lors du click sur le bouton "voir des exemples"
  document.getElementById("showExamples").addEventListener('click', function(){ 
    if(examplesPopup.classList.contains("showPopup")){
      hidePopup(examplesPopup);
    }else{
      showPopup(examplesPopup);
    }
  });
  
}, 1000);

function showPopup(popup){
  popup.classList.remove('hidePopup');
  popup.classList.add('showPopup');
}

function hidePopup(popup){
  popup.classList.remove('showPopup');
  popup.classList.add('hidePopup');
}
