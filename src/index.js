const groupBy = (key) => (array) =>
  array.reduce(
    (objectsByKeyValue, obj) => ({
      ...objectsByKeyValue,
      [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj)
    }),
    {}
  );

const groupByDrummer = groupBy("drummer");

window.beats = [];

((beats) => {
  fetch("beats.json")
    .then((response) => response.json())
    .then((data) => {
      //beats = data;
      beats = data.sort((a, b) => {
        const textA = a.drummer.toUpperCase();
        const textB = b.drummer.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      //window.beats = beats;

      const defaultBeat = {
        id: "",
        drummer: "It's the Funklet!",
        artist: "&nbsp;",
        year: "&nbsp;"
      };

      const beatsByDrummer = groupByDrummer(beats);
      // console.log(beatsByDrummer);

      // get select element
      const sel = document.getElementById("beat_1");
      for (const drummer in beatsByDrummer) {
        // create opt group
        const grp = document.createElement("OPTGROUP");
        grp.label = drummer;

        beatsByDrummer[drummer].forEach((b) => {
          // append option
          const opt = document.createElement("OPTION");
          opt.textContent = b.title;
          opt.value = b.id;
          grp.append(opt);
        });
        // append opt group
        sel.append(grp);
      }
      sel.addEventListener("change", function () {
        const funkletUrl = "https://funklet.com/";
        const baseUrl = "https://machine.funklet.com/funklet.html";
        if (this.value) {
          const id = this.value;
          console.log("You selected: ", id);

          const find = beats.find((b) => b.id === id);

          document.getElementById("drummer_1").innerText = find.drummer
            ? find.drummer
            : defaultBeat.drummer;

          document.getElementById("artist_1").innerText = find.artist
            ? find.artist
            : defaultBeat.artist;

          document.getElementById("year_1").innerText = find.year
            ? find.year
            : defaultBeat.year;

          document
            .getElementById("image")
            .style.setProperty(
              "background-image",
              `url("https://funklet.com/images/${find.image}")`
            );

          document.getElementById("machine_1").src = find.queryString
            ? [baseUrl, "?", find.queryString].join("")
            : baseUrl;

          document.getElementById("funklet_1").href = find.id
            ? [funkletUrl, find.id].join("")
            : funkletUrl;
        } else {
          document.getElementById("drummer_1").innerText = defaultBeat.drummer;
          document.getElementById("artist_1").innerHTML = "&nbsp;";
          document.getElementById("year_1").innerHTML = "&nbsp;";
          document
            .getElementById("image")
            .style.removeProperty("background-image");
          document.getElementById("machine_1").src = baseUrl;
          document.getElementById("funklet_1").href = funkletUrl;
        }
      });
    });
})(window.beats);
