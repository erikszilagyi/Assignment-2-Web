let playsData = '';
let playList = '';
const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php';

/*
 To get a specific play, add play's id property (in plays.json) via query string, 
   e.g., url = url + '?name=hamlet';
 
 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=hamlet
 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=jcaesar
 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=macbeth
 
 NOTE: Only a few plays have text available. If the filename property of the play is empty, 
 then there is no play text available.
/

/ note: you may get a CORS error if you test this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/


  
fetch('./plays.json').then(response => response.json()).then(data => 
{
  let playsDataString = JSON.stringify(data)
  playsData = JSON.parse(playsDataString);
  populatePlays(playsData);
  
}
).catch(error => console.error(error));


function populatePlays(playsDt)
{
  const playList = document.querySelector("section ul");
  for (let play of playsDt)
  {
    let display = document.createElement('li');
    display.setAttribute('data-id', play.id);
    display.innerHTML = play.title;
    playList.appendChild(display);
  }
  
  clickEvent();
}

function displayAct(plObj,plScript)
{
   const list = document.querySelector("#sceneHere");
   list.innerHTML = "";
   let dialogue = document.createElement("div");
   let sceneOne = plScript.acts[0].scenes[0];
   for (speech of sceneOne.speeches) 
   {
     let speakerName = speech.speaker;
     let speaker = document.createElement("span");
     speaker.innerHTML = speakerName;
     dialogue.appendChild(speaker);
     for (line of speech.lines) 
     {
       let line2= document.createElement("p");
       line2.innerHTML = line;
       dialogue.appendChild(line2);
     }
     if (speech.stagedir) 
     {
       let dialogueText = speech.stagedir;
       let dialogue2 = document.createElement("em");
       dialogue2.innerHTML = dialogueText;
       dialogue.appendChild(dialogue2);
     }
   }
   list.appendChild(dialogue);
}

function populatePlay(plObj,plScript)
{
   let actList = document.querySelector("#actList");
   let sceneList = document.querySelector("#sceneList");
   let personaList = document.querySelector("#playerList");

   actList.innerHTML = '';
   sceneList.innerHTML= '';
   personaList.innerHTML = '';

   for (act of plScript.acts)
   {
     let playAct = document.createElement("option");
     playAct.text = act.name;
     actList.appendChild(playAct);
     for(scene of act.scenes)
     {
      let sceneName = document.createElement("option");
      sceneName.text = scene.name;
      sceneList.appendChild(sceneName);
     }
   } 
   for(persona of plScript.persona)
   {
      let personaName = document.createElement("option");
      personaName.text = persona.player;
      personaList.appendChild(personaName);
   }
}



function getPlay(play) 
{
  const apiString = api + '?name=' + play.id;
  fetch(apiString).then(response => response.json()).then(data => 
    {
    let playDataString = JSON.stringify(data)
    let playData = JSON.parse(playDataString);
    populatePlay(play,playData);
    displayAct(play, playData);
  }
  ).catch(error => console.error(error));
}


function populateInfo(ele)
{
    for (let play of playsData)
    {
      if (ele.getAttribute('data-id') == play.id)
      {
        getPlay(play);
      }
    }
    
}



function togglePlayView()
{
  let mListPlays = document.querySelector("#middleListPlays");
  let rListPlays = document.querySelector("#rightListPlays");
  let mPlayText = document.querySelector("#middlePlayText");
  let rPlayText = document.querySelector("#rightPlayText");

  if(mListPlays.style.display == "none")
  {
    mListPlays.style.display = "block";
    rListPlays.style.display = "block";
    mPlayText.style.display = "none";
    rPlayText.style.display = "none";
  }
  else
  {
    mPlayText.style.display = "block";
    rPlayText.style.display = "block";
    mListPlays.style.display = "none";
    rListPlays.style.display = "none";
  }

}

function clickEvent()
{
  document.querySelectorAll('section ul li').forEach(element => 
    {
      element.addEventListener('click', event => 
      {
        populateInfo(element);
      }
      )
    })
}