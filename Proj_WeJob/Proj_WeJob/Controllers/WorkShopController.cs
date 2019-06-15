
﻿using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Cors;
using Proj_WeJob.Models;
namespace Proj_WeJob.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class WorkShopController : ApiController
    {
        [HttpGet]
        [Route("api/WorkShops")]
        public IEnumerable<WorkShop> GET()
        {
            WorkShop w = new WorkShop();
            return w.GetListWorkShop();
        }
    }
}