using Microsoft.AspNetCore.Mvc;

namespace PlanningPokerApi;

[ApiController]
[Route("[controller]")]
public class SessionController : ControllerBase
{
    [HttpPost]
    public ActionResult StartSession()
    {
        return Created("", new { Id = Guid.NewGuid() } );
    }
}

