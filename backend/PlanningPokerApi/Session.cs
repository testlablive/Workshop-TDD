namespace PlanningPokerApi
{
    public class Session
    {
        public Guid Id { get; private set; }
        public string Title { get; private set; }
        public string Description { get; private set; }

        public static Session StartSession(AddSessionRequest request)
        {
            return new Session {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Description = request.Description
            };
        }
    }
}
