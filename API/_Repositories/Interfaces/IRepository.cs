using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace API._Repositories.Interfaces
{
    public interface IRepository<T> where T : class
    {
        Task<T> FindById(object id);

        Task<T> FindSingle(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includeProperties);

        IQueryable<T> FindAll(params Expression<Func<T, object>>[] includeProperties);

        IQueryable<T> FindAll(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includeProperties);

        void Add(T entity);

        void AddMultiple(List<T> entities);

        void Update(T entity);

        void UpdateMultiple(List<T> entities);

        void Remove(T entity);

        void Remove(object id);

        void RemoveMultiple(List<T> entities);

        Task<bool> Save();

    }
}