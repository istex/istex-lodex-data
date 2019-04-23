var examplesData = `
[
  {
      "title" : "Récupérer le nombre de triplets",
      "content" : [
        "SELECT (COUNT(*) as ?nb)",
        "WHERE {",
        "  ?subject ?verb ?complement . ",
        "}"
      ],
      "description" : "Permet de connaître le nombre de triplets disponible sur le tripplestore."
  },
  {
      "title" : "Récupérer le nombre de triplets par graphe",
      "content" : [
        "SELECT ?g (COUNT(*) AS ?nb)",
        "WHERE { ",
        "  GRAPH ?g { ?subject ?verb ?complement . } ",
        "} ",
        "GROUP BY ?g ",
        "ORDER BY DESC(?nb)"
      ],
      "description" : "Retourne le nombre de triplets disponibles pour chaque graphe du triplestore."
  },
  {
      "title" : "Récupérer les triplets d'un graphe donné",
      "content" : [
        "SELECT * ",
        "FROM <https://enrichment-process.data.istex.fr/notice/graph> ",
        "WHERE { ",
        "  ?subject ?verb ?complement . ",
        "} ",
        "LIMIT 100"
      ],
      "description" : "Permet de récuprérer tous les triplets associer à un graphe donné."
  }
]`;

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
      var jsonData = JSON.parse(examplesData);
      jsonData.forEach((jsonElement) => {
        //recuperation et formattage des données
        var title = jsonElement.title;
        var content = jsonElement.content.join('\n');
        var description = jsonElement.description;

        //creation du html correspondant
        var li = document.createElement("li");
        li.classList.add("exampleItem");
        li.setAttribute('title', description);
        
        var radioBt = document.createElement('input');
        radioBt.setAttribute("type", "radio");
        radioBt.setAttribute("name", "exampleRadioButton");
        radioBt.setAttribute("value", content);
        li.appendChild(radioBt);
        li.appendChild(document.createTextNode(title));
        
        //evenement de click sur chaque exemple
        li.addEventListener('click', function(){
          li.childNodes[0].click();
          document.getElementById('executeExample').removeAttribute("disabled");
        });
        
        //ajout des exemples dans le DOM
        examplesDiv.appendChild(li);
      });
   

  //interraction avec la pop-up
  var executeBt = document.getElementById('executeExample');
  executeBt.addEventListener('click', function(){
    var selected = getSelectedExample();
    if(selected === null) return;
    var newTab = yasgui.addTab();
    newTab.setQuery(selected.value);
    hidePopup(closeBt.closest('.popupContainer'));
    newTab.yasqe.query();
  });

  var closeBt =  document.getElementById('closePopup');
  closeBt.addEventListener('click', function(){
      hidePopup(closeBt.closest('.popupContainer'));
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

function getSelectedExample(){
  var radios = document.getElementsByName("exampleRadioButton");
  for(var i = 0; i < radios.length; i++){
    if(radios[i].checked){
      return radios[i];
    }
  }
  
  return null;
}

function showPopup(popup){
  popup.classList.remove('hidePopup');
  popup.classList.add('showPopup');
}

function hidePopup(popup){
  popup.classList.remove('showPopup');
  popup.classList.add('hidePopup');
}
