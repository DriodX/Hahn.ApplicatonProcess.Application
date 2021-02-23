using AutoMapper;
using Hahn.ApplicatonProcess.December2020.Data.Models;
using Hahn.ApplicatonProcess.December2020.Domain.ApiResource.Request;
using Hahn.ApplicatonProcess.December2020.Domain.ApiResource.Response;

namespace Hahn.ApplicatonProcess.December2020.Domain.ApiResource.MappingProfile
{
    public class ApplicantProfile : Profile
    {
        public ApplicantProfile()
        {
            CreateMap<ApplicantRequest, Applicant>();
            CreateMap<Applicant, ApplicantResponse>();
        }
    }
}
