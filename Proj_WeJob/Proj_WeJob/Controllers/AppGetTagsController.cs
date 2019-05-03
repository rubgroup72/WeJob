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
    public class AppGetTagsController : ApiController
    {
        //פונקציה שמביאה את כל התגיות מהדטא בייס לפי קוד קטגוריה
        [HttpGet]
        [Route("api/AppGetTagsbyCategory")]
        public List<Tags> Get(int categoryCode)
        {
            Tags t = new Tags();
            return t.GetAllTags(categoryCode);
        }
    }
}
