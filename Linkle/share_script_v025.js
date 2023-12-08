const shareButton = document.getElementById('share_button');

scoreshare = "";
storedstate = JSON.parse(localStorage.getItem("storedstate"));

shareButton.addEventListener('click', async function() {
    
    if (localStorage.getItem("storedstate") != null) {
        guess_count = storedstate.guesses.length;
        scoreshare = "";
        if (guess_count > 1) {
            for (let i = 0; i < guess_count - 1; i++) {
                scoreshare = scoreshare.concat(String.fromCodePoint(0x1F534));
            }
        }
        if (storedstate.completed == "no") {
            scoreshare = scoreshare + (String.fromCodePoint(0x1F534));
        } else {
            scoreshare = scoreshare + (String.fromCodePoint(0x1F7E2));
        }
        for (let i = 0; i < (5 - guess_count); i++) {
            scoreshare = scoreshare + (String.fromCodePoint(0x26AB)); 
        }
        for (let i = 1; i < 6; i++) {
            cluevar = 'clue' + i;
            document.getElementById(cluevar).style.visibility = "visible";
            document.getElementById(cluevar).style.opacity = 1;
        }
    }
    cbs = document.getElementById('clipboard_success');
    if (storedstate.completed == "no") {
        shareValue = "Linkle #" + puzzle_number + " - " + "X/5 \n" + scoreshare + "\n \n https://linkle.uk";
    } else {
        shareValue = "Linkle #" + puzzle_number + " - " + guess_count + "/5 \n" + scoreshare + "\n \n https://linkle.uk";
    }
    if (navigator.share) {
        cbs = document.getElementById('clipboard_success');
        try {
            await navigator.share({text: shareValue});
        } catch(err) {
            cbs.style.opacity = 1;
            cbs.style.visibility = "visible";
            cbs.style.backgroundColor = "#ff3b3b";
            cbs.innerHTML = "Share Failed";
            setTimeout(() => {
                document.getElementById('clipboard_success').style.opacity = 0;
                document.getElementById('clipboard_success').style.visibility = "hidden";
            }, 2000);
        }     
    } else {
        navigator.clipboard.writeText(shareValue);
        cbs = document.getElementById('clipboard_success');    
        cbs.style.backgroundColor = 'rgb(131, 205, 100)';
        cbs.style.opacity = 1;
        cbs.style.visibility = "visible";
        setTimeout(() => {
            document.getElementById('clipboard_success').style.opacity = 0;
            document.getElementById('clipboard_success').style.visibility = "hidden";
        }, 2000);
    }
});

const shareStats = document.getElementById('stats_share_button');

shareStats.addEventListener('click', async function() {
    sum = 0;
    totalwon = 0;
    for (let i = 0; i < 5; i++) {
        sum += storedstate.score[i] * (i+1);
    }
    for (let i = 0; i < storedstate.score.length; i++){
        totalwon += storedstate.score[i];
    }
    winpct = (totalwon / storedstate.totalplayed) * 100;
    totallost = storedstate.totalplayed - totalwon;
    sum += (totallost * 6);
    if (storedstate.totalplayed > 0) {
        avg_score = sum / storedstate.totalplayed;
        avgScore = avg_score.toFixed(2);
        totalWon = totalwon;
        totalPlayed = storedstate.totalplayed;
        winPct = winpct.toFixed();
    } else {
        winPct = 'N/A';
        avgScore = 'N/A';
    }

    scoreArray1 = "\n1st: " + storedstate.score[0] + "  2nd: " + storedstate.score[1] + "  3rd: " + storedstate.score[2] 
    scoreArray2 = "\n4th: " + storedstate.score[3] + " 5th: " + storedstate.score[4] + " Lost: " + (totalPlayed - totalWon);
    scoreArray = scoreArray1 + scoreArray2;

    statsValue = 'My Linkle Stats\n\n' + 'Played: ' + totalPlayed + '\nWon: ' + totalWon + '\nWin %: ' + winPct + '%\n' + scoreArray + '\n\nGuess Average: ' + avgScore + '\n\n https://linkle.uk';
    if (navigator.share) {
        cbs = document.getElementById('stats_clipboard_success');
        try {
            await navigator.share({text: statsValue});
        } catch(err) {
            cbs.style.opacity = 1;
            cbs.style.visibility = "visible";
            cbs.style.backgroundColor = "#ff3b3b";
            cbs.innerHTML = "Share Failed";
            setTimeout(() => {
                cbs.style.opacity = 0;
                cbs.style.visibility = "hidden";
            }, 2000);
        }     
    } else {
        cbs = document.getElementById('stats_clipboard_success');
        navigator.clipboard.writeText(statsValue);  
        cbs.style.backgroundColor = 'rgb(131, 205, 100)';
        cbs.style.opacity = 1;
        cbs.style.visibility = "visible";
        setTimeout(() => {
            cbs.style.opacity = 0;
            cbs.style.visibility = "hidden";
        }, 2000);
    }
});
