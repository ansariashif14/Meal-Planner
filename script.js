const genrateBtn = document.querySelector("#btn");
const heightInput = document.querySelector(".height");
const weightInput = document.querySelector(".weight");
const ageInput = document.querySelector(".age");
const genderInput = document.querySelector(".gender");
const activityInput = document.querySelector(".activity");

const heightWarning = document.querySelector(".warning-height");
const weightWarning = document.querySelector(".warning-weight");
const ageWarning = document.querySelector(".warning-age");
const genderWarning = document.querySelector(".warning-gender");
const activityWarning = document.querySelector(".warning-activity");

const menuCard = document.querySelector(".dummy-meal");
const ingredientContainer = document.querySelector(".ingredientContainer");



const url = {
  base: "https://api.spoonacular.com/mealplanner/generate",
  apiKey: "1219d49bfdf9450ea4467c61f4e89f82"
};

const imageUrl = {
  base: "https://webknox.com/recipeImages/",
  size: "-556x370",
};

let Url = "https://api.spoonacular.com/mealplanner/generate?apiKey=1219d49bfdf9450ea4467c61f4e89f82&timeFrame=day";

function takeTheValues() {
  /*-------------warning message start-----------------*/
  heightWarning.removeAttribute("id");
  weightWarning.removeAttribute("id");
  ageWarning.removeAttribute("id");
  genderWarning.removeAttribute("id");
  activityWarning.removeAttribute("id");

  if (heightInput.value === "") {
    heightWarning.setAttribute("id", "warning-highlite");
    return;
  }

  if (weightInput.value === "") {
    weightWarning.setAttribute("id", "warning-highlite");
    return;
  }

  if (ageInput.value === "") {
    ageWarning.setAttribute("id", "warning-highlite");
    return;
  }

  if (genderInput.value === "none") {
    genderWarning.setAttribute("id", "warning-highlite");
    return;
  }

  if (activityInput.value === "none") {
    activityWarning.setAttribute("id", "warning-highlite");
    return;
  }
  /*-------------warning message end-----------------*/

  /*-------------calories calculater start-----------------*/
  let BMR;

  switch (genderInput.value) {
    case "f":
      BMR =
        655.1 +
        9.563 * Number(weightInput.value) +
        1.85 * Number(heightInput.value) -
        4.676 * Number(ageInput.value);
      break;
    case "m":
      BMR =
        66.47 +
        13.75 * Number(weightInput.value) +
        5.003 * Number(heightInput.value) -
        6.755 * Number(ageInput.value);
      break;
    default:
      BMR = 0;
      break;
  }

  let BMRmultiplier;
  switch (activityInput.value) {
    case "1":
      BMRmultiplier = Math.round(BMR * 1.375);
      break;
    case "2":
      BMRmultiplier = Math.round(BMR * 1.55);
      break;
    default:
      BMRmultiplier = Math.round(BMR * 1.725);
      break;
  }
  // sessionStorage.setItem("calories", BMRmultiplier.toString());
  getTheDate(BMRmultiplier);
  weightInput.value = null;
  heightInput.value = null;
  ageInput.value = null;
  genderInput.value = "none";
  activityInput.value = "none";
  /*-------------calories calculater end-----------------*/
}

async function getTheDate(cal) {
  let tempUrl;
  if (cal) {
    tempUrl = Url+`&targetCalories=${cal}`;
  } else {
    tempUrl = Url;
  }
  try {
    const req = await fetch(tempUrl);
    const res = await req.json();
    // console.log(res);
    mealPlanMuneCard(res.meals);
  } catch (error) {
    console.log(error);
  }
}


  getTheDate(0);

let mealTime = ["BREAKFAST", "LUNCH", "DINNER"];

function mealPlanMuneCard(arr) {
  if (document.querySelector(".meals") !== null) {
    document.querySelector(".meals").remove();
  }
  let mealContainer = document.createElement("div");
  let mealId = [];
  mealContainer.classList = "meals";
  arr.map((item, index) => {
    mealId.push(item.id);
    let mainContainer = document.createElement("div");
    mainContainer.classList = "mainContainer";
    let main = document.createElement("div");
    main.classList = "meal";
    main.setAttribute("id", `d${item.id}`);
    let heading = document.createElement("h3");
    heading.innerText = mealTime[index];
    let image = document.createElement("img");
    image.src = `${imageUrl.base}${item.id}${imageUrl.size}.${item.imageType}`;
    image.classList = "showImage";
    image.alt = `${item.id}`;
    image.setAttribute("id", `i${item.id}`);

    let title = document.createElement("p");
    title.classList = "imageClass";
    title.innerText = item.title;
    title.setAttribute("id", `p${item.id}`);

    let nutritionDisplay = document.createElement("p");
    nutritionDisplay.classList = "imageClass colories";
    const fetchCalories = async () => {
      try {
        const nutrition = await fetch(
          `https://api.spoonacular.com/recipes/${item.id}/nutritionWidget.json?apiKey=${url.apiKey}`
        );
        const resNutrition = await nutrition.json();
        nutritionDisplay.innerText = `Calories - ${resNutrition.calories.slice(
          0,
          -1
        )}`;
      } catch (error) {
        console.log(error);
      }
    };
    fetchCalories();
    let anchor = document.createElement("a");
    let link = document.createTextNode("GET RECIPE");
    anchor.setAttribute("href", item.sourceUrl);
    anchor.setAttribute("target", "_blank");
    anchor.classList = "anchorName";
    let subAnchor = document.createElement("div");
    subAnchor.classList = "borderAnchor";
    subAnchor.appendChild(anchor);
    anchor.appendChild(link);
    mainContainer.appendChild(heading);
    main.appendChild(image);
    main.appendChild(title);
    main.appendChild(nutritionDisplay);
    main.appendChild(subAnchor);
    mainContainer.appendChild(main);
    mealContainer.appendChild(mainContainer);
    menuCard.appendChild(mealContainer);
    mealIngredientsCard(mealId, main);
  });
  fetchForFirstTime(mealId[0], "ingredientWidget");
  setTimeout(() => {
    fetchForFirstTime(mealId[0], "equipmentWidget");
  }, 2000);
}

function mealIngredientsCard(id, mainDiv) {
  // console.log(id);
  mainDiv.addEventListener("click", async (e) => {
    console.log(e.target.id.slice(1));
    fetchForFirstTime(e.target.id.slice(1), "ingredientWidget");
    setTimeout(() => {
      fetchForFirstTime(e.target.id.slice(1), "equipmentWidget");
    }, 2000);
    e.stopPropagation();
  });
}

function fetchForFirstTime(id, urlQuary) {
  // console.log(id);
  const fetchTheData = async () => {
    try {
      const req = await fetch(
        `https://api.spoonacular.com/recipes/${id}/${urlQuary}.json?apiKey=${url.apiKey}`
      );
      const res = await req.json();
      if (urlQuary === "ingredientWidget") {
        createSectionForIngredients(res["ingredients"], "ingredients");
        // console.log(res["ingredients"]);
      } else {
        forEquipments(res["equipment"]);
        // console.log(res["equipment"]);
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  };
  fetchTheData();
}

function createSectionForIngredients(arr, checkCondition) {
  if (document.querySelector(".ingredients") !== null) {
    document.querySelector(".ingredients").remove();
  }
  const ingDiv = document.createElement("div");
  ingDiv.classList = "ingredients";
  setTimeout(() => {
    if (checkCondition === "ingredients") {
      createListForMeal(arr, ingDiv, "ingredient", "Ingredients", "name");
      createListForMeal(arr, ingDiv, "step", "Steps", "amount");
    } else {
      createListForMeal(arr, ingDiv, "equipment", "Equipments", "name");
    }
  }, 1000);

  ingredientContainer.append(ingDiv);
}

function forEquipments(arr) {
  const ingDiv = document.querySelector(".ingredients");
  createListForMeal(arr, ingDiv, "equipment", "Equipments", "name");
}

function createListForMeal(arr, ingDiv, id, text, obj) {
  console.log(arr);
  const ingredient = document.createElement("div");
  ingredient.classList = id + " givePadding";
  const h4Tag = document.createElement("h4");
  h4Tag.innerText = text;
  const unOrderedList = document.createElement("ul");
  if(arr.length > 0){
    arr.map((item, index) => {
      const li = document.createElement("li");
      if (obj === "name") {
        li.innerText =
          item["name"].charAt(0).toUpperCase() + item["name"].slice(1);
      } else {
        li.innerText = `${item["amount"]["us"]["value"]} ${item["amount"]["us"]["unit"]}`;
      }
      unOrderedList.appendChild(li);
    });
  } else {
    li.innerText = `No Data Available`;
    unOrderedList.appendChild(li);
  }
  
  const dummyDiv = document.createElement("div");
  dummyDiv.classList = "checkOver-flow";
  dummyDiv.appendChild(unOrderedList);
  ingredient.appendChild(h4Tag);
  ingredient.appendChild(dummyDiv);
  ingDiv.appendChild(ingredient);
}
genrateBtn.addEventListener("click", takeTheValues);
