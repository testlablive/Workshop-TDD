namespace PlanningPokerApi.Sessions
{
    public class SessionRepository : ISessionRepository
    {
        public PlanningPokerContext Context { get; private set; }

        public SessionRepository(PlanningPokerContext context)
        {
            Context = context;
        }
        public async Task<Session> AddAsync(Session session)
        {
            Context.Sessions.Add(session);

            await Context.SaveChangesAsync();

            return session;
        }
        public async Task<Session> GetAsync(Guid id)
        {
            return await Context.Sessions.FindAsync(id);
        }
    }
}
