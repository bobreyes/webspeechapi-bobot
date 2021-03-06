/* eslint-disable max-lines-per-function */
var final_transcript = "";
var speechrecognitionlist;
var recognizing = false;
var recognition;
var synth = window.speechSynthesis;
var voiceSelect = document.getElementById("voices");
var voices = [];

const say = text => {
    var utterThis = new SpeechSynthesisUtterance(text);
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute("data-name");
    for (let i = 0; i < voices.length; i++) {
        if (voices[i].name === selectedOption) {
            utterThis.voice = voices[i];
        }
    }
    utterThis.pitch = 1;
    utterThis.rate = 1;
    synth.speak(utterThis);
}

const append_to_chatwindow = (value, direction, background) => {
    var innerDiv = document.createElement("div");
    innerDiv.id = "rcorners2";
    innerDiv.innerHTML = value;
    innerDiv.style.background = background;
    innerDiv.style["text-align"] = direction;
    innerDiv.style.float = direction;
    document.getElementById("rcorners1").appendChild(innerDiv);
    document.getElementById("rcorners1").appendChild(document.createElement("br"));
    document.getElementById("rcorners1").appendChild(document.createElement("br"));
    document.getElementById("rcorners1").appendChild(document.createElement("br"));
    document.getElementById("rcorners1").appendChild(document.createElement("br"));

    if (direction === "left"){
        // synthesize
        say(value);
    }
}

const determine_intent = intent => {
    const lang = voiceSelect.selectedOptions[0].getAttribute("data-lang");
    if (lang === "en-US") {
        if (intent.toLowerCase().indexOf("weather") > -1 && intent.toLowerCase().indexOf("singapore") > -1) {
            append_to_chatwindow("Sunny and warm!", "left", "lightgray");
        } else if (intent.toLowerCase().indexOf("weather") > -1 && intent.toLowerCase().indexOf("amsterdam") > -1) {
            append_to_chatwindow("Cold and rainy!", "left", "lightgray");
        } else if (intent.toLowerCase().indexOf("best") > -1 && intent.toLowerCase().indexOf("browser") > -1) {
            append_to_chatwindow("Firefox of course", "left", "lightgray");
        } else if (intent.toLowerCase().indexOf("mabuhay") > -1 && intent.toLowerCase().indexOf("pilipinas") > -1) {
            append_to_chatwindow("Mabuhay!", "left", "lightgray");
        } else if (intent.toLowerCase().indexOf("bobby") > -1 && intent.toLowerCase().indexOf("cute") > -1) {
            append_to_chatwindow("Yes, of course! Bob is pogi!", "left", "lightgray");
        } else if (intent.toLowerCase().indexOf("robin") > -1 && intent.toLowerCase().indexOf("cute") > -1) {
            append_to_chatwindow("Nope! He is not cute!", "left", "lightgray");
        } else if (intent.toLowerCase().indexOf("haswell") > -1 && intent.toLowerCase().indexOf("pretty") > -1) {
            append_to_chatwindow("Yes, Bea is pretty!", "left", "lightgray");
        } else if (intent.toLowerCase().indexOf("handsome") > -1 && intent.toLowerCase().indexOf("philippines") > -1) {
            append_to_chatwindow("Bob Reyes, of course!", "left", "lightgray");
        }  else {
            append_to_chatwindow("Sorry I didn't understand", "left", "lightgray");
        }
    }
}

const displayStatus = status => {
    document.querySelector("#status").innerText = status;
    console.log(status);
}

window.onload = () => {

    // check that your browser supports the API
    if (!("SpeechRecognition" in window)) {
        alert("Your Browser does not support the Speech API");
    }
    else {
        // eslint-disable-next-line max-lines-per-function
        document.querySelector("#microphone").onclick = () => {

            if (recognizing) {
                recognition.abort();
                return;
            }

            recognition = new SpeechRecognition();
            recognition.lang = voiceSelect.selectedOptions[0].getAttribute("data-lang");
            recognition.start();

            displayStatus("SpeechRecognition ready");

            recognition.onstart = function() {
                recognizing = true;
                displayStatus("Speak slowly and clearly");
            };

            recognition.onerror = function(event) {
                displayStatus("There was a recognition error... " + event.message);
            };

            recognition.onend = function() {
                displayStatus("Done");
                recognizing = false;
            };

            recognition.onresult = function(event) {

                displayStatus("recognition.onresult called");
                var score = "";

                // Assemble the transcript from the array of results
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        displayStatus("recognition.onresult : isFinal");
                        final_transcript = event.results[i][0].transcript;
                        score = event.results[i][0].confidence;
                    } else {
                        displayStatus("recognition.onresult : not isFinal");
                        final_transcript = event.results[i][0].transcript;
                        score = event.results[i][0].confidence;
                    }
                }
                append_to_chatwindow(final_transcript, "right", "lightgreen");
                determine_intent(final_transcript);
                displayStatus("final:    " + final_transcript + "," + score);
            };
        };
    }

    function populateVoiceList() {
        voices = synth.getVoices();
        var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
        voiceSelect.innerHTML = "";
        for(i = 0; i < voices.length ; i++) {
          var option = document.createElement("option");
          option.textContent = voices[i].name + " (" + voices[i].lang + ")";

          if(voices[i].default) {
            option.textContent += " -- DEFAULT";
          }

          option.setAttribute("data-lang", voices[i].lang);
          option.setAttribute("data-name", voices[i].name);
          voiceSelect.appendChild(option);
        }
        voiceSelect.selectedIndex = selectedIndex;
      }

    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }

}