using System.Collections.Generic;
using System.Web.Http;
using Proj_WeJob.Models.DAL;

namespace Proj_WeJob.Controllers
{
    public class CitesController:ApiController
    {
        public IEnumerable<string> Get()
        {
            XML_Sevices xmls = new XML_Sevices();
            return xmls.ReadRss();
        }
    }
}