namespace PlanningPokerApi.Sessions
{
    public interface ISessionRepository
    {
        Task<Session> AddAsync(Session session);
        Task<Session> GetAsync(Guid id);
    }
}
