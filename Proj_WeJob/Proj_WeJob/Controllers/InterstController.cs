using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Proj_WeJob.Models;
namespace Proj_WeJob.Controllers
{
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