using FluentValidation;
using Hahn.ApplicatonProcess.December2020.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Hahn.ApplicatonProcess.December2020.Domain.Models
{
    public class Applicant : EntityBase<int>, IEntity<int>
    {
        public override int Id { get; set; }
        public string Name { get; set; }
        public string FamilyName { get; set; }
        public string Address { get; set; }
        public string CountryOfOrigin { get; set; }
        public string EmailAddress { get; set; }
        public int Age { get; set; }
        public bool Hired { get; set; }
    }

    public class ApplicantValidator : AbstractValidator<Applicant>
    {
        public ApplicantValidator()
        {
            RuleFor(x => x.Name).Length(5, 50);
            RuleFor(x => x.FamilyName).Length(5, 50);
            RuleFor(x => x.Address).Length(10, int.MaxValue);
            RuleFor(x => x.Age).InclusiveBetween(20, 60);
            RuleFor(x => x.Hired).NotNull();

            RuleFor(x => x.EmailAddress).Custom((value, context) =>
            {
                var tldIndex = value.LastIndexOf(".");
                var tld = value.Substring(tldIndex + 1);
                if (!value.Contains('@') || tld.Count() <= 1)
                    context.AddFailure("'Email Address' is not a valid email address.");
            });

            RuleFor(x => x.CountryOfOrigin).Custom((value, context) =>
            {
                // check if contry exist
                using (var client = new HttpClient())
                {
                    var response = client
                    .GetAsync(string.Format("https://restcountries.eu/rest/v2/name/{0}?fullText=true", value))
                    .GetAwaiter().GetResult();

                    if (!response.IsSuccessStatusCode)
                    {
                        context.AddFailure("The country of origin is invalid");
                    }
                }
            });
        }
    }
}
