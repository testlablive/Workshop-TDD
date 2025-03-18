using Microsoft.AspNetCore.Mvc;

namespace PlanningPokerApi;

[ApiController]
[Route("[controller]")]
public class SessionController : ControllerBase
{
    [HttpPost]
    public ActionResult StartSession()
    {
        var session = Session.StartSession();

        return Created($"session/{session.Id}", session);
    }
}

