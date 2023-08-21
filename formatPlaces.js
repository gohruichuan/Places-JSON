const rawPlaces = require("./rawPlaces.json");
const fs = require("fs");

const places = [];
let placeObj = {
  label: "",
};
const replaceSpecialChars = (str) => {
  return (
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      // .replace(/([^\w]+|\s+)/g, "-") // Replace space and other characters by hyphen
      .replace(/\-\-+/g, "-") // Replaces multiple hyphens by one hyphen
      .replace(/(^-+|-+$)/g, "")
      .replace(" District", "")
      .replace(" Prefecture", "")
  ); // Remove extra hyphens from beginning or end of the string
};

const addData = (data) => {
  placeObj.label = data;
  places.push(placeObj);
  placeObj = {};
};

const formatPlaces = rawPlaces.map((place) => {
  if (place.name) {
    console.log(replaceSpecialChars(place.name));
    addData(replaceSpecialChars(place.name));
  }

  if (place.states && place.states.length) {
    const states = place.states;

    states.map((state) => {
      const stateName = replaceSpecialChars(state.name);
      addData(stateName);

      if (state.cities && state.cities.length) {
        const cities = state.cities;

        cities.map((city) => {
          const cityName = replaceSpecialChars(city.name);
          addData(cityName);
        });
      }
    });
  }
});

const main = async () => {
  Promise.all(formatPlaces).then(() => {
    fs.writeFile("places.json", JSON.stringify(places), (err) => {
      if (err) console.log(err);
      else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
        console.log(fs.readFileSync("books.txt", "utf8"));
      }
    });
  });
};

main();
