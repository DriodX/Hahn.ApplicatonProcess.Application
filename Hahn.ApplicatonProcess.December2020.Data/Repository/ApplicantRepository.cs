using Hahn.ApplicatonProcess.December2020.Data.IRepositories;
using Hahn.ApplicatonProcess.December2020.Data.Models;

namespace Hahn.ApplicatonProcess.December2020.Data.Repository
{
    public class ApplicantRepository : BaseRepository<Applicant>, IApplicantRepository
    {
        public ApplicantRepository(DataContext dataEngineDbContext) : base(dataEngineDbContext)
        {
        }
    }
}