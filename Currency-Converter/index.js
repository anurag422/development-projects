const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");


for(let select of dropdowns) {
    for(currCode in countryList) {
        let newoption = document.createElement("option");
        newoption.innerText = currCode;
        newoption.value = currCode;
        if(select.name === "from" && currCode === "USD") {
            newoption.selected = "selected";
        }else if(select.name === "to" && currCode === "INR") {
            newoption.selected = "selected";
        }
        select.append(newoption);
    }

    select.addEventListener("change",(evt) => {
        updateFlag(evt.target);
    })
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}


btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

 const base = fromCurr.value.toLowerCase();
      const target = toCurr.value.toLowerCase();

      const URL = `${BASE_URL}/${base}.json`;
      try {
        console.log("Fetching:", URL);
        let response = await fetch(URL);
        if (!response.ok) throw new Error("Network response was not ok");

        let data = await response.json();
        console.log("Data:", data);

        let rate = data[base][target];
        if (rate === undefined) throw new Error("Target currency not found");

        let finalAmount = (amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
      } catch (error) {
        console.error("Error:", error);
        msg.innerText = "Conversion failed!";
      }
    });