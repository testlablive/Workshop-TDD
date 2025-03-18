using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http.Json;

namespace PlanningPokerApi.Tests;

public class SessionTests
{
    [Fact]
    public async Task StartSession_WithValidRequest_ReturnsCreated()
    {
        var webapp = new WebApplicationFactory<Program>();
        var client = webapp.CreateClient();
        var addResponse = await client.PostAsJsonAsync("session", new
        {
            title = "Any valid planning session",
            description = "Planning Poker for any valid planning session"
        });

        Assert.Equal(System.Net.HttpStatusCode.Created, addResponse.StatusCode);
    }

    [Fact]
    public async Task StartSession_WithValidRequest_ReturnsValidId()
    {
        var webapp = new WebApplicationFactory<Program>();
        var client = webapp.CreateClient();
        var addResponse = await client.PostAsJsonAsync("session", new
        {
            title = "Any valid planning session",
            description = "Planning Poker for any valid planning session"
        });
        var retrievedSession = await addResponse.Content.ReadFromJsonAsync<SessionResponse>();

        Assert.NotEqual(Guid.Empty, retrievedSession.Id);
    }
}
