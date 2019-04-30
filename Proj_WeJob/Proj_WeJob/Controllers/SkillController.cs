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
    public class SkillController:ApiController
    {
        [HttpGet]
        [Route("api/Skill")]
        public IEnumerable<Skill> GET()
        {
            Skill s = new Skill();
            return s.ReadSkill();
        }
    }
}