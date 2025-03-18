using Microsoft.EntityFrameworkCore;
using PlanningPokerApi;
using PlanningPokerApi.Sessions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddDbContext<PlanningPokerContext>(opt => opt.UseSqlite("Data Source = " +
          Path.Combine(Directory.GetCurrentDirectory(), "planningpoker.sqlite")));
builder.Services.AddScoped<ISessionRepository, SessionRepository>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<PlanningPokerContext>();
    context.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program { }