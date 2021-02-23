using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hahn.ApplicatonProcess.December2020.Domain.ApiResource.Response
{
    public class ApplicantResponse
    {
        /// <summary>
        /// Applicant's id
        /// </summary>
        /// <example>1</example>
        public int id { get; set; }

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

        /// <summary>
        /// Applicant's address
        /// </summary>
        /// <example> Akere Street, Ibadan</example>
        public string address { get; set; }

        /// <summary>
        /// Applicant's country of origin
        /// </summary>
        /// <example>Nigeria</example>
        public string countryOfOrigin { get; set; }

        /// <summary>
        /// Applicant's email
        /// </summary>
        ///  <example>davidire71@gmail.com</example>
        public string emailAddress { get; set; }

        /// <summary>
        /// Applicant age
        /// </summary>
        /// <example> 24 </example>
        public int age { get; set; }

        /// <summary>
        /// Is applicant hired?
        /// </summary>
        ///  <example> true </example>
        public bool hired { get; set; } = false;
    }
}
