using System.Collections.Generic;
using System.Web.Http;
using Proj_WeJob.Models;

namespace Proj_WeJob.Controllers
{
    public class SubCategoryController:ApiController
    {
        [HttpGet]
        [Route("api/SubCategory")]
        public IEnumerable<SubCategory> GET(string CategoryNo)
        {
            SubCategory sc = new SubCategory();
            return sc.GetListSubCategory(CategoryNo);
        }
    }
}