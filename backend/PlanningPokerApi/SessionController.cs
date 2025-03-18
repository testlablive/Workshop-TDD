using Microsoft.AspNetCore.Mvc;

namespace PlanningPokerApi;

[ApiController]
[Route("[controller]")]
public class SessionController : ControllerBase
{
    private readonly PlanningPokerContext _context;

    public SessionController(PlanningPokerContext context)
    {
        _context = context;
    }

    [HttpPost()]
    public async Task<ActionResult> StartSession([FromBody] AddSessionRequest request)
    {
        var session = Session.StartSession(request);
        _context.Sessions.Add(session);
        await _context.SaveChangesAsync();

        return Created($"session/{session.Id}", session);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetSession([FromRoute] Guid id)
    {
        var session = await _context.Sessions.FindAsync(id);

        return (session == null) ? NotFound() : Ok(session);
    }
}

