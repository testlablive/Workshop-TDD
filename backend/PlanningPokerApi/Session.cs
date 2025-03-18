namespace PlanningPokerApi
{
    public class Session
    {
        public Guid Id { get; private set; }

        public static Session StartSession()
        {
            return new Session { Id = Guid.NewGuid() };
        }
    }
}
