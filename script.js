const API_KEY = "VkNptkZejMnziNRguqo720nuF0VVOOUWPAMKRB0d";

const input = document.getElementById("foodInput");
const result = document.getElementById("result");

document.getElementById("darkModeBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchFood();
    }
});

function quickSearch(food) {
    input.value = food;
    searchFood();
}

async function searchFood() {

    const query = input.value.trim();

    if (!query) {
        alert("Please enter a food.");
        return;
    }

    result.style.display = "block";
    document.getElementById("foodName").textContent = "Searching...";

    try {

        const response = await fetch(
            `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=1&api_key=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        if (!data.foods || data.foods.length === 0) {
            document.getElementById("foodName").textContent = "Food Not Found";
            document.getElementById("tip").textContent = "Try searching for another food.";
            return;
        }

        const food = data.foods[0];

        let nutrients = {};

        food.foodNutrients.forEach(n => {
            nutrients[n.nutrientName] = n.value || 0;
        });

        const calories = Math.round(nutrients["Energy"] || 0);
        const protein = +(nutrients["Protein"] || 0).toFixed(1);
        const carbs = +(nutrients["Carbohydrate, by difference"] || 0).toFixed(1);
        const sugar = +(nutrients["Sugars, total including NLEA"] || 0).toFixed(1);
        const fiber = +(nutrients["Fiber, total dietary"] || 0).toFixed(1);

        document.getElementById("foodName").textContent = food.description;

        document.getElementById("calories").textContent = calories + " kcal";
        document.getElementById("protein").textContent = protein + " g";
        document.getElementById("carbs").textContent = carbs + " g";
        document.getElementById("sugar").textContent = sugar + " g";
        document.getElementById("fiber").textContent = fiber + " g";

        let score = 100;

        if (calories > 350) score -= 15;
        if (carbs > 50) score -= 15;
        if (sugar > 20) score -= 20;
        if (fiber >= 5) score += 10;
        if (protein >= 15) score += 10;

        score = Math.max(20, Math.min(100, score));

        document.getElementById("score").textContent = score + "/100";

        document.getElementById("proteinBar").style.width = Math.min(protein * 4, 100) + "%";
        document.getElementById("carbBar").style.width = Math.min(carbs, 100) + "%";
        document.getElementById("fiberBar").style.width = Math.min(fiber * 10, 100) + "%";

        let tip = "Enjoy as part of a balanced diet.";

        if (fiber >= 5) {
            tip = "🥬 High in fiber. Great for digestive health.";
        } else if (protein >= 20) {
            tip = "💪 Excellent source of protein.";
        } else if (sugar >= 20) {
            tip = "⚠️ High in sugar. Eat in moderation.";
        } else if (calories >= 400) {
            tip = "🍽️ Higher in calories. Watch portion size.";
        }

        document.getElementById("tip").textContent = tip;

    } catch (error) {

        console.error(error);

        document.getElementById("foodName").textContent = "Connection Error";
        document.getElementById("tip").textContent =
            "Could not connect to the USDA database.";

    }
}

const favoriteBtn = document.getElementById("favoriteBtn");

let saved = false;

favoriteBtn.addEventListener("click", () => {
    saved = !saved;
    favoriteBtn.textContent = saved ? "❤️ Saved" : "🤍 Save";
});
