namespace Hahn.ApplicatonProcess.December2020.Domain.ApiResource.Response
{
    public class ApplicantCreationResponse
    {
        /// <summary>
        /// Applicant's id
        /// </summary>
        /// <example>1</example>
        public int id { get; set; }

        /// <summary>
        /// A url for getting this applicant
        /// </summary>
        /// <example>https://localhost:44383/api/Application?id=1</example>
        public string url { get; set; }

        /// <summary>
        /// Applicant's name
        /// </summary>
        /// <example>Mordecai</example>
        public string name { get; set; }

        /// <summary>
        /// Applicant's lastname
        /// </summary>
        /// <example>Godwin</example>
        public string familyName { get; set; }
    }
}