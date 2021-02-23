using Hahn.ApplicatonProcess.December2020.Data.IRepositories;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Threading.Tasks;

namespace Hahn.ApplicatonProcess.December2020.Data.Repository
{
    public class UnitofWork : IUnitofWork
    {
        private readonly DataContext _context;

        public UnitofWork(DataContext dataEngineDbContext)
        {
            this._context = dataEngineDbContext;
        }

        public IDbContextTransaction BeginTransaction()
        {
            return _context.Database.BeginTransaction();
        }

        public async Task<bool> SubmitChangesAsync()
        {
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
