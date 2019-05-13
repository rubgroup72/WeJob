using Proj_WeJob.Models;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace Proj_WeJob.Controllers
{
    public class CategoryController:ApiController
    {
        [HttpGet]
        [Route("api/Categorys")]
        public List<Category> Get()
        {
            Category C = new Category();
            return C.ReadCategories();
        }
    }
}