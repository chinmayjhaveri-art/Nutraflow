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
/* ==========================
   FOOTER
========================== */

footer{
    margin-top:80px;
    padding:35px 20px;
    text-align:center;
    color:#6B7280;
    font-size:15px;
}

/* ==========================
   DARK MODE
========================== */

.dark{
    background:#0F172A;
    color:white;
}

.dark nav{
    background:#111827;
}

.dark .logo{
    color:#4ADE80;
}

.dark .hero h1,
.dark .hero h2,
.dark .popular h2,
.dark .section-title,
.dark .food-header h2{
    color:white;
}

.dark .hero p{
    color:#CBD5E1;
}

.dark .search-container input{
    background:#1E293B;
    color:white;
    border:1px solid #334155;
}

.dark .search-container input::placeholder{
    color:#94A3B8;
}

.dark .chips button{
    background:#1E293B;
    color:white;
}

.dark .chips button:hover{
    background:#16A34A;
}

.dark .result-card{
    background:#111827;
}

.dark .box{
    background:#1E293B;
    color:white;
}

.dark .box span{
    color:#4ADE80;
}

.dark .bar{
    background:#334155;
}

.dark .tip{
    background:#3F3F1A;
}

.dark .tip p{
    color:#E5E7EB;
}

.dark footer{
    color:#CBD5E1;
}

/* ==========================
   RESPONSIVE
========================== */

@media (max-width:992px){

    nav{
        flex-direction:column;
        gap:18px;
    }

    .hero{
        padding:60px 20px;
    }

    .hero h1{
        font-size:52px;
    }

    .hero h2{
        font-size:32px;
    }

    .search-container{
        flex-direction:column;
    }

    .search-container input,
    .search-container button{
        width:100%;
        max-width:600px;
    }

    .food-header{
        flex-direction:column;
        text-align:center;
    }

}

@media (max-width:768px){

    .hero{
        padding:40px 20px;
    }

    .hero h1{
        font-size:40px;
    }

    .hero h2{
        font-size:26px;
    }

    .hero p{
        font-size:16px;
    }

    .result-card{
        margin:20px;
        padding:25px;
    }

    .nutrition-grid{
        grid-template-columns:1fr;
    }

    .circle{
        width:140px;
        height:140px;
        font-size:32px;
    }

    .chips{
        justify-content:center;
    }

}

/* ==========================
   SCROLLBAR
========================== */

::-webkit-scrollbar{
    width:10px;
}

::-webkit-scrollbar-track{
    background:#E5E7EB;
}

::-webkit-scrollbar-thumb{
    background:#16A34A;
    border-radius:20px;
}

::-webkit-scrollbar-thumb:hover{
    background:#15803D;
}

/* ==========================
   GLOBAL BUTTONS
========================== */

button{
    transition:.3s;
}

button:hover{
    transform:translateY(-2px);
}

.result-card:hover{
    box-shadow:0 30px 70px rgba(0,0,0,.15);
}
