//START
function checkJSON(){
    var a = JSON.parse(localStorage.getItem("top-5-list"))
    if(a!=null)
    {return a}
    else
    return []
}
var objOfElements = {
    divHeadline: document.getElementById("headline"),
    divCatch: document.getElementById("catch"),
    divBoard: document.getElementById("board"),
    spanScore: document.getElementById("scoreTXT"),
    spanPtnl: document.getElementById("ptnlTXT"),
    spanLevel: document.getElementById("levelTXT"),
    spanMc: document.getElementById("mcTXT"),
    spanTimer: document.getElementById("timerTXT")
}
var objRightBoard = {
    score: 0,
    ptnl: 10,
    level: 1,
    missedC: 0,
    myJson: checkJSON()
}
var levelAtt = {
    secOfAnim: 2,
    milSecOfSpin: 300
}
var times = {
    j: 0,
    boardSec: 60,
    timerOn: 0
}
var objFuncs = {
    divCatchGameStart() {

        //stops start presentations
        objOfElements.divHeadline.removeEventListener("click", objFuncs.divCatchGameStart);
        objOfElements.divHeadline.removeEventListener("click", objFuncs.catchSpinStart)
        objOfElements.divHeadline.removeEventListener("mouseover", objFuncs.change);
        //new add events
        objOfElements.divCatch.addEventListener("mouseover", objFuncs.setJump)//can't use setJump as anonymous function because the function call at start and te event listener
        objOfElements.divCatch.addEventListener("click", objFuncs.scoreUp);
        objOfElements.divBoard.addEventListener("click", objFuncs.scoreDown);
        // timer bCount starts
        times.timerOn = setInterval(objFuncs.clockOn, 1000);
    }
    ,
    screenPlayerList() {
        for (let i = 0; i < objRightBoard.myJson.length; i++)
            if (objRightBoard.myJson[i]!=null)
                document.getElementById(`${i}`).innerHTML = `${objRightBoard.myJson[i].player_name}: ${objRightBoard.myJson[i].scores}
                <span class="dateDiv" id="dateOf${i}">0</span>
                `;
        for(let i=0;i<objRightBoard.myJson.length;i++)
                    if(objRightBoard.myJson[i].date)
                        document.getElementById(`dateOf${i}`).innerText = `${objRightBoard.myJson[i].date}`;
        
        var textArr = document.querySelectorAll(".hsTXT");
        var dateArr = document.querySelectorAll(".dateDiv");

        for (let i=0;i<5;i++) {
            textArr[i].addEventListener("mouseover",()=>{
                dateArr[i].style.visibility = "visible";
        })
        textArr[i].addEventListener("mouseleave",()=>{
            dateArr[i].style.visibility = "hidden";
        })
        }  
    }
    ,
    clockOn() {
        objOfElements.spanTimer.innerHTML = `${--times.boardSec}`;
        console.log("set Interval? at time: " + times.boardSec)
        if (times.boardSec == 0 || objRightBoard.level == 5) {
            clearInterval(times.timerOn);
            objFuncs.reset();
        }
        if (objRightBoard.ptnl == 0) {
            times.boardSec += (10 * objRightBoard.level);
            levelAtt.secOfAnim -= 0.25;
            levelAtt.milSecOfSpin -= 50;
            objOfElements.spanLevel.innerHTML = `${++objRightBoard.level}`;
            objOfElements.spanPtnl.innerHTML = `${objRightBoard.ptnl += 10}`;
            objFuncs.catchSpinStart();

        }

    }
    ,
    change() {
        objOfElements.divHeadline.innerHTML = `CLICK ME!`;
    }
    ,
    catchSpinStart() {
        //animation starts
        objOfElements.divCatch.style.animation = `divScale infinite ${levelAtt.secOfAnim}s linear`
    }
    ,
    setJump() {
        times.j = setTimeout(function () {
            objOfElements.divCatch.style.top = `${Math.random() * 568}px`;
            objOfElements.divCatch.style.left = `${Math.random() * 785}px`;
        }, levelAtt.milSecOfSpin)

    }
    ,
    reset() {
        objOfElements.divCatch.removeEventListener("mouseover", objFuncs.setJump)
        objOfElements.divCatch.removeEventListener("click", objFuncs.scoreUp);
        objOfElements.divBoard.removeEventListener("click", objFuncs.scoreDown);
        objOfElements.divCatch.style.top = `0`;
        objOfElements.divCatch.style.left = `0`;
        objOfElements.divCatch.style.animation = "";
        alert("Game Over! \n respect! youv'e reached level: " + objRightBoard.level + "\nwith: " + objRightBoard.score + " scores!")
        var p_n = prompt("name?")
        var new_p = {
            player_name: p_n,
            scores: `${objRightBoard.score}`,
            date: objFuncs.dateFunc()
        };
        // myJson don't get new players!!
        if (objRightBoard.myJson != null) {
            if (objRightBoard.myJson.length == 5) {
                for (let i = 0; i <= objRightBoard.myJson.length - 1; i++) {
                    if (new_p.scores > objRightBoard.myJson[i].scores) {
                        objRightBoard.myJson[i] = new_p;//need to add the new score with fit to whole scores
                        //and when it's fit, to change all the array
                        break;
                    }
                }
            }
            else { objRightBoard.myJson.push(new_p); }
        }
        else {
            objRightBoard.myJson = [new_p];
        }
        objFuncs.sortPlayers()
        objFuncs.JSONOrder();
        objFuncs.screenPlayerList();
        times.boardSec = 60;
        levelAtt.secOfAnim = 2;
        levelAtt.milSecOfSpin = 300;
        objRightBoard.score = 0;
        objRightBoard.ptnl = 10;
        objRightBoard.level = 1;
        objRightBoard.missedC = 0;
        objOfElements.spanLevel.innerHTML = `1`;
        objOfElements.spanPtnl.innerHTML = `10`;
        objOfElements.spanScore.innerHTML = `0`;
        objOfElements.spanMc.innerHTML=`0`;
        objOfElements.spanTimer=`60`;
        objOfElements.spanTimer.innerHTML=`60`;
        objOfElements.divHeadline.addEventListener("mouseover", objFuncs.change);
        objOfElements.divHeadline.addEventListener("click", objFuncs.catchSpinStart);
        objOfElements.divHeadline.addEventListener("click", objFuncs.divCatchGameStart);
    }
    ,
    scoreUp() {
        objOfElements.spanScore.innerHTML = `${objRightBoard.score += ((objRightBoard.level * 10) + objRightBoard.level)}`
        --objRightBoard.missedC//to solve the problem of clicks on div as board
        if (objRightBoard.ptnl != 0)
        objOfElements.spanPtnl.innerHTML = `${--objRightBoard.ptnl}`
    }
    ,
    scoreDown() {
        objOfElements.spanScore.innerHTML = `${objRightBoard.score -= objRightBoard.level}`
        objOfElements.spanMc.innerHTML = `${++objRightBoard.missedC}`
    }
    ,
    dateFunc() {
        var myDate = new Date;
        var formats = {
            year: "numeric",
            month: "numeric", day: "numeric"
        };
        return (myDate.toLocaleDateString("en", formats))
    }
    ,
    sortPlayers() {
        for (let y = 0; y < objRightBoard.myJson.length; y++) {
            for (let i = 0; i < objRightBoard.myJson.length; i++) {
                if (objRightBoard.myJson[y].scores > objRightBoard.myJson[i].scores) {
                    let temp = objRightBoard.myJson[y];
                    objRightBoard.myJson[y] = objRightBoard.myJson[i];
                    objRightBoard.myJson[i] = temp;
                }
            }
        }
    }
    ,
    JSONOrder() {
        var list = JSON.stringify(objRightBoard.myJson);//convert to JSON doc
        localStorage.setItem("top-5-list", list);
    }
}//objFuncs
//STOP
//headline definisions
objFuncs.screenPlayerList();
objOfElements.divHeadline.addEventListener("click", objFuncs.catchSpinStart)
objOfElements.divHeadline.addEventListener("click", objFuncs.divCatchGameStart);
objOfElements.divHeadline.addEventListener("mouseover", objFuncs.change);
objOfElements.divHeadline.addEventListener("mouseleave", function () { objOfElements.divHeadline.innerHTML = `CATCH ME IF YOU CAN!`; });