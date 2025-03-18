mkdir backend
cd backend

dotnet new sln -n PlanningPokerApi
dotnet new webapi --use-controllers -o PlanningPokerApi
dotnet new xunit -o PlanningPokerApi.Tests
dotnet sln add PlanningPokerApi
dotnet sln add PlanningPokerApi.Tests

del PlanningPokerAPI\Controllers\WeatherForecastController.cs
del PlanningPokerAPI\Controllers\
del PlanningPokerAPI\WeatherForecast.cs

