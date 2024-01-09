//https://regexr.com/
var occurances, occurancesOfDiphthongs;
var text = "";
var final, passage;
var vowels = new Map([['long a', 'ej'], ['long i', 'aj'], ['ow', 'aw'], ['oy', 'ɔj'], ['long o', 'ow'], ['long e', 'i'], ['e', 'e'], ['short e', 'ɛ'], ['short i', 'ɪ'], ['a', 'æ'], ['short a', 'ɑ'], ['short o', 'ɔ'], ['o', 'ʊ'], ['oo', 'u'], ['u (WIP)', 'ʌ'], ['short u', 'ə']]);
var consonants = new Map([['j', 'ʤ'], ['b', 'b'], ['p', 'p'], ['m', 'm'], ['t', 't'], ['d', 'd'], ['n', 'n'], ['k', 'k'], ['g', 'g'], ['ng', 'ŋ'], ['f', 'f'], ['v', 'v'], ['s', 's'], ['z', 'z'], ['light th', 'θ'], ['hard th', 'ð'], ['sh', 'ʃ'], ['ch', 'ʧ'], ['j', 'ʒ'], ['l', 'l'], ['r', 'ɹ'], ['y', 'j'], ['w', 'w'], ['h', 'h']]);
var howMany, isConsonant;

function onLoadPage() {
  document.getElementById("js-ipa-submit").classList.add("no-click");
  TextToIPA.loadDict('lib/ipadict.txt');
  document.getElementById("js-ipa-submit").classList.remove("no-click");
}

function generateHTML() {
  console.log(occurances);
  var result = "";
  howMany = 0;

  for (var i = 0; i < occurances.length; i++) {
    var count = 0;
    if (occurances[i].filter(Boolean).length > 0) {
      howMany++;
      result += result == "" ? "" : ", ";
      for (var j = 0; j < text[i].length; j++) {
        if (occurances[i][count] - 1  == j) {
          result += "<div style='display:inline' class='underline'>" + text[i].charAt(j) + "</div>";
          count++;
        }
        else {
          result += text[i].charAt(j) + "";
        }
        console.log(text[i].charAt(j));
      }
    }
  }
  console.log(result);
  return result;
}

function linearSearch(textArr, sound) {
  occurances = new Array(textArr.length);
  for (var i = 0; i < textArr.length; i++) {
    occurances[i] = new Array(textArr[i].length);
  }

  var count = 0;

  for (var i = 0; i < textArr.length; i++) {
    var indexPos = 0;
    for (var j = 0; j < textArr[i].length; j++) {
      if (!occurancesOfDiphthongs[i][j] && textArr[i].charAt(j) == sound) {
        occurances[i][indexPos] = j + 1;
        indexPos++;
        count++;
      }
    }
  }

  return count;
}

function linearSearch2(textArr, sound) {
  occurances = new Array(textArr.length);
  for (var i = 0; i < textArr.length; i++) {
    occurances[i] = new Array(textArr[i].length);
  }

  var count = 0;

  for (var i = 0; i < textArr.length; i++) {
    var indexPos = 0;
    for (var j = 0; j < textArr[i].length; j++) {
      if (textArr[i].charAt(j) + textArr[i].charAt(j + 1) == sound) {
        occurances[i][indexPos] = j + 1;
        occurancesOfDiphthongs[i][j] = true;
        occurancesOfDiphthongs[i][j + 1] = true;
        indexPos++;
        count++;
      }
    }
  }

  return count;
}

function convertToIPA() {
  //array of words of IPA sounds
  var ipa = ConverterForm.convert('ipa-in', 'ipa-out', 'ipa-err');
  text = document.getElementById('ipa-in').value.split(/[ \n()/.?!,;—]/).filter(Boolean);
  console.log(ipa);
  console.log(text);
  document.getElementById('ipa-out').value = ipa.join(" ");
  passage = ipa.filter(Boolean);

  occurancesOfDiphthongs = new Array(passage.length);
  for (var i = 0; i < passage.length; i++) {
    occurancesOfDiphthongs[i] = new Array(passage[i].length).fill(false);
  }

  analyzeIPAText();
}

function cycleThrough(value, key, map) {
  if (value.length == 1 && linearSearch(passage, value) > 1) {
    final += (isConsonant ? "<h4  style='display:inline'>Consonance of the " : "<h4  style='display:inline'>Assonance of the ") + key.toUpperCase() +": </h4>" + generateHTML() + " (" + howMany + ")<br>";
  }
  else if (value.length == 2 && linearSearch2(passage, value) > 1) {
    final += (isConsonant ? "<h4  style='display:inline'>Consonance of the " : "<h4  style='display:inline'>Assonance of the ") + key.toUpperCase() +": </h4>" + generateHTML() + " (" + howMany + ")<br>";
  }
}

function analyzeIPAText() {
  final = "<h2>Assonance</h2>";
  
  isConsonant = false;
  vowels.forEach(cycleThrough);

  final += "<br><h2>Consonance</h2>";

  isConsonant = true;
  consonants.forEach(cycleThrough);

  final += "<br><br><br>";

  console.log(final);
  document.getElementById('ending').innerHTML = final;
}