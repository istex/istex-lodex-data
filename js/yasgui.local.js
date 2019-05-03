var examplesData = 
[
  {
    "title" : "Liste de dix triplets",
    "content" : 

`SELECT * # Affiche toutes les variables
WHERE {
  # Un motif de triplet, ou chaque partie est une variable
  ?subject ?verb ?complement .
}
OFFSET 1000 # Démarre au millième triplet
LIMIT 10 # Ne prend que 10 triplets"
`,

    "description" : "Liste dix triplets, à partir du numéro 1000."
  },
  {
    "title" : "Nombre de triplets",
    "content" : 
`SELECT (COUNT(*) as ?nb) # Compte les triplets trouvés
WHERE {
  # Pas de contrainte particulière
  ?subject ?verb ?complement
}
`,
    "description" : "Compte tous les triplets présents dans le triple store (y compris les triplets par défaut ajoutés par OpenLink Virtuoso)."
  },
  {
    "title" : "Nombre de triplets par graphe nommé",
    "content" :
`# Affiche la variable ?g à côté du comptage des triplets correspondant
# Ce comptage est stocké dans la variable ?nb
SELECT ?g (COUNT(*) AS ?nb)
WHERE {
  # ?subject ?verb ?complement est le triplet appartenant au
  # graphe nommé ?g
  # Un graphe nommé est un sous-ensemble de triplets.
  GRAPH ?g { ?subject ?verb ?complement . }
}
GROUP BY ?g # Groupe les triplets par graphe nommé
ORDER BY DESC(?nb) # Trie les graphes par nombre de triplets
`,
    "description" : "Donne la répartition des triplets par graphe nommé. Un graphe nommé étant une sous-partie du graphe global contenant tous les triplets."
  },
  {
    "title" : "Triplets d’un graphe nommé",
    "content" : 
`# Affiche toutes les variables (dans ce cas, elles constituent un triplet)
SELECT *
FROM <https://enrichment-process.data.istex.fr/notice/graph> # Graphe dans lequel on cherche
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100 # Limite le nombre de réponses à 100
`,
    "description" : "Affiche les cent premiers triplets d’un graphe nommé particulier. Quand on ne sélectionne pas de graphe nommé, la requête cherche dans tous les graphes nommés du système (c’est-à-dire tous les triplets)."
  },
  {
    "title" : "Triplets de deux graphes nommés",
    "content" : 
`SELECT *
# On peut chercher dans plusieurs graphes nommés (et dans aucun autre),
# en utilisant l’instruction FROM plusieurs fois.
FROM <https://enrichment-process.data.istex.fr/notice/graph>
FROM <https://wos-category.data.istex.fr/notice/graph>
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100
`,
    "description" : "Affiche les cent premiers triplets de deux graphes nommés particuliers."
  },
  {
    "title" : "Récupération du label du type d’un document (avec filtrage sur la langue)",
    "content" : 
`# Déclaration d’un préfixe.
# Dans la suite de la requête, skos: sera remplacé par # http://www.w3.org/2004/02/skos/core#
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT *
WHERE {
  # Le document ark:/67375/996-HMN8BG45-4 a un type de publication (istex:publicationType)
  # qui est affecté à la variable ?pt.
  <https://api.istex.fr/ark:/67375/996-HMN8BG45-4> 
  <https://data.istex.fr/ontology/istex#publicationType> ?pt .
    ?pt skos:prefLabel ?label . # ?pt est le point commun entre les triplets.
  # skos:prefLabel est la propriété liant un type de publication à son libellé.
  FILTER(LANG(?label) = 'fr') # Ne garde que les cas où ?label est en français.
}
`,
    "description" : "Affiche des informations attachées à un document ISTEX particulier. En l’occurrence, son type de publication, exprimé en français."
  },
  {
    "title" : "Valeurs multiples (depuis la BNF)",
    "content" :
`# Il faut interroger https://data.bnf.fr/sparql au lieu de https://data.istex.fr/sparql/
      
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT *
WHERE
{
  # Ce motif sélectionne les objets dont le libellé en français est Bioinformatique
  ?uri skos:prefLabel "Bioinformatique"@fr.
  # OPTIONAL permet de conserver le triplet courant dans ceux à afficher même si
  #     le motif ne trouve pas de correspondance.
  # Sélectionne un éventuel (OPTIONAL) libellé alternatif (skos:altLabel)
  OPTIONAL { ?uri skos:altLabel ?AutreNom. }
  # Sélectionne un terme lié (skos:related)
  OPTIONAL { ?uri skos:related ?Relation.
  ?Relation skos:prefLabel ?TermeRelie. }
}
`,
    "description" : "Cette interrogation d’un autre SPARQL Endpoint (celui de la BNF) illustre le nombre de résultats quand une propriété a plusieurs valeurs. Ici, un seul concept (Bioinformatique) possède plusieurs libellés. Chaque libellé donne lieu à une ligne. L’interrogation suivante montre comment réduire ce résultat à une seule ligne.",
    "endpoint" : "https://data.bnf.fr/sparql" 
  },
  {
    "title" : "Concaténation des valeurs (depuis la BNF)",
    "content" : 
`# Il faut interroger https://data.bnf.fr/sparql au lieu de https://data.istex.fr/sparql/ 

PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
# Affiche l'URL de la notice RAMEAU, le libellé alternatif, 
SELECT ?NoticeRAMEAU 
  # GROUP_CONCAT concatène des valeurs différentes d'une variable
  #   (?AutreNom) dans une autre variable (?AutresNoms).
  # DISTINCT retire les doublons dans un ensemble de valeurs 
  #   (toutes les valeurs de la variable ?AutreNom).
  GROUP_CONCAT(DISTINCT ?AutreNom; SEPARATOR=", ") AS ?AutresNoms
  ?TermeRelie # un éventuel terme lié (skos:related)
WHERE
{
  # Ce motif sélectionne les objets dont le libellé en français est Bioinformatique
  ?uri skos:prefLabel "Bioinformatique"@fr.
  # OPTIONAL permet de conserver le triplet courant dans ceux à afficher même si
  #          le motif ne trouve pas de correspondance.
  # Sélectionne un éventuel (OPTIONAL) libellé alternatif (skos:altLabel)
  OPTIONAL { ?uri skos:altLabel ?AutreNom. }
  # Sélectionne un terme lié (skos:related)
  OPTIONAL { ?uri skos:related ?Relation.
             ?Relation skos:prefLabel ?TermeRelie. }
}
# Groupe les triplets par toutes les variables dont 
# les valeurs ne sont pas concaténées (GROUP_CONCAT) dans le SELECT.

# GROUP BY renvoie une seule ligne pour toutes les lignes 
# qui ont la même valeur pour les deux variables.
GROUP BY ?NoticeRAMEAU ?TermeRelie
`,
    "description" : "Cette requête est similaire à la précédente (Valeurs multiples (BNF)), mais elle rassemble 4 lignes exprimant les propriétés d’un même concept en une seule.",
    "endpoint" : "https://data.bnf.fr/sparql" 
  },
  {
    "title" : "Interrogation BNF",
    "content" :
`# Il faut interroger https://data.bnf.fr/sparql au lieu de https://data.istex.fr/sparql/ 

PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
# Affiche l'URL de la notice RAMEAU, le libellé alternatif, 
SELECT ?NoticeRAMEAU 
      # GROUP_CONCAT concatène des valeurs différentes d'une variable
      #   (?AutreNom) dans une autre variable (?AutresNoms).
      # DISTINCT retire les doublons dans un ensemble de valeurs 
      #   (toutes les valeurs de la variable ?AutreNom).
      GROUP_CONCAT(DISTINCT ?AutreNom; SEPARATOR=", ") AS ?AutresNoms
      # affiche le(s) terme(s) générique(s)
      (GROUP_CONCAT(DISTINCT ?TermePlusLargeTmp;SEPARATOR=" && ") AS ?TermePlusLarge)
      # le(s) terme(s) spécifique(s)
      (GROUP_CONCAT(DISTINCT ?TermePlusPrecisTmp;SEPARATOR=" && ") AS ?TermePlusPrecis)
      ?TermeRelie # un éventuel terme lié (skos:related)
      # le ou les concept(s) proche(s)
      (GROUP_CONCAT(DISTINCT ?URIAlignement;SEPARATOR=" && ") AS ?AlignementBnf)
WHERE
{
  # Ce motif sélectionne les objets dont le libellé en français est Bioinformatique
  ?uri skos:prefLabel "Bioinformatique"@fr.
  # OPTIONAL permet de conserver le triplet courant dans ceux à afficher même si
  #          le motif ne trouve pas de correspondance.
  # Sélectionne un éventuel (OPTIONAL) libellé alternatif (skos:altLabel)
  OPTIONAL { ?uri skos:altLabel ?AutreNom. }
  # Sélectionne l'éventuel lien vers la notice RAMEAU
  OPTIONAL { ?uri rdfs:seeAlso ?NoticeRAMEAU. }
  # Sélectionne le libellé d'un terme générique (skos:broader)
  OPTIONAL { ?uri skos:broader ?URIBroader.
             ?URIBroader skos:prefLabel ?TermePlusLargeTmp. }
  # Sélectionne le libellé d'un terme spécifique (skos:narrower)
  OPTIONAL { ?uri skos:narrower ?URINarrower.
             ?URINarrower skos:prefLabel ?TermePlusPrecisTmp. }
  # Sélectionne un alignement proche
  OPTIONAL { ?uri skos:closeMatch ?URIAlignement. }
  # Sélectionne un terme lié (skos:related)
  OPTIONAL { ?uri skos:related ?Relation.
             ?Relation skos:prefLabel ?TermeRelie. }
}
# Groupe les triplets par toutes les variables dont 
# les valeurs ne sont pas concaténées (GROUP_CONCAT) dans le SELECT.

# GROUP BY renvoie une seule ligne pour toutes les lignes 
# qui ont la même valeur pour les deux variables.
GROUP BY ?NoticeRAMEAU ?TermeRelie
`,
    "description" : "Affiche des informations de la BNF sur le concept « Bioinformatique », dont la notice RAMEAU, les termes génériques et spécifiques, des alignements extérieurs... Cette requête étend la requête précédente à d’autres champs.",
    "endpoint" : "https://data.bnf.fr/sparql" 
  },
  {
    "title" : "---"
  },
  {
    "title" : "Nombre de triplets par graphe nommé",
    "content" :
`SELECT DISTINCT ?g, count(*) AS ?nb
WHERE {
  graph ?g { ?s ?p ?o }
}
`,
    "description" : "Trouver tous les graphes de notre triplestore avec le nombre de triplets correspondant"
  },
  {
    "title" : "Propriétés d’un graphe",
    "content" :
`SELECT DISTINCT ?p
FROM <https://scopus-category.data.istex.fr/graph>
WHERE {
  ?s ?p ?o
}
`,
    "description" : "Trouver les propriétés pour le graphe « scopus-category.data.istex.fr »"
  },
  {
    "title" : "Nombre d’articles de recherche",
    "content" :
`SELECT (count (?docistex) AS ?nombredocistex)
WHERE
{
  ?docistex <https://data.istex.fr/ontology/istex#contentType> ?conttype.
  ?conttype <http://www.w3.org/2004/02/skos/core#prefLabel> "papier de recherche"@fr
}
`,
    "description" : "Combien y a-t-il de documents correspondant au type de document (ou genre) « article de recherche » ?"
  },
  {
    "title" : "Catégories Inist des papiers de recherche",
    "content" :
`SELECT (count (?docistex) AS ?totaldocistex) ?catinist
WHERE
{
?docistex <https://data.istex.fr/ontology/istex#contentType> ?conttype.
?conttype <http://www.w3.org/2004/02/skos/core#prefLabel> "papier de recherche"@fr.
?docistex <https://data.istex.fr/ontology/istex#subjectInist> ?subjectInist.
?subjectInist <http://www.w3.org/2004/02/skos/core#prefLabel> ?catinist.
  filter (lang(?catinist)= "fr")
}
ORDER BY desc (?totaldocistex)
`,
    "description" : "La répartition des catégories inist pour le content type « papier de recherche »@fr"
  },
  {
    "title" : "Pourcentage des catégories Inist",
    "content" :
`SELECT 
  ?libellecatinist 
	(count(?libellecatinist) as ?totallibellecatinist) 
	(count (?libellecatinist)*1000/?totalcontentTypePDR as ?perThousand)
WHERE
{
	{
    # libellés en français des catégories Inist des documents dont le type est "papier de recherche"
		select ?libellecatinist
 		where
 		{
			?docistex <https://data.istex.fr/ontology/istex#contentType> ?conttype.
            ?conttype <http://www.w3.org/2004/02/skos/core#prefLabel> "papier de recherche"@fr.
            ?docistex <https://data.istex.fr/ontology/istex#subjectInist> ?catinist.
            ?catinist <http://www.w3.org/2004/02/skos/core#prefLabel> ?libellecatinist.
   			filter(lang(?libellecatinist)= "fr")
		}
	}
	{
    # Nombre total de documents de type "papier de recherche"
		select (count(?docistex) as ?totalcontentTypePDR)
 		where
		{  
          ?docistex <https://data.istex.fr/ontology/istex#contentType> ?conttype.
          ?conttype <http://www.w3.org/2004/02/skos/core#prefLabel> "papier de recherche"@fr.
    	}
	}
}
order by desc (?perThousand)
`,
    "description" : "la répartition « catégorie inist » pour le content type « papier de recherche »@fr, exprimée en pourcentage."
  },
  {
    "title" : "---"
  },{
    "title" : "Faux exemple 1",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 2",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 3",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 4",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 5",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 6",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 7",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 8",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 9",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 10",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 11",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 12",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 13",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 14",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 15",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 16",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 17",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 18",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 19",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 20",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 1",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 2",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 3",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 4",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 5",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 6",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 7",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 8",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 9",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 10",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 11",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 12",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 13",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 14",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 15",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 16",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 17",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 18",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 19",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 20",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 1",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 2",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 3",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 4",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 5",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 6",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 7",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 8",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 9",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 10",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 11",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 12",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 13",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 14",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 15",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 16",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 17",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 18",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 19",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 20",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 1",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 2",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 3",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 4",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 5",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 6",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 7",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 8",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 9",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 10",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 11",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 12",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 13",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 14",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 15",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 16",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 17",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 18",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 19",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 20",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 1",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 2",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 3",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 4",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 5",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 6",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 7",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 8",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 9",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 10",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 11",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 12",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 13",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 14",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 15",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 16",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 17",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 18",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 19",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 20",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 1",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 2",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 3",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 4",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 5",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 6",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 7",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 8",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 9",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 10",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 11",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 12",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 13",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 14",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 15",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 16",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 17",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`
  },{
    "title" : "Faux exemple 18",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`,
"tags" : ["un premier tag"]
  },{
    "title" : "Faux exemple 19",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`,
  "tags" : ["tag en double", "tag test 0"]
  },{
    "title" : "Faux exemple 20",
    "description" : "Ceci est un exemple factice",
    "content" :
`SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`,
  "tags" : ["tag test 1", "tag test 2", "tag en double"]
  }
];

//creation des variables utiles
var tags = Array();
examplesData.forEach(function(example, index){
  example.id = index;
});

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
  
  
  var examplesPopup = document.getElementById("popupExamples");
  
  //chargement des tags
  var tagsListHtml = document.getElementById("tagsList");
  examplesData.forEach(function(ex){
    if(ex.tags !== undefined){
      ex.tags.forEach(function(tag){
        if(!tags.includes(tag)){
          tags.push(tag);
          var tagHtml = document.createElement('div');
          var tagCheckbox = document.createElement('input');
          tagCheckbox.classList.add('tagCheckbox');
          tagCheckbox.setAttribute('name', 'tagCheckbox');
          tagCheckbox.setAttribute('type', 'checkbox');
          tagCheckbox.setAttribute('value', tag);
          tagHtml.appendChild(tagCheckbox);
          var tagText = document.createTextNode(tag);
          tagHtml.appendChild(tagText);
          tagsListHtml.appendChild(tagHtml);
          tagCheckbox.addEventListener('change', refreshList);
        }
      });
    }
  });
  
  //chargement des exemples depuis le fichier json en appliquant les filtres
  refreshList();
  
  //interraction avec la pop-up
  examplesPopup.addEventListener('click', function(event){
    if(examplesPopup !== event.target) return;
    hidePopup(examplesPopup);
  });
  
  var executeBt = document.getElementById('executeExample');
  executeBt.addEventListener('click', function(){
    var selected = examplesData[getSelectedExample()];
    if(selected === undefined) return;    
    var newTab = yasgui.addTab();
    newTab.rename(selected.title);
    var query = "# Description : \n# " + selected.description + "\n\n" + selected.content;
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
  document.getElementById('showExamples').addEventListener('click', function(){ 
    if(examplesPopup.classList.contains('showPopup')){
      hidePopup(examplesPopup);
    }else{
      showPopup(examplesPopup);
    }
  });
  
  //affichage de la selection de tags
  document.querySelectorAll('.dropdown-toggle').forEach((e) =>{
    e.addEventListener('click', function(){
      if(e.parentNode.classList.contains('dropdown-open')){
        e.parentNode.classList.remove('dropdown-open');
      }else{
        e.parentNode.classList.add('dropdown-open');
      }
    });
  });
  
  //recherche
  document.getElementById('searchExamples').addEventListener('keyup', function(){
    refreshList();
  });
  
  // detection du clavier
  document.addEventListener('keyup', function(event){
    if(examplesPopup.classList.contains("showPopup") && event.code === "Escape"){
      hidePopup(examplesPopup);
    }
  });
  
}, 1000);


function refreshList(){
  var examplesDiv = document.getElementById("examples");
  
  examplesDiv.innerHTML = "";
  
  var search = document.getElementById('searchExamples').value;
  var tagsSelected = getSelectedTags();
  
  examplesData
  .filter(function(example){
    return shouldShowExample(example, search, tagsSelected)
  })
  .forEach((example) => {
    //recuperation et formattage des données
    var id = example.id;
    var title = example.title;
    var description = example.description;
    
    if(title === "---"){
      var hr = document.createElement("hr");
      examplesDiv.appendChild(hr);
      return;
    }
    
    //creation du html correspondant
    var li = document.createElement("li");
    li.classList.add("exampleItem");
    
    var radioBt = document.createElement('input');
    radioBt.setAttribute("type", "radio");
    radioBt.setAttribute("name", "exampleRadioButton");
    radioBt.setAttribute("value", id);
    li.appendChild(radioBt);

    var titleDiv = document.createElement('h4');
    titleDiv.classList.add('title')
    titleDiv.appendChild(document.createTextNode(title));
    li.appendChild(titleDiv);
    
    var descDiv = document.createElement('div');
    descDiv.classList.add('description');
    descDiv.appendChild(document.createTextNode(description));
    li.appendChild(descDiv);

    //evenement de click sur chaque exemple
    li.addEventListener('click', function(){
      li.childNodes[0].click();
      document.getElementById('executeExample').removeAttribute("disabled");
    });
    
    //ajout des exemples dans le DOM
    examplesDiv.appendChild(li);
  });
}

function shouldShowExample(elem, search, tagsSelected){  

  //pas de filtre
  if(tagsSelected.length === 0 && search === "") { return true; }


  //fonction de vérification de recherche
  var contains = function(text, search){
    var textNormalized = text.normalize('NFD').replace(/[^\w\s]|_/g, "").replace(/\s+/g, "").replace(' ', '').toLowerCase();
    var searchNormalized = search.normalize('NFD').replace(/[^\w\s]|_/g, "").replace(/\s+/g, "").replace(' ', '').toLowerCase();
    return textNormalized.includes(searchNormalized);
  }
  
  //filtre uniquement sur titre et description
  if(tagsSelected.length === 0) {
    if(elem.title !== undefined && contains(elem.title, search)) return true;
    if(elem.description !== undefined && contains(elem.description, search)) return true; 
  }
  
  //filtre si tags selectionnes
  if(elem.tags === undefined)  { return false; }
  for(var i = 0; i < elem.tags.length; i++){
    if(tagsSelected.includes(elem.tags[i])) { 
      if(search === "") { return true; }
      if(elem.title !== undefined && contains(elem.title, search)) return true;
      if(elem.description !== undefined && contains(elem.description, search)) return true; 
    }
  }
  
  return false;
}

function getSelectedExample(){
  var radios = document.getElementsByName('exampleRadioButton');
  for(var i = 0; i < radios.length; i++) {
    if(radios[i].checked) {
      return radios[i].value;
    }
  }
  
  return -1;
}

function getSelectedTags(){
  var res = Array();
  var checkboxs = document.getElementsByName('tagCheckbox');
  for(var i = 0; i < checkboxs.length; i++){
    if(checkboxs[i].checked) {
      res.push(checkboxs[i].value);
    }
  }
  
  return res;
}

function showPopup(popup){
  popup.classList.remove('hidePopup');
  popup.classList.add('showPopup');
}

function hidePopup(popup){
  popup.classList.remove('showPopup');
  popup.classList.add('hidePopup');
}
