let userscore=0;
let computerscore = 0;


let choices = document.querySelectorAll(".choice");
let msg = document.querySelector("#msg");
let userscorepara = document.querySelector("#user-score");
let computerscorepara = document.querySelector("#computer-score");
let move = document.querySelector(".move");


let gamedraw = ()=>{
    msg.innerText="game is draw";
    move.style.backgroundColor="red";
}

let gencomputerchoice = ()=>{
    let option=["stone","papper","sciccors"];
    let index=Math.floor(Math.random()*3);
    return option[index];
}

let showWinner = (userwin)=>{
    if(userwin == true)
    {
        userscore++;
        userscorepara.innerText=userscore;
        msg.innerText="you win";
        move.style.backgroundColor="green";
    }
    else{
        computerscore++;
        computerscorepara.innerText=computerscore;
        msg.innerText="you lost";
        move.style.backgroundColor="blue";
    }
}

let playgame = (userchoice)=>{
    let computerchoice = gencomputerchoice();

    if(userchoice == computerchoice)
    {
        gamedraw();
    }
    else
    {
        let userwin = true;
        if(userchoice == "stone")
        {
            userwin = computerchoice === "papper" ? false : true;
        }
        else if(userchoice == "papper")
        {
            userwin = computerchoice === "sciccors" ? false : true;
        }
        else if(userchoice == "sciccors")
        {
            userwin = computerchoice === "stone" ? false : true;
        }
        showWinner(userwin);
    }
}

choices.forEach((choice)=>{
    choice.addEventListener("click",()=>{
        let userchoice = choice.getAttribute("id");
        playgame(userchoice);
    })
})