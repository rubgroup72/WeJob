using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using Proj_WeJob.Models;
namespace Proj_WeJob.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class InterstController:ApiController
    {
        [HttpGet]
        [Route("api/Interst")]
        public IEnumerable<Interst> GET()
        {
            Interst i = new Interst();
            return i.ReadInterst();
        }
    }
}