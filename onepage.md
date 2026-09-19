## What it is? 
it tells the nutritional value of the day


## Who is it for?
Ahmed, tech bro, he is always on his laptop thefore doesn't really care what he eats no track it and he's looking quite unkempt 


## The screens
1. authentication = signup, login, logout, forgot password, password reset
2. Dashboard - where they see their nutritional value of the day, meals of the day and past days 
3. Screen input for the meals they had that day - it can be edited for update purpose
4. Nutriitonal value analysis screen for the day


## What happens on each (userflows)
authentication => dashboard (person choses date) => Nutritional value page 

authentication => dashboard => enter meal(s) of the day => Nutritional value page

Logout function 


## What it will not do
1. No photo uploads of food (not yet)
2. We are not building physical tech wearables etc into the app yet (not yet)
3. We are not building the mobile app yet (not yet)
4. No comparison of patient data  (never)
5. no suggestions of meals (not yet)
6. No medical diagnosis (not yet)
7. No Daily goals on nutritional value
8. No Log and Edit past date meals
9. No Switch Account to view other users


## What it is called
NutriiApp, 


Do no
## Notes
User enters rice 1 plate
nutrients that count are all tied to the 6 classes of food no measurement and data gets locked in by an API or AI model

meal entry model: free text + quanity/unit + meal categories (breakfast/lunch/dinner/snack etc.)
light analysis screen will be on the dashboard with a chart and data while the nutritioal valuye page carries a particular day's data
dashbaord auto loads today, then user cna change date to view past dates no future dates
past dates whos all days however, only the current calendar month will be in view 

Tech Stack: 
A JavaScript Framework, database 