using FluentValidation.AspNetCore;
using Hahn.ApplicatonProcess.December2020.Data;
using Hahn.ApplicatonProcess.December2020.Domain.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Hahn.ApplicatonProcess.December2020.Data.IRepositories;
using Hahn.ApplicatonProcess.December2020.Data.Repository;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Hahn.ApplicatonProcess.December2020.Domain.IService;
using Hahn.ApplicatonProcess.December2020.Domain.Service;
using Hahn.ApplicatonProcess.December2020.Domain.Options;
using System.Reflection;
using System.IO;
using System;

namespace Hahn.ApplicatonProcess.December2020.Domain
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            services.AddCors();

            services.AddAutoMapper(typeof(Startup));

            services.AddMvc().ConfigureApiBehaviorOptions(options =>
            {
                options.InvalidModelStateResponseFactory = c =>
                {
                    var errors = c.ModelState.Where(x => x.Value.Errors.Count > 0).Select(p => new { field = p.Key, error = p.Value.Errors.Select(t => t.ErrorMessage) });

                    return new BadRequestObjectResult(errors.ToList());
                };
            }).AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<ApplicantValidator>());

            services.AddDbContext<DataContext>(options =>
                options.UseInMemoryDatabase(databaseName: "Applicants"));

            // Repositories
            services.AddScoped<IApplicantRepository, ApplicantRepository>();
            services.AddScoped<IUnitofWork, UnitofWork>();

            // Services
            services.AddScoped<IApplicantService, ApplicantService>();


            // swagger
            services.AddSwaggerGen(x =>
            {
                x.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "Hahn Application Process API", Version = "v1" });
                x.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                x.IncludeXmlComments(xmlPath);
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // swagger
            //var swaggerOptions = new SwaggerOptions();
            //Configuration.GetSection(nameof(SwaggerOptions)).Bind(swaggerOptions);

            app.UseSwagger(option =>
            {
                option.RouteTemplate = "swagger/{documentName}/swagger.json";
            });

            app.UseSwaggerUI(option => { option.SwaggerEndpoint("v1/swagger.json", "Hahn Application Process API"); });


            app.UseHttpsRedirection();

            app.UseCors(builder =>
                builder.WithOrigins("http://localhost:8080")
                    .AllowAnyHeader().AllowAnyMethod());

            app.UseCors(builder =>
                builder.AllowAnyOrigin()
                .AllowAnyHeader().AllowAnyMethod());

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
