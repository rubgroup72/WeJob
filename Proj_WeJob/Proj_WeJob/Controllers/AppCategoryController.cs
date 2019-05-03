using Proj_WeJob.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Proj_WeJob.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AppCategoryController : ApiController
    {
        [HttpGet]
        [Route("api/Category")]
        public List<Category> GET()
        {
            Category Ca = new Category();
            return Ca.ReadCategories();
        }
    }
}
