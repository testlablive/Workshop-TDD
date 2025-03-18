namespace PlanningPokerApi
{
    public class Session
    {
        public Guid Id { get; private set; }
        public string Title { get; private set; }
        public string Description { get; private set; }

        public static Session StartSession()
        {
            return new Session {
                Id = Guid.NewGuid(),
                Title = "Any valid planning session",
                Description = "Planning Poker for any valid planning session"
            };
        }
    }
}
