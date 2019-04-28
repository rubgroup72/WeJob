using System.Collections.Generic;
using System.Web.Http;
using Proj_WeJob.Models;

namespace Proj_WeJob.Controllers
{
    public class CategoryController : ApiController
    {
        //הפעלת פונקציה שמחזירה את כל המפיצים
        [HttpGet]
        [Route("api/Category")]
        public IEnumerable<Category> Get()
        {
            Category d = new Category();
            return d.GetListCategory();
        }
    }
}