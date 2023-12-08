var puzzle_number = Math.floor((Date.now() - 1651964400000) / 86400000);
puzzle_number = puzzle_number - (250*Math.floor(puzzle_number/250));


if (localStorage.getItem("storedstate") == null) {
    storedstate = {"guesses": [], "completed": "no", "score": [0, 0, 0, 0, 0], "totalplayed": 0};
    localStorage.setItem("puzzle_number", puzzle_number);
    localStorage.setItem("storedstate", JSON.stringify(storedstate));
    first_load = 1;
    loadData();
} else {
    storedstate = JSON.parse(localStorage.getItem("storedstate"));
    first_load = 0;
    loadData();
}

async function loadData() {
    const response = await fetch('Database_v025.json');
    const testdata = await response.json();
    if (puzzle_number != localStorage.getItem("puzzle_number")) {
        storedstate.guesses = [];
        storedstate.completed = "no";
        localStorage.setItem("storedstate", JSON.stringify(storedstate));   
    }
    localStorage.setItem("puzzle_number", puzzle_number);
    var obj = JSON.parse(JSON.stringify(testdata[puzzle_number]));
    document.getElementById("clue1").innerHTML = obj.Clue1;
    document.getElementById("clue2").innerHTML = obj.Clue2;
    document.getElementById("clue3").innerHTML = obj.Clue3;
    document.getElementById("clue4").innerHTML = obj.Solution.length;
    document.getElementById("clue5").innerHTML = obj.Solution[0];
    guess_count = 1;
    if (storedstate.completed == "yes") {
        for (let i = 0; i < (storedstate.guesses.length) - 1; i++) {
            wrongGuess(1);
            histVar = 'history' + (i+1);
            document.getElementById(histVar).innerHTML = (i+1) + '. ' + storedstate.guesses[i];
        }
        rightGuess(1);
        j = storedstate.guesses.length;
        histVar = 'history' + j;
        document.getElementById(histVar).innerHTML = j + '. ' + storedstate.guesses[j-1]; 
    } else {
        for (let i = 0; i < (storedstate.guesses.length); i++) {
            wrongGuess(1);
            histVar = 'history' + (i+1);
            document.getElementById(histVar).innerHTML = (i+1) + '. ' + storedstate.guesses[i];
        }
    }
    updateStats();
    isLoading = 0;
    if (storedstate.totalplayed == 0) {
        document.getElementById("first_help").style.visibility = "visible";
        document.getElementById("first_help").style.opacity = 1;
        document.getElementById("help_button").style.backgroundColor = "#fc613a";
    }
}

function updateStats() {
    sum = 0;
    totalwon = 0;
    for (let i = 0; i < 5; i++) {
        statVar = 'stats' + (i+1);
        document.getElementById(statVar).innerHTML = storedstate.score[i];
        sum += storedstate.score[i] * (i+1);
    }
    for (let i = 0; i < 5; i++){
        totalwon += storedstate.score[i];
    }
    winpct = (totalwon / storedstate.totalplayed) * 100;
    totallost = storedstate.totalplayed - totalwon;
    
    sum += (totallost * 6);
    if (storedstate.totalplayed > 0) {
        avg_score = sum / storedstate.totalplayed;
        document.getElementById('statsAvg').innerHTML = avg_score.toFixed(2);
        document.getElementById('stats_totalwon').innerHTML = totalwon;
        document.getElementById('stats_totalplayed').innerHTML = storedstate.totalplayed;
        document.getElementById('statsWinpct').innerHTML = winpct.toFixed();
        document.getElementById('statsl').innerHTML = totallost;
    } else {
        document.getElementById('statsAvg').innerHTML = 'N/A'
    }
    modeScore = Math.max.apply(Math, storedstate.score);
    for (let i = 0; i < 5; i++){
        barVar = 'stats_bar' + (i+1);
        if (storedstate.score[i] != 0) {
            heightvar = (storedstate.score[i] / modeScore) * 350;
            document.getElementById(barVar).style.height = heightvar + "%";
            document.getElementById(barVar).style.top = (626 + (1220 - heightvar)/2) + "%";
        }
    if (totallost > 0) {
        heightvarL = (totallost / modeScore) * 350;
        document.getElementById('stats_barl').style.height = heightvarL + "%";
        document.getElementById('stats_barl').style.top = (626 + (1220 - heightvarL)/2) + "%";
    }
    }
}

window.onkeydown = function(event) {
    if (event.keyCode == 13) {
        if (document.getElementById('guess').value.length != 0) {
            getVal();
        } else {
            document.getElementById('guess').style.backgroundColor = "rgb(255, 87, 87)";
        }
    }
}

const previous_guesses = [];

async function wrongGuess(isLoading) {
    const response = await fetch('Database_v025.json');
    const testdata = await response.json();
    var obj = JSON.parse(JSON.stringify(testdata[puzzle_number]));
    lightvar = 'light' + guess_count.toString();
    clue_count = guess_count + 1;
    cluevar = 'clue' + clue_count.toString();
    clueiconvar = 'clue' + clue_count.toString() + '_icon';
    document.getElementById(lightvar).style.backgroundColor = "#f12323";
    document.getElementById(lightvar).style.backgroundColor = "#ff3b3b";
    if (guess_count == 5) {
        document.getElementById('guess').readOnly = true;
        document.getElementById('answer').style.visibility = "visible";
        document.getElementById('answer').style.opacity = 1;
        document.getElementById('share_button').style.visibility = "visible";
        document.getElementById('share_button').style.opacity = 1;
        document.getElementById('answer').innerHTML = obj.Solution;
        document.getElementById('guess').blur();
        document.getElementById('answer').style.color = "#ff3b3b";
        document.getElementById('background_panel').style.backgroundColor = "#ff3b3b";
        lights = document.getElementsByClassName('light');
        clueicons = document.getElementsByClassName('clue_icon');
        for (let j = 0 ; j < lights.length ; j++) {
            lights[j].style.backgroundColor = "#ff3b3b";
            clueicons[j].style.color = "#ff3b3b";
        }
        if (isLoading == 0) {
            storedstate.totalplayed = storedstate.totalplayed + 1;
            localStorage.setItem("storedstate", JSON.stringify(storedstate));
        }
        document.getElementById('title_color').style.color = "  #ff3b3b";
        scoreshare = "";
        for (let i = 0; i < 5 ; i++) {
            scoreshare = scoreshare.concat(String.fromCodePoint(0x1F534));
        }
    } else {
        document.getElementById(cluevar).style.visibility = "visible";
        document.getElementById(cluevar).style.opacity = 1;
        document.getElementById(clueiconvar).style.color = "rgb(87, 134, 215)";
        nextlightvar = 'light' + clue_count.toString();
        document.getElementById(nextlightvar).style.backgroundColor = "var(--color3)"
    }
    if (guess_count == 4) {
        if (obj.Clue1_BA == "B") {
            document.getElementById("clue1").innerHTML = obj.Clue1 + " _"
        } else {
            document.getElementById("clue1").innerHTML = "_ " + obj.Clue1
        }
        if (obj.Clue2_BA == "B") {
            document.getElementById("clue2").innerHTML = obj.Clue2 + " _"
        } else {
            document.getElementById("clue2").innerHTML = "_ " + obj.Clue2
        }
        if (obj.Clue3_BA == "B") {
            document.getElementById("clue3").innerHTML = obj.Clue3 + " _"
        } else {
            document.getElementById("clue3").innerHTML = "_ " + obj.Clue3
        }
    }
    guess_count = guess_count + 1;
    updateStats();
}

async function rightGuess(isLoading) {
    const response = await fetch('Database_v025.json');
    const testdata = await response.json();
    var obj = JSON.parse(JSON.stringify(testdata[puzzle_number]));
    lightvar = 'light' + guess_count.toString();
    document.getElementById('guess').readOnly = true;
    document.getElementById('answer').style.visibility = "visible";
    document.getElementById('answer').style.opacity = 1;
    document.getElementById('answer').innerHTML = obj.Solution;
    document.getElementById('answer').style.color = 'rgb(131, 205, 100)';
    document.getElementById('background_panel').style.backgroundColor = 'rgb(131, 205, 100)';
    document.getElementById('share_button').style.visibility = "visible";
    document.getElementById('share_button').style.opacity = 1;
    storedstate.completed = "yes";
    localStorage.setItem("storedstate", JSON.stringify(storedstate));
    document.getElementById('guess').blur();
    if (isLoading == 0) {
        storedstate.score[guess_count - 1] = storedstate.score[guess_count - 1] + 1;
        storedstate.totalplayed = storedstate.totalplayed + 1;
        localStorage.setItem("storedstate", JSON.stringify(storedstate));
    }
    scoreshare = "";
    if (guess_count > 1) {
        for (let i = 0; i < guess_count - 1; i++) {
            scoreshare = scoreshare.concat(String.fromCodePoint(0x1F534));
        }
    }
    scoreshare = scoreshare.concat(String.fromCodePoint(0x1F7E2));
    for (let i = 0; i < (5 - guess_count); i++) {
        scoreshare = scoreshare.concat(String.fromCodePoint(0x26AB));
    }
    for (let i = 1; i < 6; i++) {
        cluevar = 'clue' + i;
        document.getElementById(cluevar).style.visibility = "visible";
        document.getElementById(cluevar).style.opacity = 1;
    }
    lights = document.getElementsByClassName('light');
    clueicons = document.getElementsByClassName('clueicon');
    for (let i = 0; i < guess_count; i++) {
        lightvar = 'light' + (i+1);
        clueiconvar = 'clue' + (i+1) + '_icon';
        document.getElementById(lightvar).style.backgroundColor = "rgb(131, 205, 100)";
        document.getElementById(clueiconvar).style.color = "rgb(131, 205, 100)";
    }
    document.getElementById('title_color').style.color = "rgb(131, 205, 100)";
    updateStats();
}

async function getVal() {
    const response = await fetch('Database_v025.json');
    const testdata = await response.json();
    var obj = JSON.parse(JSON.stringify(testdata[puzzle_number]));
    const guess = document.getElementById('guess').value;
    document.getElementById('guess').value = '';
    lightvar = 'light' + guess_count.toString();
    previous_guesses.push(guess);
    document.getElementById('guess').style.backgroundColor = "transparent";
    history_count = guess_count;
    historyvar = 'history' + history_count.toString();
    historyinput = history_count + '. ' + guess;
    document.getElementById(historyvar).innerHTML = historyinput;
    storedstate.guesses[history_count - 1] = guess;
    localStorage.setItem("storedstate", JSON.stringify(storedstate) );
    guessNoSpaces = guess.replace(/ /g, '');

    if (guessNoSpaces.toLowerCase() == obj.Solution.toLowerCase()) {
        rightGuess(0);
        document.getElementById('guess').blur();
    } else {
        wrongGuess(0);
        document.getElementById('guess').focus();
    }
}

function returnFalse() {
    return false;
}


var history_shown = 0;
var help_shown = 0;
var stats_shown = 0;
function toggleHistory() {
    var history = document.getElementById('history_container');
    var button = document.getElementById('history_button');
    var containers = document.getElementsByClassName('text_container');
    document.getElementById('close_cover').style.visibility = 'visible';
    document.getElementById('close_cover').style.opacity = 1;
    for (let i = 0; i < containers.length -1; i++) {
        containers[i].style.opacity = 0;
        containers[i].style.visibility = "hidden";
    }
    var buttons = document.getElementsByClassName('button');
    for (let i = 0; i < buttons.length - 1; i++) {
        buttons[i].style.borderRadius = "8px";
        help_shown = 0;
        stats_shown = 0;
    }
    if (history_shown == 0) {
        button.style.borderBottomLeftRadius = "0px";
        button.style.borderBottomRightRadius = "0px";
        history.style.visibility = "visible";
        history.style.opacity = 1;
        history_shown = 1;
    } else {
        history.style.opacity = 0;
        history.style.visibility = "hidden";
        button.style.borderBottomLeftRadius = "8px";
        button.style.borderBottomRightRadius = "8px";
        history_shown = 0;
        document.getElementById('close_cover').style.visibility = 'hidden';
        document.getElementById('close_cover').style.opacity = 0;
    }
}

var slide_counter = 1;

function toggleHelp() {
    closeFirstHelp();
    var help = document.getElementById('help_container');
    var button = document.getElementById('help_button');
    var dimmer = document.getElementById('help_dimmer');
    var historybutton = document.getElementById('history_button');
    var history = document.getElementById('history_container');
    history.style.opacity = 0;
    history.style.visibility = "hidden";
    historybutton.style.borderBottomLeftRadius = "8px";
    historybutton.style.borderBottomRightRadius = "8px";
    history_shown = 0;
    var containers = document.getElementsByClassName('text_container');
    for (let i = 0; i < containers.length - 1; i++) {
        containers[i].style.opacity = 0;
        containers[i].style.visibility = "hidden";
    }
    var buttons = document.getElementsByClassName('button');
    for (let i = 0; i < buttons.length - 1; i++) {
        buttons[i].style.borderRadius = "8px";
        history_shown = 0;
        stats_shown = 0;
    }
    if (help_shown == 0) {
        button.style.borderBottomLeftRadius = "0px";
        button.style.borderBottomRightRadius = "0px";
        help.style.visibility = "visible";
        help.style.opacity = 1;
        dimmer.style.visibility = "visible";
        dimmer.style.opacity = "75%";
        dimmer.style.pointerEvents = "auto";
        dimmer.style.zIndex = 10;
        historybutton.style.zIndex = 4;
        help_shown = 1;
    } else {
        help.style.opacity = 0;
        help.style.visibility = "hidden";
        button.style.borderBottomLeftRadius = "8px";
        button.style.borderBottomRightRadius = "8px";
        dimmer.style.visibility = "hidden";
        dimmer.style.opacity = 0;
        dimmer.style.pointerEvents = "none";
        dimmer.style.zIndex = 10;
        historybutton.style.zIndex = 4;
        help_shown = 0;
        document.getElementById('close_cover').style.visibility = 'hidden';
        document.getElementById('close_cover').style.opacity = 0;
    }
}


function nextSlide() {
    var slide_before = document.getElementById("help_slide" + slide_counter);
    var count_before = document.getElementById("slide_count" + slide_counter);
    slide_counter = slide_counter + 1;
    var slide_after = document.getElementById("help_slide" + slide_counter);
    var count_after = document.getElementById("slide_count" + slide_counter);

    slide_before.style.visibility = "hidden";
    slide_before.style.opacity = 0;
    document.getElementById("prev_arrow").style.visibility = "visible";
    document.getElementById("prev_arrow").style.opacity = 1;
    count_before.style.backgroundColor = "black";

    slide_after.style.visibility = "visible";
    slide_after.style.opacity = 1;
    count_after.style.backgroundColor = "var(--color2)"

    if (slide_counter == 13) {
        document.getElementById("next_arrow").style.visibility = "hidden";
        document.getElementById("next_arrow").style.opacity = 0;
    }
}

function prevSlide() {
    var slide_before = document.getElementById("help_slide" + slide_counter);
    var count_before = document.getElementById("slide_count" + slide_counter);
    slide_counter = slide_counter - 1;
    var slide_after = document.getElementById("help_slide" + slide_counter);
    var count_after = document.getElementById("slide_count" + slide_counter);

    slide_before.style.visibility = "hidden";
    slide_before.style.opacity = 0;
    document.getElementById("next_arrow").style.visibility = "visible";
    document.getElementById("next_arrow").style.opacity = 1;
    count_before.style.backgroundColor = "white";

    slide_after.style.visibility = "visible";
    slide_after.style.opacity = 1;
    count_after.style.backgroundColor = "var(--color2)"

    if (slide_counter == 1) {
        document.getElementById("prev_arrow").style.visibility = "hidden";
        document.getElementById("prev_arrow").style.opacity = 0;
    }
}




function toggleStats() {
    var stats = document.getElementById('stats_container');
    var button = document.getElementById('stats_button');
    var containers = document.getElementsByClassName('text_container');
    document.getElementById('close_cover').style.visibility = 'visible';
    document.getElementById('close_cover').style.opacity = 1;
    for (let i = 0; i < containers.length -1; i++) {
        containers[i].style.opacity = 0;
        containers[i].style.visibility = "hidden";
    }
    var buttons = document.getElementsByClassName('button');
    for (let i = 0; i < buttons.length - 1; i++) {
        buttons[i].style.borderRadius = "8px";
        history_shown = 0;
        help_shown = 0;
    }
    if (stats_shown == 0) {
        button.style.borderBottomLeftRadius = "8px";
        button.style.borderBottomRightRadius = "8px";
        stats.style.visibility = "visible";
        stats.style.opacity = 1;
        stats_shown = 1;
    } else {
        stats.style.opacity = 0;
        stats.style.visibility = "hidden";
        button.style.borderBottomLeftRadius = "8px";
        button.style.borderBottomRightRadius = "8px";
        button.style.backgroundColor = "white"
        stats_shown = 0;
        document.getElementById('close_cover').style.visibility = 'hidden';
        document.getElementById('close_cover').style.opacity = 0;
    }
}


function textFocus() {
    document.getElementById('guess').style.backgroundColor = "transparent";
    closeFirstHelp();
}

function closeAll() {
    allcontainers = document.getElementsByClassName('text_container');
    allbuttons = document.getElementsByClassName('button');
    for (let i = 0; i < allcontainers.length - 1; i++) {
        allcontainers[i].style.opacity = 0;
        allcontainers[i].style.visibility = "hidden";
        allbuttons[i].style.borderRadius = '8px';
    }
    document.getElementById('close_cover').style.visibility = 'hidden';
    document.getElementById('close_cover').style.opacity = 0;
    history_shown = 0;
    stats_shown = 0;
}

function closeFirstHelp() {
    document.getElementById("first_help").style.opacity = 0;
    document.getElementById("first_help").style.visibility = "hidden";
    document.getElementById("help_button").style.backgroundColor = "white";

}   

