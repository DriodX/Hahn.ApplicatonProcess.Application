using Hahn.ApplicatonProcess.December2020.Data.IRepositories;
using Hahn.ApplicatonProcess.December2020.Data.Models;
using Hahn.ApplicatonProcess.December2020.Domain.IService;
using Microsoft.Extensions.Logging;

namespace Hahn.ApplicatonProcess.December2020.Domain.Service
{
    public class ApplicantService : BaseService<Applicant>, IApplicantService
    {
        private readonly IApplicantRepository applicantRepository;

        public ApplicantService(IApplicantRepository applicantRepository, IUnitofWork unitofWork, ILogger<Applicant> logger) : base(applicantRepository, unitofWork, logger)
        {
            this.applicantRepository = applicantRepository;
        }
    }
}