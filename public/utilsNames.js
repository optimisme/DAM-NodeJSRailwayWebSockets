function initNames () {

    var select = document.getElementById("names");
    
    var animals = [ "lion",  "tiger",  "elephant",  "monkey",  "panda",  "giraffe",  "zebra",  "hippopotamus",  "rhinoceros",  "crocodile",  "kangaroo",  "penguin",  "koala",  "shark",  "dolphin",  "whale",  "octopus",  "seahorse",  "starfish",  "butterfly",  "ladybug",  "bee",  "owl",  "parrot",  "turtle",  "frog"];
    var adjectives = [ "funny", "crazy", "silly", "goofy", "wacky", "zany", "quirky", "spunky", "funky", "playful", "fluffy", "bouncy", "jumpy", "sneaky", "snappy", "frisky", "furry", "slinky", "slippery", "smiling", "squeaky", "tricky", "wiggly", "woolly", "chatty", "chirpy"];
    
    var usedAnimals = [];
    var usedAdjectives = [];
    
    for (var i = 0; i < animals.length; i++) {
      var animalIndex = Math.floor(Math.random() * animals.length);
      var adjectiveIndex = Math.floor(Math.random() * adjectives.length);
      while (usedAnimals.includes(animalIndex) || usedAdjectives.includes(adjectiveIndex)) {
        animalIndex = Math.floor(Math.random() * animals.length);
        adjectiveIndex = Math.floor(Math.random() * adjectives.length);
      }
      usedAnimals.push(animalIndex);
      usedAdjectives.push(adjectiveIndex);
      var option = document.createElement("option");
      var animal = animals[animalIndex];
      var adjective = adjectives[adjectiveIndex];
      option.text = adjective + " " + animal;
      select.add(option);
    }
  }
  