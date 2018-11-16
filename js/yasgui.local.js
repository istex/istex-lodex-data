 YASGUI.YASQE.defaults.value = `SELECT *
    WHERE {
      ?subject ?verb ?complement
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
        }
      ]
    };
    YASGUI.defaults.catalogueEndpoints = options.catalogueEndpoints;
    YASGUI.defaults.yasqe.sparql.endpoint = "https://data.istex.fr/sparql/";
    var yasgui = YASGUI(document.getElementById("YASGUI"), options);