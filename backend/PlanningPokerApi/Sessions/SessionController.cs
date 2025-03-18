using Microsoft.AspNetCore.Mvc;

namespace PlanningPokerApi.Sessions;

[ApiController]
[Route("[controller]")]
public class SessionController : ControllerBase
{
    private readonly ISessionRepository _sessionRepository;

    public SessionController(ISessionRepository sessionRepository)
    {
        _sessionRepository = sessionRepository;
    }

    [HttpPost()]
    [ProducesResponseType(typeof(Session), 201)]
    public async Task<ActionResult> StartSession([FromBody] AddSessionRequest request)
    {
        var session = Session.StartSession(request);

        await _sessionRepository.AddAsync(session);

        return Created($"session/{session.Id}", session);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Session), 200)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetSession([FromRoute] Guid id)
    {
        var session = await _sessionRepository.GetAsync(id);

        return session == null ? NotFound() : Ok(session);
    }
}

