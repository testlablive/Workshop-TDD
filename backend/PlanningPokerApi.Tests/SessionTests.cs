using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http.Json;

namespace PlanningPokerApi.Tests;

public class SessionTests : BaseTests
{
    internal WebApplicationFactory<Program> _webApp;
    internal HttpClient _api;

    public SessionTests()
    {
        if (_webApp == null)
        {
            _webApp = new WebApplicationFactory<Program>();
        }

        if (_api == null)
        {
            _api = _webApp.CreateClient();
        }
    }

    [Fact]
    public async Task StartSession_WithValidRequest_ReturnsCreated()
    {
        var anyValidSession = GetAnyValidSession();

        var addResponse = await _api.PostAsJsonAsync("session", anyValidSession);

        Assert.Equal(System.Net.HttpStatusCode.Created, addResponse.StatusCode);
    }

    [Fact]
    public async Task StartSession_WithValidRequest_ReturnsValidId()
    {
        var anyValidSession = GetAnyValidSession();

        var addResponse = await _api.PostAsJsonAsync("session", anyValidSession);

        var retrievedSession = await addResponse.Content.ReadFromJsonAsync<SessionResponse>();
        Assert.NotEqual(Guid.Empty, retrievedSession!.Id);
    }

    [Fact]
    public async Task StartSession_WithValidRequest_ReturnsLocationToSession()
    {
        var anyValidSession = GetAnyValidSession();

        var addResponse = await _api.PostAsJsonAsync("session", anyValidSession);

        var retrievedSession = await addResponse.Content.ReadFromJsonAsync<SessionResponse>();
        var retrievedLocation = addResponse.Headers.Location;
        Assert.Equal($"session/{retrievedSession!.Id}", retrievedLocation!.ToString());
    }

    [Fact]
    public async Task StartSession_WithValidRequest_ReturnsSessionDetails()
    {
        var anyValidSession = GetAnyValidSession();

        var addResponse = await _api.PostAsJsonAsync("session", anyValidSession);

        var retrievedSession = await addResponse.Content.ReadFromJsonAsync<SessionResponse>();
        Assert.Equal(anyValidSession.Title, retrievedSession!.Title);
        Assert.Equal(anyValidSession.Description, retrievedSession!.Description);
    }
}
