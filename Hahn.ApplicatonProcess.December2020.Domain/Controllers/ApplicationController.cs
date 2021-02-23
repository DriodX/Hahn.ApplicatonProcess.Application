using AutoMapper;
using Hahn.ApplicatonProcess.December2020.Data.Models;
using Hahn.ApplicatonProcess.December2020.Domain.ApiResource.Request;
using Hahn.ApplicatonProcess.December2020.Domain.ApiResource.Response;
using Hahn.ApplicatonProcess.December2020.Domain.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hahn.ApplicatonProcess.December2020.Domain.Controllers
{
    /// <summary>
    /// Application Controller responsible for GET/POST/PUT/DELETE to handle applications
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class ApplicationController : ControllerBase
    {
        private readonly ILogger<ApplicationController> _logger;
        private readonly IMapper _mapper;
        private readonly IApplicantService _applicantService;

        public ApplicationController(ILogger<ApplicationController> logger, IMapper mapper, IApplicantService applicantService)
        {
            _logger = logger;
            this._mapper = mapper;
            this._applicantService = applicantService;
        }

        /// <summary>
        /// Creates an applicant
        /// </summary>
        /// <param name="model"></param>
        /// <response code="201">Returns the id, get url and name of the created applicant</response>
        /// <response code="400">Returns an array of error description</response>
        [HttpPost]
        [ProducesResponseType(typeof(ApplicantCreationResponse), StatusCodes.Status201Created)] // Create
        [ProducesResponseType(typeof(List<string>), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Post([FromBody] ApplicantRequest model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new List<string> { "one or more validation error occured." });

                var applicant = _mapper.Map<Applicant>(model);
                var createdapplicant = await _applicantService.CreateAsync(applicant);

                if (createdapplicant != null)
                {
                    return Created("", new ApplicantCreationResponse
                    {
                        id = createdapplicant.Id,
                        url = $"{ this.Request.Scheme }://{this.Request.Host}{this.Request.PathBase}{ Request.Path.Value}?id={ createdapplicant.Id }",
                        name = createdapplicant.Name,
                        familyName = createdapplicant.FamilyName
                    }); 
                }
                else
                {
                    return BadRequest(new List<string> { "cannot create applicant" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest(new List<string> { "Could not create applicant;", ex.Message });
            }
        }

        /// <summary>
        /// Update an applicant
        /// </summary>
        /// <param name="model"></param>
        /// <response code="200">Returns the updated applicant object</response>
        /// <response code="404">Returns not found if applicant doesn't exist</response>
        /// <response code="400">Returns cannot update applicant with an array of error description</response>
        [HttpPut]
        [ProducesResponseType(typeof(ApplicantResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(List<string>), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Put([FromBody] ApplicantRequest model)
        {
            try
            {
                var applicant = _mapper.Map<Applicant>(model);
                //applicant.Id = id;
                var checkexist = await _applicantService.ReadSingleAsync(applicant.Id, false);
                if (checkexist == null)
                    return NotFound();

                if (applicant != null)
                {
                    await _applicantService.UpdateAsync(applicant);
                    var applicantResponse = _mapper.Map<ApplicantResponse>(applicant);
                    return Ok(applicantResponse);
                }
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest(new List<string> { "cannot update applicant", ex.Message });
            }
        }

        /// <summary>
        /// Get an applicant with a provided Id
        /// </summary>
        /// <param name="id" example="1">The applicant's id</param>
        /// <response code="200">Returns an applicant object</response>
        /// <response code="404">Returns not found if applicant doesn't exist</response>
        /// <response code="400">Returns cannot get applicant with an array of error description</response>
        [HttpGet]
        [ProducesResponseType(typeof(ApplicantResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(List<string>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Route("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            try
            {
                var applicant = await _applicantService.ReadSingleAsync(id, false);
                if (applicant != null)
                {
                    var response = _mapper.Map<ApplicantResponse>(applicant);
                    return Ok(response);
                }
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest(new List<string> { "cannot get applicant" });
            }
        }

        /// <summary>
        /// Gets all application in the system
        /// </summary>
        /// <response code="200">Returns a list of applicants</response>
        /// <response code="204">Returns an empty array</response>
        /// <response code="400">Returns could not get applicants</response>
        [HttpGet]
        [ProducesResponseType(typeof(List<ApplicantResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(List<string>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var applicants = await _applicantService.ReadAllAsync();
                if (applicants != null)
                {
                    var response = _mapper.Map<List<ApplicantResponse>>(applicants);
                    return Ok(response);
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest(new List<string> { "could not get applicants" });
            }
        }

        /// <summary>
        /// Delets an applicant with a provided Id from the system
        /// </summary>
        /// <param name="id" example="1">The applicant's id</param>
        /// <response code="200">Returns Deleted Successfully</response>
        /// <response code="40o">Returns cannot delete applicant with addition error messages</response>
        /// <response code="404">Returns not found if the applicant doesn't exist in the system</response>
        [HttpDelete]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(List<string>), StatusCodes.Status400BadRequest)]
        [Route("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var applicant = await _applicantService.ReadSingleAsync(id, false);
                if (applicant != null)
                {
                    var response = _mapper.Map<ApplicantResponse>(applicant);
                    await _applicantService.DeleteAsync(id);
                    return Ok("Deleted Successfully");
                }
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest(new List<string> { "cannot delete applicant", ex.Message });
            }
        }
    }
}