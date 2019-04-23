var examplesData = `
[
  {
    "title" : "Liste de dix triplets",
    "content" : [
      "SELECT * # Affiche toutes les variables",
      "WHERE {",
      "  # Un motif de triplet, ou chaque partie est une variable",
      "  ?subject ?verb ?complement .",
      "}",
      "OFFSET 1000 # Démarre au millième triplet",
      "LIMIT 10 # Ne prend que 10 triplets"
    ],
    "description" : "Liste dix triplets, à partir du numéro 1000."
  },
  {
    "title" : "Nombre de triplets",
    "content" : [
      "SELECT (COUNT(*) as ?nb) # Compte les triplets trouvés",
      "WHERE {",
      "  # Pas de contrainte particulière",
      "  ?subject ?verb ?complement",
      "}"
    ],
    "description" : "Compte tous les triplets présents dans le triple store (y compris les triplets par défaut ajoutés par OpenLink Virtuoso)."
  },
  {
    "title" : "Nombre de triplets par graphe nommé",
    "content" : [
      "# Affiche la variable ?g à côté du comptage des triplets correspondant",
      "# Ce comptage est stocké dans la variable ?nb",
      "SELECT ?g (COUNT(*) AS ?nb)",
      "WHERE {",
      "  # ?subject ?verb ?complement est le triplet appartenant au",
      "  # graphe nommé ?g",
      "  # Un graphe nommé est un sous-ensemble de triplets.",
      "  GRAPH ?g { ?subject ?verb ?complement . }",
      "}",
      "GROUP BY ?g # Groupe les triplets par graphe nommé",
      "ORDER BY DESC(?nb) # Trie les graphes par nombre de triplets"
    ],
    "description" : "Donne la répartition des triplets par graphe nommé. Un graphe nommé étant une sous-partie du graphe global contenant tous les triplets."
  },
  {
    "title" : "Triplets d’un graphe nommé",
    "content" : [
      "# Affiche toutes les variables (dans ce cas, elles constituent un triplet)",
      "SELECT *",
      "FROM <https://enrichment-process.data.istex.fr/notice/graph> # Graphe dans lequel on cherche",
      "WHERE {",
      "  ?subject ?verb ?complement .",
      "}",
      "LIMIT 100 # Limite le nombre de réponses à 100"
    ],
    "description" : "Affiche les cent premiers triplets d’un graphe nommé particulier. Quand on ne sélectionne pas de graphe nommé, la requête cherche dans tous les graphes nommés du système (c’est-à-dire tous les triplets)."
  },
  {
    "title" : "Triplets de deux graphes nommés",
    "content" : [
      "SELECT *",
      "# On peut chercher dans plusieurs graphes nommés (et dans aucun autre),",
      "# en utilisant l’instruction FROM plusieurs fois.",
      "FROM <https://enrichment-process.data.istex.fr/notice/graph>",
      "FROM <https://wos-category.data.istex.fr/notice/graph>",
      "WHERE {",
      "  ?subject ?verb ?complement .",
      "}",
      "LIMIT 100"
    ],
    "description" : "Affiche les cent premiers triplets de deux graphes nommés particuliers."
  },
  {
    "title" : "Récupération du label du type d’un document (avec filtrage sur la langue)",
    "content" : [
      "# Déclaration d’un préfixe.",
      "# Dans la suite de la requête, skos: sera remplacé par # http://www.w3.org/2004/02/skos/core#",
      "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>",
      "SELECT *",
      "WHERE {",
      "  # Le document ark:/67375/996-HMN8BG45-4 a un type de publication (istex:publicationType)",
      "  # qui est affecté à la variable ?pt.",
      "  <https://api.istex.fr/ark:/67375/996-HMN8BG45-4> ",
      "  <https://data.istex.fr/ontology/istex#publicationType> ?pt .",
      "    ?pt skos:prefLabel ?label . # ?pt est le point commun entre les triplets.",
      "  # skos:prefLabel est la propriété liant un type de publication à son libellé.",
      "  FILTER(LANG(?label) = 'fr') # Ne garde que les cas où ?label est en français.",
      "}"
    ],
    "description" : "Affiche des informations attachées à un document ISTEX particulier. En l’occurrence, son type de publication, exprimé en français."
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
    var description = jsonElement.description;
    
    //creation du html correspondant
    var li = document.createElement("li");
    li.classList.add("exampleItem");
    li.setAttribute('title', description);
    
    var radioBt = document.createElement('input');
    radioBt.setAttribute("type", "radio");
    radioBt.setAttribute("name", "exampleRadioButton");
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
    var selected = jsonData[getSelectedExample()];
    if(selected === undefined) return;    
    var newTab = yasgui.addTab();
    var query = selected.content.join('\n');
    newTab.setQuery(query);
    var endpoint = selected.endpoint;
    if(endpoint !== undefined) {
      newTab.setEndpoint(endpoint);
    }else{
      newTab.setEndpoint(YASGUI.defaults.yasqe.sparql.endpoint);
    }
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
      return i;
    }
  }
  
  return -1;
}

function showPopup(popup){
  popup.classList.remove('hidePopup');
  popup.classList.add('showPopup');
}

function hidePopup(popup){
  popup.classList.remove('showPopup');
  popup.classList.add('hidePopup');
}
