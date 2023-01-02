const height = document.getElementById("height");
const weight = document.getElementById("weight");
const age = document.getElementById("age");
const gender = document.getElementById("gender");
const activity = document.getElementById("activity");
const generateMealBtn = document.getElementById("btn");
const box_1 = document.getElementsByClassName("box1");


generateMealBtn.addEventListener('click', async function () {

    const fetch = await fetchMealFromApi();
    console.log(fetch);
    
})

async function fetchMealFromApi() {
    let bmrMale = 66.47 + (13.75 * weight.value) + (5.003 * height.value) - (6.755 * age.value);
    let bmrFemale = 655.1 + (9.563 * weight.value) + (1.850 * height.value) - (4.676 * age.value);
    if (gender.value === "male" && activity.value === "light") {
        var calories = bmrMale * 1.375;
    }
    else if (gender.value === "male" && activity.value === "moderate") {
        var calories = bmrMale * 1.55;
    }
    else if (gender.value === "male" && activity.value === "active") {
        var calories = bmrMale * 1.725;
    }
    else if (gender.value === "female" && activity.value === "light") {
        var calories = bmrFemale * 1.375;
    }
    else if (gender.value === "female" && activity.value === "moderate") {
        var calories = bmrFemale * 1.55;
    }
    else if (gender.value === "female" && activity.value === "active") {
        var calories = bmrFemale * 1.725;
    }
    const url = `https://api.spoonacular.com/mealplanner/generate?apiKey=4351c5d4070344ccbde7eda659f6134c&timeFrame=day&targetCalories=${calories}`;
    const resp = await fetch(url);
    const respData = await resp.json();
    return respData;
}
