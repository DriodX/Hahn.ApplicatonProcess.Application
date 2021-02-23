using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hahn.ApplicatonProcess.December2020.Domain.Models
{
    public interface IEntity<TKey> where TKey : IComparable
    {
        TKey Id { get; set; }
    }
}
