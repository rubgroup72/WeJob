using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Cors;
using Proj_WeJob.Models;


namespace Proj_WeJob.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class SubDepartmentController:ApiController
    {
        [HttpGet]
        [Route("api/SubDepartments")]
        public IEnumerable<SubDepartment> GET(string codeDepartment)
        {
            SubDepartment d = new SubDepartment();
            return d.GetListSubDepartment(codeDepartment);
        }
    }
}