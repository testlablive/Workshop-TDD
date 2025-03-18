using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace PlanningPokerApi.Tests
{
    public class BaseTests
    {
        public static SessionRequest GetAnyValidSession(string title=null!, string description=null!)
        {
            var anyValidSession = new SessionRequest
            {
                Id = Guid.Empty,
                Title = title ?? "Any valid planning session",
                Description = description ?? "Planning Poker for any valid planning session"
            };

            return anyValidSession;
        }
    }
}
