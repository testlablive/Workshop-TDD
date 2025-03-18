using Microsoft.EntityFrameworkCore;
using PlanningPokerApi.Sessions;

namespace PlanningPokerApi
{
    public class PlanningPokerContext : DbContext
    {
        public PlanningPokerContext(DbContextOptions<PlanningPokerContext> options)
        : base(options)
        {
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (optionsBuilder.IsConfigured)
            {
                return;
            }

            optionsBuilder.UseSqlite("Data Source = " +
          Path.Combine(Directory.GetCurrentDirectory(), "planningpoker.sqlite"));
        }

        public DbSet<Session> Sessions { get; set; } = null!;
    }
}