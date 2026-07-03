const API_KEY = "VkNptkZejMnziNRguqo720nuF0VVOOUWPAMKRB0d";

const searchBtn = document.querySelector(".search-container button");
const input = document.getElementById("foodInput");
const result = document.getElementById("result");

input.addEventListener("keypress", function(e){
    if(e.key==="Enter"){
        searchFood();
    }
});

document.getElementById("darkModeBtn").addEventListener("click",()=>{
    document.body.classList.toggle("dark");
});

function quickSearch(food){
    input.value = food;
    searchFood();
}

async function searchFood(){

    const query = input.value.trim();

    if(query===""){
        alert("Please enter a food.");
        return;
    }

    result.style.display="block";

    document.getElementById("foodName").innerHTML="Searching...";
    document.getElementById("calories").innerHTML="...";
    document.getElementById("protein").innerHTML="...";
    document.getElementById("carbs").innerHTML="...";
    document.getElementById("sugar").innerHTML="...";
    document.getElementById("fiber").innerHTML="...";
    document.getElementById("score").innerHTML="...";
    document.getElementById("glucose").innerHTML="...";
    document.getElementById("tip").innerHTML="Loading nutrition...";

    try{

        const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=1&api_key=${API_KEY}`);

        const data = await response.json();

        if(!data.foods || data.foods.length===0){

            document.getElementById("foodName").innerHTML="Food Not Found";
            document.getElementById("tip").innerHTML="Try another food.";
            return;

        }

        const food = data.foods[0];

        let nutrients={};

        food.foodNutrients.forEach(n=>{

            nutrients[n.nutrientName]=n.value;

        });

        const calories=Math.round(nutrients["Energy"]||0);

        const protein=Math.round((nutrients["Protein"]||0)*10)/10;

        const carbs=Math.round((nutrients["Carbohydrate, by difference"]||0)*10)/10;

        const sugar=Math.round((nutrients["Sugars, total including NLEA"]||0)*10)/10;

        const fiber=Math.round((nutrients["Fiber, total dietary"]||0)*10)/10;

        document.getElementById("foodName").innerHTML=food.description;

        document.getElementById("calories").innerHTML=calories+" kcal";

        document.getElementById("protein").innerHTML=protein+" g";

        document.getElementById("carbs").innerHTML=carbs+" g";

        document.getElementById("sugar").innerHTML=sugar+" g";

        document.getElementById("fiber").innerHTML=fiber+" g";

        // Health Score

        let score=100;

        if(calories>350) score-=15;

        if(carbs>45) score-=15;

        if(sugar>20) score-=20;

        if(fiber>5) score+=10;

        if(protein>15) score+=10;

        if(score>100) score=100;

        if(score<20) score=20;

        document.getElementById("score").innerHTML=score+"/100";

        // Glucose Impact

        let glucose="🟢 Low";

        if(carbs>25) glucose="🟡 Moderate";

        if(carbs>50) glucose="🔴 High";

        document.getElementById("glucose").innerHTML=glucose;

        // Health Tip

        let tip="Enjoy as part of a balanced diet.";

        if(fiber>5)
            tip="✅ High in fiber which supports digestive health.";

        else if(protein>20)
            tip="💪 Excellent source of protein.";

        else if(sugar>20)
            tip="⚠️ High in sugar. Enjoy in moderation.";

        else if(calories>400)
            tip="🍽️ Higher in calories. Watch portion size.";

        document.getElementById("tip").innerHTML=tip;

    }

    catch(error){

        document.getElementById("foodName").innerHTML="Connection Error";

        document.getElementById("tip").innerHTML="Could not connect to USDA database.";

        console.log(error);

    }

}
