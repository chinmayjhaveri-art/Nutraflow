// ==========================
// NUTRAFLOW V2
// ==========================

const API_KEY = "PASTE_YOUR_NEW_USDA_API_KEY_HERE";

const input = document.getElementById("foodInput");
const result = document.getElementById("result");

const foodName = document.getElementById("foodName");
const calories = document.getElementById("calories");
const protein = document.getElementById("protein");
const carbs = document.getElementById("carbs");
const sugar = document.getElementById("sugar");
const fiber = document.getElementById("fiber");
const score = document.getElementById("score");
const tip = document.getElementById("tip");

const proteinBar = document.getElementById("proteinBar");
const carbBar = document.getElementById("carbBar");
const fiberBar = document.getElementById("fiberBar");

const favoriteBtn = document.getElementById("favoriteBtn");
const darkModeBtn = document.getElementById("darkModeBtn");

// ==========================
// DARK MODE
// ==========================

darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// ==========================
// ENTER KEY SEARCH
// ==========================

input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchFood();
    }
});

// ==========================
// QUICK SEARCH
// ==========================

function quickSearch(food){
    input.value = food;
    searchFood();
}

// ==========================
// FAVORITES
// ==========================

let saved = false;

favoriteBtn.addEventListener("click", () => {

    saved = !saved;

    if(saved){
        favoriteBtn.textContent = "❤️ Saved";
    }else{
        favoriteBtn.textContent = "🤍 Save";
    }

});

// ==========================
// SEARCH FUNCTION
// ==========================

async function searchFood(){

    const query = input.value.trim();

    if(query === ""){
        alert("Please enter a food.");
        return;
    }

    result.style.display = "block";

    foodName.textContent = "Searching...";

    try{

        const response = await fetch(
            `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=1&api_key=${API_KEY}`
        );

        if(!response.ok){
            throw new Error("Request failed");
        }

        const data = await response.json();

        if(!data.foods || data.foods.length===0){

            foodName.textContent="Food not found";
            tip.textContent="Try another search.";

            return;

        }

        const food = data.foods[0];

        let nutrients = {};

        food.foodNutrients.forEach(n=>{
            nutrients[n.nutrientName]=n.value || 0;
        });
                const cal = Math.round(nutrients["Energy"] || 0);
        const prot = +(nutrients["Protein"] || 0).toFixed(1);
        const carb = +(nutrients["Carbohydrate, by difference"] || 0).toFixed(1);
        const sug = +(nutrients["Sugars, total including NLEA"] || 0).toFixed(1);
        const fib = +(nutrients["Fiber, total dietary"] || 0).toFixed(1);

        // Display nutrition
        foodName.textContent = food.description;
        calories.textContent = cal + " kcal";
        protein.textContent = prot + " g";
        carbs.textContent = carb + " g";
        sugar.textContent = sug + " g";
        fiber.textContent = fib + " g";

        // Health Score
        let healthScore = 100;

        if (cal > 350) healthScore -= 15;
        if (carb > 50) healthScore -= 15;
        if (sug > 20) healthScore -= 20;
        if (fib >= 5) healthScore += 10;
        if (prot >= 15) healthScore += 10;

        healthScore = Math.max(20, Math.min(100, healthScore));

        score.textContent = healthScore + "/100";

        // Progress bars
        proteinBar.style.width = Math.min(prot * 4, 100) + "%";
        carbBar.style.width = Math.min(carb, 100) + "%";
        fiberBar.style.width = Math.min(fib * 10, 100) + "%";

        // Smart Tip
        if (fib >= 5) {
            tip.textContent = "🥬 High in fiber. Great for digestion!";
        } else if (prot >= 20) {
            tip.textContent = "💪 Excellent source of protein!";
        } else if (sug >= 20) {
            tip.textContent = "⚠️ High in sugar. Enjoy in moderation.";
        } else if (cal >= 400) {
            tip.textContent = "🍽️ High in calories. Watch your portions.";
        } else {
            tip.textContent = "✅ A balanced food choice!";
        }

    } catch (error) {

        console.error(error);

        foodName.textContent = "Connection Error";
        tip.textContent = "Couldn't connect to the USDA database. Please check your API key or internet connection.";

    }

}
